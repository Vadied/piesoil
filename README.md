# App

A Next.js 14 application serving both the public-facing website and the authenticated backoffice. PostgreSQL (Cloud SQL) is the persistent store accessed via Prisma ORM; NextAuth.js handles authentication with credentials and Google OAuth; GA4 with Consent Mode v2 loads client-side only after explicit user consent.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| Auth | NextAuth.js v4 (Credentials + Google OAuth) |
| Database | PostgreSQL 15 (Cloud SQL), Prisma ORM |
| File Storage | Google Cloud Storage |
| Analytics | GA4 with Consent Mode v2 |
| Runtime | Node 20, Cloud Run (GCP) |

## Project Structure

```
src/
  app/
    (public)/          Public site routes — layout has header + footer
      page.tsx         Home page (/)
    backoffice/        Authenticated backoffice (/backoffice/*)
      dashboard/       Dashboard (/backoffice/dashboard)
    api/
      auth/[...nextauth]/  NextAuth.js handler
      health/          Liveness probe for Cloud Run (/api/health)
    layout.tsx         Root HTML shell (lang, fonts, global CSS)
    globals.css        Tailwind directives
  components/
    ui/                Shared UI primitives
    public/            Public-site-specific components
    backoffice/        Backoffice-specific components
  lib/
    auth.ts            NextAuth options (shared between route handler and server code)
    db.ts              Prisma client singleton
    storage.ts         Google Cloud Storage helpers
  types/
    index.ts           Application-level TypeScript types
    next-auth.d.ts     NextAuth session type augmentation
prisma/
  schema.prisma        Prisma schema (PostgreSQL)
```

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15 running locally (or Docker)
- A Google OAuth app (optional for credential-only auth)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the example env file and fill in values
cp .env.example .env.local

# 3. Generate the Prisma client
npm run db:generate

# 4. Apply migrations (once the schema has models)
npm run db:migrate:dev

# 5. Start the development server
npm run dev
```

The app is available at `http://localhost:3000`.

## Environment Variables

All secrets and external endpoints are read from environment variables. Copy `.env.example` to `.env.local` for local development. In production, all variables are stored in **Secret Manager** and injected as Cloud Run environment variables.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | JWT/session signing secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Canonical URL of the deployment |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GCS_BUCKET_NAME` | GCS bucket for uploaded cover images |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 Measurement ID (format: `G-XXXXXXXXXX`) |
| `NODE_ENV` | `development` locally, `production` on Cloud Run |

See `.env.example` for full descriptions and example values.

## GCP Deployment

### Architecture

```
Cloud Build
  └─ docker build  →  Artifact Registry
  └─ exec-wrapper (Cloud SQL Auth Proxy)
       └─ prisma migrate deploy  (runs against Cloud SQL)
  └─ gcloud run deploy  →  Cloud Run
       ├─ Next.js container (Node 20 slim, standalone output)
       └─ Cloud SQL Auth Proxy sidecar
```

### One-time Setup

1. **Enable APIs**: Cloud Run, Cloud SQL, Cloud Build, Artifact Registry, Secret Manager.
2. **Create Cloud SQL instance** (PostgreSQL 15) and a database + user.
3. **Create Artifact Registry repository** (Docker format).
4. **Store secrets** in Secret Manager:
   - `DATABASE_URL` — PostgreSQL connection string using the Unix socket path for Cloud Run:
     `postgresql://USER:PASS@localhost/DB?host=/cloudsql/PROJECT:REGION:INSTANCE`
   - `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GCS_BUCKET_NAME` (and any others)
5. **IAM**: Grant the Cloud Build service account `Cloud SQL Client`, `Artifact Registry Writer`, `Cloud Run Admin`, and `Secret Manager Secret Accessor`.
6. **Cloud Run service**: add the Cloud SQL Auth Proxy sidecar container and mount secrets as env vars.

### Deploying

Push to the trigger branch (or run manually):

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions \
    _REGION=europe-west1,\
    _SERVICE_NAME=app,\
    _ARTIFACT_REPO=app,\
    _SQL_INSTANCE=app-db
```

Cloud Build will:
1. Build and push the Docker image tagged with `$COMMIT_SHA`.
2. Run `prisma migrate deploy` against the live Cloud SQL database via `exec-wrapper`.
3. Deploy the new revision to Cloud Run.

### Health Check

Cloud Run liveness probe hits `GET /api/health`, which returns:

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```
