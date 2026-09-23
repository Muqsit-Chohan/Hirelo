import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";

let server;
let User, Job, Application, mergeProfileUpdate;
let nextResponse = [];
let nextStatus = 200;
const requests = [];
const companyId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const userId = "33333333-3333-4333-8333-333333333333";

before(async () => {
  server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    requests.push({ url: new URL(req.url, "http://localhost"), method: req.method, body: body ? JSON.parse(body) : null });
    res.writeHead(nextStatus, { "Content-Type": "application/json", "Content-Range": "0-2/3" });
    res.end(JSON.stringify(nextResponse));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  process.env.SUPABASE_URL = `http://127.0.0.1:${server.address().port}`;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-server-key";
  ({ User, mergeProfileUpdate } = await import("../models/user.model.js"));
  ({ Job } = await import("../models/job.model.js"));
  ({ Application } = await import("../models/application.model.js"));
});
after(async () => {
  server?.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
});

test("login normalizes email and profile responses do not select secrets", async () => {
  nextResponse = [{ _id: userId }];
  await User.findByEmail(" TEST@EXAMPLE.COM ");
  assert.equal(requests.at(-1).url.searchParams.get("email"), "eq.test@example.com");
  await User.findById(userId);
  const selection = requests.at(-1).url.searchParams.get("select");
  assert.ok(selection.includes("profile"));
  assert.ok(!selection.includes("password"));
  assert.ok(!selection.includes("verificationToken"));
});

test("partial profile updates preserve uploads and reject unapproved nested fields", () => {
  const current = { profile: { resume: "cv.pdf", skills: ["JS"] }, companyProfile: { socialLinks: { twitter: "old" } } };
  const updated = mergeProfileUpdate(current, {
    "profile.title": "Engineer", "companyProfile.socialLinks.linkedin": "new",
    "companyProfile.socialLinks.__proto__": { polluted: true }, role: "company",
    email: " NEW@EXAMPLE.COM ",
  });
  assert.equal(updated.profile.resume, "cv.pdf");
  assert.deepEqual(updated.profile.skills, ["JS"]);
  assert.equal(updated.companyProfile.socialLinks.twitter, "old");
  assert.equal(updated.companyProfile.socialLinks.linkedin, "new");
  assert.equal(updated.email, "new@example.com");
  assert.equal(updated.role, undefined);
  assert.equal({}.polluted, undefined);
  assert.equal(current.profile.title, undefined);
});

test("verification uses ISO dates, token expiry, and explicit null clearing", async () => {
  nextResponse = [];
  await User.findByVerificationToken("token");
  assert.match(requests.at(-1).url.searchParams.get("verificationTokenExpiry"), /^gt\.\d{4}-/);
  nextResponse = { _id: userId, isVerified: true };
  await User.verify(userId, "token");
  const request = requests.at(-1);
  assert.equal(request.url.searchParams.get("verificationToken"), "eq.token");
  assert.deepEqual(request.body, { isVerified: true, verificationToken: null, verificationTokenExpiry: null });
});

test("public jobs filter visibility and safely quote search punctuation", async () => {
  nextResponse = [];
  await Job.findPublic('remote,100% "job"');
  const params = requests.at(-1).url.searchParams;
  assert.equal(params.get("visibility"), "eq.true");
  assert.equal(params.get("order"), "createdAt.desc");
  assert.match(params.get("or"), /jobTitle\.ilike\."/);
  assert.ok(params.get("or").includes('100\\\\%'));
  await Job.findById(jobId, { publicOnly: true });
  assert.equal(requests.at(-1).url.searchParams.get("visibility"), "eq.true");
});

test("visibility changes are constrained to the owning company", async () => {
  nextResponse = { _id: jobId, visibility: false };
  await Job.updateVisibility(jobId, companyId, false);
  const request = requests.at(-1);
  assert.equal(request.method, "PATCH");
  assert.equal(request.url.searchParams.get("postedBy"), `eq.${companyId}`);
  assert.deepEqual(request.body, { visibility: false });
});

test("application lists preserve nested job/company joins and applicant filtering", async () => {
  nextResponse = [];
  await Application.findByApplicant(userId);
  assert.equal(requests.at(-1).url.searchParams.get("applicant"), `eq.${userId}`);
  assert.match(requests.at(-1).url.searchParams.get("select"), /job:jobs.*postedBy:users/);
  await Application.findByCompany(companyId);
  assert.equal(requests.at(-1).url.searchParams.get("job.postedBy"), `eq.${companyId}`);
  assert.match(requests.at(-1).url.searchParams.get("select"), /!inner/);
  assert.equal(await Application.countForJob(jobId), 3);
});

test("application status rejects another company's application without writing", async () => {
  nextResponse = [];
  const beforeCount = requests.length;
  assert.equal(await Application.updateStatus(userId, companyId, "accepted"), null);
  assert.equal(requests.length, beforeCount + 1);
  assert.equal(requests.at(-1).method, "GET");
  assert.equal(requests.at(-1).url.searchParams.get("job.postedBy"), `eq.${companyId}`);
});

test("Supabase errors retain constraint codes for duplicate handling", async () => {
  nextStatus = 409;
  nextResponse = { code: "23505", message: "duplicate application" };
  try {
    await assert.rejects(Application.create({ job: jobId, applicant: userId }), { code: "23505" });
  } finally {
    nextStatus = 200;
  }
});
