import { getSupabase, queryData } from "../config/db/db.js";

export const USER_FIELDS = "_id,fullName,email,role,companyName,phoneNumber,location,about,profile,companyProfile,isVerified,createdAt,updatedAt";

// Authentication secrets are only selected for login and verification.
export const User = {
  findByEmail(email) {
    return queryData(getSupabase().from("users").select("*")
      .eq("email", email.trim().toLowerCase()).maybeSingle());
  },
  findById(id) {
    return queryData(getSupabase().from("users").select(USER_FIELDS).eq("_id", id).maybeSingle());
  },
  findByVerificationToken(token) {
    return queryData(getSupabase().from("users").select(USER_FIELDS)
      .eq("verificationToken", token)
      .gt("verificationTokenExpiry", new Date().toISOString()).maybeSingle());
  },
  create(values) {
    return queryData(getSupabase().from("users").insert(values).select(USER_FIELDS).single());
  },
  update(id, values) {
    return queryData(getSupabase().from("users").update(values)
      .eq("_id", id).select(USER_FIELDS).maybeSingle());
  },
  verify(id, token) {
    return queryData(getSupabase().from("users").update({
      isVerified: true, verificationToken: null, verificationTokenExpiry: null,
    }).eq("_id", id).eq("verificationToken", token)
      .gt("verificationTokenExpiry", new Date().toISOString())
      .select(USER_FIELDS).maybeSingle());
  },
};

// Retain JSON fields that a partial profile form did not submit.
export function mergeProfileUpdate(current, updates) {
  const result = {};
  const topFields = new Set(["fullName", "email", "companyName", "phoneNumber", "location", "about"]);
  const nestedFields = new Set([
    "profile.age", "profile.tagline", "profile.title", "profile.skills",
    "profile.education", "profile.experience", "profile.profilePhoto",
    "profile.resume", "profile.resumeOrignalName",
    "companyProfile.companySize", "companyProfile.foundedYear", "companyProfile.industry",
    "companyProfile.mission", "companyProfile.vision", "companyProfile.website",
    "companyProfile.socialLinks.linkedin", "companyProfile.socialLinks.twitter",
    "companyProfile.socialLinks.facebook",
  ]);
  for (const [key, value] of Object.entries(updates)) {
    if (topFields.has(key)) {
      result[key] = key === "email" ? value.trim().toLowerCase() : value;
    } else if (nestedFields.has(key)) {
      const [column, field, child] = key.split(".");
      result[column] ??= structuredClone(current[column] || {});
      if (child) {
        result[column][field] ??= {};
        result[column][field][child] = value;
      } else {
        result[column][field] = value;
      }
    }
  }
  return result;
}

