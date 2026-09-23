import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import { registerUser, resendVerification } from "../controllers/auth.controller.js";
import { User } from "../models/user.model.js";
import { verificationMailer } from "../utils/sendEmail.js";

afterEach(() => mock.restoreAll());
const body = { fullName: "Test User", email: "test@example.com", password: "test-password", role: "job Seeker", phoneNumber: "123", location: "Lahore", about: "Test profile" };
function response() {
  return { status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
}
test("email failure reports the saved account and allows verification recovery", async () => {
  mock.method(User, "findByEmail", async () => null);
  const create = mock.method(User, "create", async () => ({}));
  mock.method(verificationMailer, "send", async () => { throw Object.assign(new Error("SMTP failed"), { code: "EAUTH" }); });
  mock.method(console, "error", () => {});
  const res = response();
  await registerUser({ body }, res);
  assert.equal(res.code, 503);
  assert.equal(res.data.accountCreated, true);
  assert.equal(res.data.verificationRequired, true);
  assert.equal(create.mock.calls.length, 1);
  assert.equal(create.mock.calls[0].arguments[0].isVerified, false);
});
test("retrying signup for an unverified account redirects to verification without another insert", async () => {
  mock.method(User, "findByEmail", async () => ({ isVerified: false }));
  const create = mock.method(User, "create", async () => ({}));
  const res = response();
  await registerUser({ body }, res);
  assert.equal(res.code, 409);
  assert.equal(res.data.verificationRequired, true);
  assert.equal(create.mock.calls.length, 0);
});
test("resend failure has a clear service error and does not verify the account", async () => {
  mock.method(User, "findByEmail", async () => ({ _id: "test", isVerified: false }));
  const update = mock.method(User, "update", async () => ({}));
  mock.method(verificationMailer, "send", async () => { throw new Error("SMTP failed"); });
  mock.method(console, "error", () => {});
  const res = response();
  await resendVerification({ body }, res);
  assert.equal(res.code, 503);
  assert.equal(update.mock.calls[0].arguments[1].isVerified, undefined);
});
