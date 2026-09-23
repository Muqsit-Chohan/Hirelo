# Supabase database setup

1. Open a new Supabase project and run `schema.sql` in its SQL Editor once.
   This creates `public.users`, `public.jobs`, and `public.applications` in a
   transaction. It does not drop or overwrite existing tables.
2. In `backend/.env`, set `SUPABASE_URL` to the project URL and
   `SUPABASE_SERVICE_ROLE_KEY` to the backend service-role key (a Supabase secret
   API key can also be used). Keep this key on the backend only, never in a
   `VITE_` variable. See `../.env.example` for the other settings.
3. From `backend`, run `npm install`, `npm run db:check`,
   `npm run storage:setup`, then `npm run dev`.
   Startup checks all three tables and stops if configuration/schema is missing.
4. Keep the frontend API URL pointed at Express:
   `VITE_API_URL=http://localhost:5000/api` for local development.

The app uses Supabase Postgres for storage. Existing bcrypt passwords, JWT
authentication and email verification remain in use; these are not Supabase
Auth accounts. Configure email settings to test registration.

## File storage

`npm run storage:setup` creates two buckets using the backend Supabase key:

- `springjob-avatars`: public JPG/PNG profile images.
- `springjob-resumes`: private PDF/DOC/DOCX resumes.

`npm run storage:check` uploads temporary test files, verifies public image and
signed resume downloads, checks that resumes are not publicly accessible, then
removes only those temporary objects.

Uploads are limited to 5 MB and use generated filenames under the user's ID.
The backend uploads files; no browser write policies or additional credentials
are required. Existing buckets with conflicting visibility are rejected.
Database records retain stable object references, and authenticated profile or
application responses generate resume links valid for one hour. Reload the
profile/application list to refresh an expired link. Photos have public URLs.
The existing application `resume.public_id` field stores the Supabase object
path for response/schema compatibility. Failed database saves clean up newly
uploaded files. Older uploads are not automatically transferred or deleted;
their existing URLs remain readable. Re-upload them to move them to Supabase.

See [Supabase Storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals)
and [signed URLs](https://supabase.com/docs/reference/javascript/file-buckets-createsignedurl).

The API retains `_id`, camelCase fields, and nested job/company response shapes.
New IDs are UUIDs. Existing MongoDB records have not been copied or deleted.
If old data is needed, export it first and prepare an import that maps user/job
IDs and application foreign keys to UUIDs, retaining bcrypt hashes and dates.

All tables have RLS enabled and browser roles have no table privileges. Express
uses the server credential and enforces user ownership and roles. Profile
responses exclude password hashes and verification tokens.

References: [Supabase JavaScript](https://supabase.com/docs/reference/javascript/installing),
[Row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
