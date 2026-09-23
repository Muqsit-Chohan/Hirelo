import { test, before, after, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

let server;
let base;
const userId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const user = { _id: userId, fullName: "Test User", email: "test@example.com", role: "job Seeker", isVerified: true, profile: {} };

function token(role = "job Seeker") {
  return jwt.sign({ userId, role }, process.env.SECRET_KEY);
}
function request(path, { role, ...options } = {}) {
  return fetch(base + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(role ? { Authorization: `Bearer ${token(role)}` } : {}), ...options.headers },
  });
}

before(async () => {
  process.env.SECRET_KEY = "test-only-signing-secret";
  const { app } = await import("../app.js");
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  base = `http://127.0.0.1:${server.address().port}`;
});
afterEach(() => mock.restoreAll());
after(async () => {
  server?.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
});

test("login keeps the existing JWT and user response contract", async () => {
  const password = await bcrypt.hash("test-password", 4);
  mock.method(User, "findByEmail", async () => ({ ...user, password }));
  const response = await request("/api/auth/login", {
    method: "POST", body: JSON.stringify({ email: user.email, password: "test-password" }),
  });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.user._id, userId);
  assert.equal(data.user.password, undefined);
  assert.equal(jwt.verify(data.token, process.env.SECRET_KEY).userId, userId);
});

test("current user and profile retain their expected response shapes", async () => {
  mock.method(User, "findById", async () => user);
  for (const path of ["/api/auth/me", "/api/user/profile"]) {
    const response = await request(path, { role: "job Seeker" });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).data._id, userId);
  }
});

test("public job endpoints retain list and nested company data", async () => {
  const job = { _id: jobId, postedBy: { _id: userId, companyName: "Test company" } };
  mock.method(Job, "findPublic", async () => [job]);
  mock.method(Job, "findById", async () => job);
  const list = await request("/api/v1/jobs/get");
  assert.deepEqual(await list.json(), { success: true, count: 1, job: [job] });
  const detail = await request(`/api/v1/jobs/${jobId}`);
  assert.equal((await detail.json()).job.postedBy.companyName, "Test company");
});

test("companies alone can manage jobs and seekers alone can apply", async () => {
  assert.equal((await request("/api/v1/jobs/create", { role: "job Seeker", method: "POST", body: "{}" })).status, 403);
  assert.equal((await request(`/api/v1/jobs/${jobId}/visibility`, { role: "job Seeker", method: "PATCH", body: '{"visibility":false}' })).status, 403);
  assert.equal((await request(`/api/v1/jobs/${jobId}/apply`, { role: "company", method: "POST", body: "{}" })).status, 403);
});

test("application validation reads the route UUID and handles a missing resume", async () => {
  const response = await request(`/api/v1/jobs/${jobId}/apply`, {
    role: "job Seeker", method: "POST", body: JSON.stringify({ letter: "A".repeat(60) }),
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, "Resume file is required");
  assert.equal((await request("/api/v1/jobs/not-a-uuid")).status, 400);
});

test("visibility updates return not found when ownership does not match", async () => {
  const update = mock.method(Job, "updateVisibility", async () => null);
  const response = await request(`/api/v1/jobs/${jobId}/visibility`, {
    role: "company", method: "PATCH", body: '{"visibility":false}',
  });
  assert.equal(response.status, 404);
  assert.deepEqual(update.mock.calls[0].arguments, [jobId, userId, false]);
});
