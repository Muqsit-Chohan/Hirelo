import { getSupabase, queryData } from "../config/db/db.js";

export const Application = {
  findExisting(job, applicant) {
    return queryData(getSupabase().from("applications").select("_id")
      .eq("job", job).eq("applicant", applicant).maybeSingle());
  },
  create(values) {
    return queryData(getSupabase().from("applications").insert(values).select().single());
  },
  findByApplicant(applicant) {
    return queryData(getSupabase().from("applications")
      .select("*,job:jobs!applications_job_fkey(*,postedBy:users!jobs_postedBy_fkey(_id,companyName))")
      .eq("applicant", applicant).order("createdAt", { ascending: false }));
  },
  findByCompany(companyId) {
    return queryData(getSupabase().from("applications")
      .select("*,job:jobs!applications_job_fkey!inner(_id,jobTitle,location,postedBy:users!jobs_postedBy_fkey(_id,fullName,companyName)),applicant:users!applications_applicant_fkey(_id,fullName,email,phoneNumber,profile)")
      .eq("job.postedBy", companyId).order("createdAt", { ascending: false }));
  },
  async countForJob(job) {
    const { count, error } = await getSupabase().from("applications")
      .select("_id", { count: "exact", head: true }).eq("job", job);
    if (error) throw new Error(error.message);
    return count;
  },
  async updateStatus(id, companyId, status) {
    const owned = await queryData(getSupabase().from("applications")
      .select("_id,job:jobs!applications_job_fkey!inner(_id,postedBy)")
      .eq("_id", id).eq("job.postedBy", companyId).maybeSingle());
    if (!owned) return null;
    return queryData(getSupabase().from("applications").update({ status })
      .eq("_id", id).eq("job", owned.job._id)
      .select("*,job:jobs!applications_job_fkey(jobTitle,postedBy:users!jobs_postedBy_fkey(companyName,fullName)),applicant:users!applications_applicant_fkey(fullName,email,phoneNumber)")
      .maybeSingle());
  },
};

