import { randomUUID } from "node:crypto";
import { getSupabase } from "../config/db/db.js";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png"];
export const RESUME_TYPES = [
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const BUCKETS = {
  photos: { name: "springjob-avatars", public: true, allowedMimeTypes: PHOTO_TYPES },
  resumes: { name: "springjob-resumes", public: false, allowedMimeTypes: RESUME_TYPES },
};
const extensions = {
  "image/jpeg": "jpg", "image/png": "png", "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
const RESUME_PREFIX = `storage://${BUCKETS.resumes.name}/`;

export const Storage = {
  async upload(file, kind, userId) {
    const bucket = BUCKETS[kind];
    if (!bucket || !bucket.allowedMimeTypes.includes(file?.mimetype)) {
      throw Object.assign(new Error("Unsupported file type"), { status: 400 });
    }
    if (!Buffer.isBuffer(file.buffer) || !file.buffer.length || file.buffer.length > MAX_FILE_SIZE) {
      throw Object.assign(new Error("File must be between 1 byte and 5 MB"), { status: 400 });
    }
    if (!/^[a-zA-Z0-9-]+$/.test(userId)) throw new Error("Invalid upload owner");
    const path = `${userId}/${randomUUID()}.${extensions[file.mimetype]}`;
    const files = getSupabase().storage.from(bucket.name);
    const { error } = await files.upload(path, file.buffer, {
      contentType: file.mimetype, cacheControl: "3600", upsert: false,
    });
    if (error) throw new Error(`File upload failed: ${error.message}`);
    // Persist paths, never expiring signed links. Public photos have stable URLs.
    const url = bucket.public
      ? files.getPublicUrl(path).data.publicUrl
      : `${RESUME_PREFIX}${path}`;
    return { bucket: bucket.name, path, url };
  },
  async remove(upload) {
    const { error } = await getSupabase().storage.from(upload.bucket).remove([upload.path]);
    if (error) throw new Error(`File cleanup failed: ${error.message}`);
  },
  async cleanup(uploads) {
    const results = await Promise.allSettled(uploads.map(upload => Storage.remove(upload)));
    for (const result of results) {
      if (result.status === "rejected") console.error(result.reason.message);
    }
  },
  async resumeUrl(value) {
    // Existing external links remain readable; all new resumes are private.
    if (!value?.startsWith(RESUME_PREFIX)) return value;
    const path = value.slice(RESUME_PREFIX.length);
    const { data, error } = await getSupabase().storage.from(BUCKETS.resumes.name)
      .createSignedUrl(path, 3600);
    if (error) throw new Error(`Resume link failed: ${error.message}`);
    return data.signedUrl;
  },
  async userResponse(user) {
    if (!user?.profile?.resume) return user;
    return { ...user, profile: { ...user.profile, resume: await Storage.resumeUrl(user.profile.resume) } };
  },
  async applicationResponse(application) {
    if (!application?.resume?.url) return application;
    return { ...application, resume: { ...application.resume, url: await Storage.resumeUrl(application.resume.url) } };
  },
};

export async function setupStorage() {
  const storage = getSupabase().storage;
  for (const bucket of Object.values(BUCKETS)) {
    const { data, error } = await storage.getBucket(bucket.name);
    if (data) {
      if (data.public !== bucket.public) throw new Error(`Bucket ${bucket.name} has incorrect public/private visibility`);
      console.log(`Storage bucket ready: ${bucket.name}`);
      continue;
    }
    if (error && !["400", "404"].includes(String(error.statusCode))) {
      throw new Error(`Bucket check failed: ${error.message}`);
    }
    const created = await storage.createBucket(bucket.name, {
      public: bucket.public, fileSizeLimit: MAX_FILE_SIZE, allowedMimeTypes: bucket.allowedMimeTypes,
    });
    if (created.error) throw new Error(`Bucket creation failed: ${created.error.message}`);
    console.log(`Storage bucket created: ${bucket.name}`);
  }
}
