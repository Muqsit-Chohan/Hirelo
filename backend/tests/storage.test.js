import { test, afterEach, mock } from "node:test";
import assert from "node:assert/strict";

process.env.SUPABASE_URL = "https://storage-test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
const { getSupabase } = await import("../config/db/db.js");
const { Storage, BUCKETS, MAX_FILE_SIZE, setupStorage } = await import("../utils/supabaseStorage.js");
const { User } = await import("../models/user.model.js");
const { Application } = await import("../models/application.model.js");
const { Job } = await import("../models/job.model.js");
const { applyJob } = await import("../controllers/application.controller.js");
const { updateProfile } = await import("../controllers/user.controller.js");

const userId = "11111111-1111-4111-8111-111111111111";
const pdf = { buffer: Buffer.from("%PDF-1.4 test"), mimetype: "application/pdf", originalname: "../resume.pdf" };
const stored = { bucket: BUCKETS.resumes.name, path: `${userId}/cv.pdf`, url: `storage://${BUCKETS.resumes.name}/${userId}/cv.pdf` };
afterEach(() => mock.restoreAll());

function response() {
  return { status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
}

test("private uploads use generated paths, declared MIME and no overwrite", async () => {
  const upload = mock.fn(async () => ({ error: null }));
  const from = mock.method(getSupabase().storage, "from", () => ({ upload }));
  const result = await Storage.upload(pdf, "resumes", userId);
  assert.equal(from.mock.calls[0].arguments[0], BUCKETS.resumes.name);
  assert.match(result.path, new RegExp(`^${userId}/[a-f0-9-]+\\.pdf$`));
  assert.equal(result.url, `storage://${BUCKETS.resumes.name}/${result.path}`);
  assert.deepEqual(upload.mock.calls[0].arguments[2], { contentType: "application/pdf", cacheControl: "3600", upsert: false });
});

test("photos use the public bucket and stable URLs", async () => {
  mock.method(getSupabase().storage, "from", bucket => {
    assert.equal(bucket, BUCKETS.photos.name);
    return { upload: async () => ({ error: null }), getPublicUrl: path => ({ data: { publicUrl: `https://example.com/${path}` } }) };
  });
  const result = await Storage.upload({ buffer: Buffer.from("image"), mimetype: "image/png" }, "photos", userId);
  assert.match(result.url, /^https:\/\//);
  assert.match(result.path, /\.png$/);
});

test("wrong types, empty files, oversized files and unsafe owner IDs are rejected before upload", async () => {
  const from = mock.method(getSupabase().storage, "from");
  await assert.rejects(Storage.upload(pdf, "photos", userId), { status: 400 });
  await assert.rejects(Storage.upload({ ...pdf, buffer: Buffer.alloc(0) }, "resumes", userId), { status: 400 });
  await assert.rejects(Storage.upload({ ...pdf, buffer: Buffer.alloc(MAX_FILE_SIZE + 1) }, "resumes", userId), { status: 400 });
  await assert.rejects(Storage.upload(pdf, "resumes", "../other"), /Invalid upload owner/);
  assert.equal(from.mock.calls.length, 0);
});

test("resume responses sign private references without modifying stored data", async () => {
  const sign = mock.fn(async () => ({ data: { signedUrl: "https://example.com/signed" }, error: null }));
  mock.method(getSupabase().storage, "from", () => ({ createSignedUrl: sign }));
  const user = { profile: { resume: stored.url } };
  const result = await Storage.userResponse(user);
  assert.equal(result.profile.resume, "https://example.com/signed");
  assert.equal(user.profile.resume, stored.url);
  assert.deepEqual(sign.mock.calls[0].arguments, [stored.path, 3600]);
  const application = await Storage.applicationResponse({ resume: { url: stored.url, public_id: stored.path } });
  assert.equal(application.resume.public_id, stored.path);
  assert.equal(application.resume.url, "https://example.com/signed");
  assert.equal(await Storage.resumeUrl("https://existing.example/cv.pdf"), "https://existing.example/cv.pdf");
});

test("storage errors do not return fake upload or signed URLs", async () => {
  mock.method(getSupabase().storage, "from", () => ({
    upload: async () => ({ error: { message: "unavailable" } }),
    createSignedUrl: async () => ({ error: { message: "not found" } }),
  }));
  await assert.rejects(Storage.upload(pdf, "resumes", userId), /upload failed/);
  await assert.rejects(Storage.resumeUrl(stored.url), /Resume link failed/);
});

test("setup creates buckets with correct visibility, size and file restrictions", async () => {
  mock.method(getSupabase().storage, "getBucket", async () => ({ error: { statusCode: "404" } }));
  const create = mock.method(getSupabase().storage, "createBucket", async () => ({ error: null }));
  await setupStorage();
  assert.equal(create.mock.calls.length, 2);
  const [, options] = create.mock.calls[1].arguments;
  assert.equal(options.public, false);
  assert.equal(options.fileSizeLimit, MAX_FILE_SIZE);
  assert.ok(options.allowedMimeTypes.includes("application/pdf"));
});

test("setup does not modify an existing bucket with unsafe visibility", async () => {
  mock.method(getSupabase().storage, "getBucket", async () => ({ data: { public: true } }));
  const create = mock.method(getSupabase().storage, "createBucket");
  await assert.rejects(setupStorage(), /incorrect public\/private/);
  assert.equal(create.mock.calls.length, 0);
});

test("application database failure cleans up only the newly uploaded object", async () => {
  mock.method(Job, "findById", async () => ({ visibility: true }));
  mock.method(Application, "findExisting", async () => null);
  mock.method(Storage, "upload", async () => stored);
  mock.method(Application, "create", async () => { throw Object.assign(new Error("duplicate"), { code: "23505" }); });
  const cleanup = mock.method(Storage, "cleanup", async () => {});
  mock.method(console, "log", () => {});
  const res = response();
  await applyJob({ user: { userId }, params: { jobId: userId }, body: { letter: "A".repeat(60) }, file: pdf }, res);
  assert.equal(res.code, 409);
  assert.deepEqual(cleanup.mock.calls[0].arguments, [[stored]]);
});

test("profile saves stable references and returns usable signed resume links", async () => {
  const current = { _id: userId, profile: { title: "Engineer" } };
  mock.method(User, "findById", async () => current);
  mock.method(Storage, "upload", async () => stored);
  const update = mock.method(User, "update", async (id, values) => ({ _id: id, ...values }));
  mock.method(Storage, "resumeUrl", async () => "https://example.com/signed");
  mock.method(console, "log", () => {});
  const res = response();
  await updateProfile({ user: { userId }, body: {}, files: { resume: [pdf] } }, res);
  assert.equal(res.code, 200);
  assert.equal(update.mock.calls[0].arguments[1].profile.resume, stored.url);
  assert.equal(update.mock.calls[0].arguments[1].profile.title, "Engineer");
  assert.equal(res.data.user.profile.resume, "https://example.com/signed");
});
