import { getSupabase, queryData } from "../config/db/db.js";

const COMPANY_JOIN = "*,postedBy:users!jobs_postedBy_fkey(_id,fullName,email,companyName,profile)";

export const Job = {
  create(values) {
    return queryData(getSupabase().from("jobs").insert(values).select().single());
  },
  findPublic(keyword = "") {
    let query = getSupabase().from("jobs").select(COMPANY_JOIN).eq("visibility", true);
    if (keyword.trim()) {
      // Quote PostgREST values and escape LIKE wildcards for literal search.
      const pattern = `%${keyword.trim().replace(/[\\%_]/g, "\\$&")}%`;
      const value = JSON.stringify(pattern);
      query = query.or(`jobTitle.ilike.${value},location.ilike.${value}`);
    }
    return queryData(query.order("createdAt", { ascending: false }));
  },
  findById(id, { publicOnly = false } = {}) {
    let query = getSupabase().from("jobs").select(publicOnly ? COMPANY_JOIN : "*").eq("_id", id);
    if (publicOnly) query = query.eq("visibility", true);
    return queryData(query.maybeSingle());
  },
  findByCompany(companyId) {
    return queryData(getSupabase().from("jobs").select("*")
      .eq("postedBy", companyId).order("createdAt", { ascending: false }));
  },
  updateVisibility(id, companyId, visibility) {
    return queryData(getSupabase().from("jobs").update({ visibility })
      .eq("_id", id).eq("postedBy", companyId).select().maybeSingle());
  },
};

