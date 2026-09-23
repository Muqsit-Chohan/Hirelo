-- Run once in a new Supabase project's SQL Editor. Existing tables are never dropped.
begin;

create table public.users (
  _id uuid primary key default gen_random_uuid(),
  "fullName" text not null check (length(trim("fullName")) > 0),
  email text not null unique check (email = lower(trim(email))),
  password text not null,
  role text not null default 'job Seeker' check (role in ('job Seeker', 'company')),
  "companyName" text not null default '',
  "phoneNumber" text not null,
  location text not null,
  about text not null check (length(about) <= 500),
  profile jsonb not null default '{"age":null,"title":"","tagline":"","resume":"","profilePhoto":"","resumeOrignalName":"","skills":[],"experience":[],"education":[]}'::jsonb
    check (jsonb_typeof(profile) = 'object'),
  "companyProfile" jsonb not null default '{"website":"","industry":"","companySize":"","mission":"","vision":"","foundedYear":"","socialLinks":{"linkedin":"","twitter":"","facebook":""}}'::jsonb
    check (jsonb_typeof("companyProfile") = 'object'),
  "isVerified" boolean not null default false,
  "verificationToken" text unique,
  "verificationTokenExpiry" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table public.jobs (
  _id uuid primary key default gen_random_uuid(),
  "jobTitle" text not null check (length(trim("jobTitle")) > 0),
  "jobCategory" text not null,
  "jobType" text not null check ("jobType" in ('Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Internship', 'Remote')),
  location text not null,
  "numberOpening" integer not null check ("numberOpening" > 0),
  description text not null,
  responsibilities text[] not null,
  requirements text[] not null,
  "ExperienceLevel" text not null check ("ExperienceLevel" in (
    'Intern', 'Entry-Level (0-1 years)', 'Junior (1-3 years)',
    'Mid-Level (3-5 years)', 'Senior (5-10 years)', 'Lead / Manager (10+ years)'
  )),
  "EducationRequirement" text not null check ("EducationRequirement" in (
    'High School / Secondary', 'Diploma / Associate Degree', 'Bachelor’s Degree',
    'Master’s Degree', 'PhD / Doctorate', 'Certification / Professional Training', 'Any'
  )),
  skills text[] not null,
  "MinimumSalary" numeric not null check ("MinimumSalary" >= 0),
  "MaximumSalary" numeric not null check ("MaximumSalary" > "MinimumSalary"),
  currency text check (currency in ('PKR', 'USD', 'EUR', 'GBP', 'AED', 'INR')),
  perks text[] not null default '{}',
  "workSchedule" text not null check ("workSchedule" in ('Day shift', 'Night shift', 'Flexible', 'Shift work', 'Remote', 'Hybrid')),
  "applyMethod" text not null check ("applyMethod" in ('platform', 'external')),
  "applicationUrl" text,
  "contactEmail" text,
  deadline timestamptz not null,
  "isFeatured" boolean not null default false,
  "postedBy" uuid not null constraint "jobs_postedBy_fkey" references public.users(_id),
  visibility boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table public.applications (
  _id uuid primary key default gen_random_uuid(),
  job uuid not null constraint applications_job_fkey references public.jobs(_id),
  applicant uuid not null constraint applications_applicant_fkey references public.users(_id),
  letter text not null check (length(letter) >= 50),
  resume jsonb not null check (
    jsonb_typeof(resume) = 'object' and
    coalesce(length(resume->>'url'), 0) > 0 and
    coalesce(length(resume->>'public_id'), 0) > 0
  ),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique(job, applicant)
);

create index jobs_company_created_idx on public.jobs ("postedBy", "createdAt" desc);
create index jobs_public_created_idx on public.jobs ("createdAt" desc) where visibility = true;
create index applications_applicant_idx on public.applications (applicant);
-- The unique(job, applicant) constraint also indexes job application counts.

create function public.springjob_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

create trigger users_updated_at before update on public.users
  for each row execute function public.springjob_updated_at();
create trigger jobs_updated_at before update on public.jobs
  for each row execute function public.springjob_updated_at();
create trigger applications_updated_at before update on public.applications
  for each row execute function public.springjob_updated_at();

-- Access goes through the Express API, which verifies the app's JWT and roles.
-- Never expose password hashes or verification tokens through browser clients.
alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
revoke all on public.users, public.jobs, public.applications from anon, authenticated;
grant select, insert, update, delete on public.users, public.jobs, public.applications to service_role;
revoke all on function public.springjob_updated_at() from public, anon, authenticated;

commit;
