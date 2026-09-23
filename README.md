# Hirelo

A full-stack job board that connects job seekers with companies — browse and apply for jobs, manage listings, review applicants, and get notified the moment an application is accepted.

## Features

**For job seekers**
- Browse, search and filter job listings by keyword, location and category
- Apply to jobs with a resume upload and cover letter
- Track submitted applications and their status
- Editable profile with photo, resume, skills, experience and education
- View a company's public profile before applying

**For companies**
- Multi-step job posting wizard (basic info, details, salary & benefits, application settings, preview)
- Manage listings, toggle visibility, and see applicant counts (My Jobs)
- Review all applications in one place and accept/reject candidates
- View a candidate's full profile, contact info and resume
- Accepting an application notifies the candidate by **email** (and **WhatsApp**, once configured)
- Editable company profile with logo, mission/vision, socials and company details

**Platform**
- Email/password auth with email verification, JWT sessions, and role-based access (job seeker vs. company)
- Rate limiting on auth, profile updates and email resends
- File storage via Supabase (public avatar images, private signed resume links)
- Terms of Service and Privacy Policy pages

## Tech stack

**Frontend** — React 19, Vite, React Router, Tailwind CSS v4, React Hook Form + Yup, Axios, Framer Motion (`motion`), React Hot Toast

**Backend** — Node.js, Express 5, Supabase (Postgres + Storage), JWT, bcryptjs, Multer, Nodemailer (Gmail), Twilio (WhatsApp), express-validator, express-rate-limit

## Project structure


## Getting started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is enough)
- A Gmail account with an [app password](https://myaccount.google.com/apppasswords) for sending verification/notification emails

### 1. Database & storage (Supabase)

1. Create a Supabase project and run `backend/supabase/schema.sql` once in its SQL Editor. This creates the `users`, `jobs` and `applications` tables (see `backend/supabase/README.md` for details).
2. Note your project's URL and **service role key** (Settings → API) — you'll need these in the backend `.env`.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values below
npm run db:check        # verifies the schema was applied correctly
npm run storage:setup   # creates the avatar/resume storage buckets
npm run dev              # starts the API on http://localhost:5000
```

Required environment variables (see `backend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Database and file storage |
| `SECRET_KEY` | JWT signing secret — use a long random string |
| `FRONTEND_URL`, `BACKEND_URL` | Used in email verification links and CORS |
| `EMAIL_USER`, `EMAIL_PASS` | Gmail address + app password for account/notification emails |
| `DATABASE_URL` | Only needed for `npm run db:setup` (direct Postgres connection) |


### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults work for local development
npm run dev              # starts the app on http://localhost:5173
```

With both servers running, open `http://localhost:5173`.

## Available scripts

**Backend** (`backend/package.json`)
| Script | Description |
| --- | --- |
| `npm run dev` | Start the API with auto-reload (nodemon) |
| `npm start` | Start the API |
| `npm run db:check` / `npm run db:setup` | Verify / apply the Supabase schema |
| `npm run storage:check` / `npm run storage:setup` | Verify / create storage buckets |
| `npm test` | Run backend tests |

**Frontend** (`frontend/package.json`)
| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## License

No license file is included yet — add one (e.g. MIT) before publishing this repository if you intend for others to reuse the code.
# Hirelo
