import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Storage } from "../utils/supabaseStorage.js";
import { getSupabase } from "../config/db/db.js";

const uploads = [];
try {
  const owner = randomUUID();
  const image = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jv1kAAAAASUVORK5CYII=", "base64");
  const photo = await Storage.upload({ buffer: image, mimetype: "image/png" }, "photos", owner);
  uploads.push(photo);
  const publicResponse = await fetch(photo.url);
  assert.equal(publicResponse.status, 200, "Public photo download failed");
  assert.deepEqual(Buffer.from(await publicResponse.arrayBuffer()), image);

  const document = Buffer.from("%PDF-1.4\n% SpringJob temporary storage check\n%%EOF\n");
  const resume = await Storage.upload({ buffer: document, mimetype: "application/pdf" }, "resumes", owner);
  uploads.push(resume);
  const url = await Storage.resumeUrl(resume.url);
  const privateResponse = await fetch(url);
  assert.equal(privateResponse.status, 200, "Signed resume download failed");
  assert.deepEqual(Buffer.from(await privateResponse.arrayBuffer()), document);

  const publicResumeUrl = getSupabase().storage.from(resume.bucket).getPublicUrl(resume.path).data.publicUrl;
  const denied = await fetch(publicResumeUrl);
  await denied.arrayBuffer();
  assert.ok([400, 401, 403, 404].includes(denied.status), "Resume was accessible without a signed URL");
  console.log("Storage verified: public photos, signed resume downloads, and private resume access restrictions.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  for (const upload of uploads) {
    try {
      await Storage.remove(upload);
    } catch (error) {
      console.error(`Temporary file cleanup failed (${upload.bucket}/${upload.path}): ${error.message}`);
      process.exitCode = 1;
    }
  }
  if (!process.exitCode) console.log("Temporary check files removed.");
}
