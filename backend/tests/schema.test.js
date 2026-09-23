import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

let db;
let company;
let seeker;
let job;
before(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  await db.exec(await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"));
  const users = await db.query(`insert into users
    ("fullName", email, password, role, "phoneNumber", location, about)
    values ('Company', 'company@example.com', 'hashed', 'company', '123', 'Lahore', 'About company'),
           ('Seeker', 'seeker@example.com', 'hashed', 'job Seeker', '456', 'Karachi', 'About seeker')
    returning *`);
  [company, seeker] = users.rows;
  const jobs = await db.query(`insert into jobs
    ("jobTitle", "jobCategory", "jobType", location, "numberOpening", description,
     responsibilities, requirements, "ExperienceLevel", "EducationRequirement", skills,
     "MinimumSalary", "MaximumSalary", currency, "workSchedule", "applyMethod", deadline, "postedBy")
    values ('Developer', 'Web Development', 'Full-Time', 'Lahore', 1, 'Build web applications',
      array['Build'], array['Code'], 'Intern', 'Any', array['JS'], 1000, 2000, 'PKR',
      'Day shift', 'platform', now() + interval '30 days', $1) returning *`, [company._id]);
  job = jobs.rows[0];
});
after(async () => { await db?.close(); });

test("schema creates UUIDs and compatible profile/job defaults", () => {
  assert.match(company._id, /^[0-9a-f-]{36}$/);
  assert.deepEqual(seeker.profile.skills, []);
  assert.equal(seeker.profile.resume, "");
  assert.equal(company.companyProfile.socialLinks.linkedin, "");
  assert.equal(job.visibility, true);
  assert.equal(job.postedBy, company._id);
});

test("applications preserve relationships and reject duplicates and invalid data", async () => {
  const insert = `insert into applications (job, applicant, letter, resume)
    values ($1, $2, $3, $4) returning *`;
  const values = [job._id, seeker._id, "A".repeat(60), { url: "https://example.com/cv.pdf", public_id: "cv" }];
  const result = await db.query(insert, values);
  assert.equal(result.rows[0].status, "pending");
  await assert.rejects(db.query(insert, values), { code: "23505" });
  await assert.rejects(db.query(insert, [job._id, company._id, "short", values[3]]), { code: "23514" });
  await assert.rejects(db.query(insert, [job._id, company._id, values[2], {}]), { code: "23514" });
  await assert.rejects(db.query(insert, ["00000000-0000-4000-8000-000000000000", company._id, values[2], values[3]]), { code: "23503" });
  await assert.rejects(db.query("update applications set status = 'invalid'"), { code: "23514" });
});

test("user email is unique and verification fields can be cleared", async () => {
  await assert.rejects(db.query("update users set email = $1 where _id = $2", [company.email, seeker._id]), { code: "23505" });
  await db.query(`update users set "verificationToken" = 'one-time',
    "verificationTokenExpiry" = now() + interval '1 day' where _id = $1`, [seeker._id]);
  const verified = await db.query(`update users set "isVerified" = true,
    "verificationToken" = null, "verificationTokenExpiry" = null where _id = $1 returning *`, [seeker._id]);
  assert.equal(verified.rows[0].isVerified, true);
  assert.equal(verified.rows[0].verificationToken, null);
  assert.ok(verified.rows[0].updatedAt >= seeker.updatedAt);
});

test("RLS is enabled and browser roles cannot read application tables", async () => {
  const tables = await db.query(`select relname, relrowsecurity from pg_class
    where relname in ('users', 'jobs', 'applications') and relnamespace = 'public'::regnamespace`);
  assert.equal(tables.rows.length, 3);
  assert.ok(tables.rows.every(row => row.relrowsecurity));
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    try {
      for (const table of ["users", "jobs", "applications"]) {
        await assert.rejects(db.query(`select * from ${table}`), { code: "42501" });
      }
    } finally {
      await db.exec("reset role");
    }
  }
  await db.exec("set role service_role");
  try {
    assert.equal((await db.query("select _id from users")).rows.length, 2);
  } finally {
    await db.exec("reset role");
  }
});
