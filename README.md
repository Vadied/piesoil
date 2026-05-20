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
| Validation | Zod (server-side schema validation on all mutation endpoints) |
| Runtime | Node 20, Cloud Run (GCP) |

## Prerequisites

- Node.js 20+
- PostgreSQL 15 running locally (or Docker)
- A Google OAuth app (optional for credential-only auth)

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the example env file and fill in values
cp .env.example .env.local

# 3. Apply migrations and generate the Prisma client
npm run db:migrate:dev

# 4. Seed the initial admin user
#    Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD (and optionally SEED_ADMIN_NAME)
#    in .env.local first, then:
npm run db:seed
```

## Environment Variables

All secrets and external endpoints are read from environment variables. Copy `.env.example` to `.env.local` for local development. In production, all variables are stored in **Secret Manager** and injected as Cloud Run environment variables.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string — include `?connection_limit=5&pool_timeout=2` for Cloud Run |
| `NEXTAUTH_SECRET` | JWT/session signing secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Canonical URL of the deployment |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GCS_BUCKET_NAME` | GCS bucket for uploaded cover images |
| `REVALIDATION_SECRET` | Secret token for the `POST /api/revalidate` endpoint (`openssl rand -base64 32`) |
| `SEED_ADMIN_EMAIL` | Email for the initial admin user (seed only) |
| `SEED_ADMIN_PASSWORD` | Plain-text password hashed by the seed script (seed only) |
| `SEED_ADMIN_NAME` | Display name for the initial admin user (seed only, default: `Admin`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 Measurement ID (format: `G-XXXXXXXXXX`). Leave empty to disable analytics. |
| `NODE_ENV` | `development` locally, `production` on Cloud Run |

See `.env.example` for full descriptions and example values.

## Running the Project

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

## Project Structure

```
src/
  app/
    (public)/              Public site routes — layout has header + footer
      page.tsx             Home page (/)
      blog/
        page.tsx           Blog listing with pagination (/blog?page=N)
        [slug]/page.tsx    Article detail with markdown rendering (/blog/:slug)
    backoffice/            Authenticated backoffice (/backoffice/*)
      dashboard/           Dashboard (/backoffice/dashboard)
    api/
      auth/[...nextauth]/  NextAuth.js handler
      health/              Liveness probe for Cloud Run (/api/health)
      articles/
        route.ts           GET /api/articles?page=N  — paginated article list (JSON)
        [slug]/route.ts    GET /api/articles/:slug   — single article detail (JSON)
      revalidate/
        route.ts           POST /api/revalidate      — on-demand ISR revalidation
    error.tsx              App-level error boundary (runtime errors in page segments)
    global-error.tsx       Root-level error boundary (errors in the root layout)
    not-found.tsx          Custom 404 page
    layout.tsx             Root HTML shell (lang, fonts, global CSS)
    globals.css            Tailwind directives
  components/
    ui/                    Shared UI primitives
    public/                Public-site-specific components
    backoffice/            Backoffice-specific components
  lib/
    articles.ts            Cached Prisma queries for published articles (unstable_cache)
    auth.ts                NextAuth options (shared between route handler and server code)
    db.ts                  Prisma client singleton
    rate-limit.ts          In-process sliding-window rate limiter (login endpoint)
    schemas.ts             Zod validation schemas + parseBody() helper
    storage.ts             Google Cloud Storage helpers
  types/
    index.ts               Application-level TypeScript types
    next-auth.d.ts         NextAuth session type augmentation
  middleware.ts            Auth protection (backoffice) + rate limiting (login)
prisma/
  schema.prisma            Prisma schema — User, Article, Category, Tag + NextAuth models
  seed.ts                  Seeds the initial admin user
  migrations/              Generated migration history
```

## Blog & ISR Caching

### Public Blog

`/blog` renders a paginated grid of published articles (9 per page). `/blog/:slug` renders the full article with markdown content. Both pages use the same cached Prisma query (tagged `articles`, 5-minute TTL) so database load is minimal.

### On-demand Revalidation

When an article is published or updated from the backoffice, call the revalidation endpoint to flush the cache immediately:

```bash
curl -X POST https://<your-domain>/api/revalidate \
  -H "x-revalidate-secret: <REVALIDATION_SECRET>"
```

The endpoint also accepts the token as a `?secret=` query parameter for webhook-style callers. It returns:

```json
{ "revalidated": true, "tag": "articles", "timestamp": "..." }
```

`REVALIDATION_SECRET` must be set in Secret Manager (production) or `.env.local` (development). Generate with `openssl rand -base64 32`.

### JSON API

| Endpoint | Description |
|---|---|
| `GET /api/articles?page=N` | Paginated published articles |
| `GET /api/articles/:slug` | Single article detail |
| `POST /api/revalidate` | Flush article cache (requires `x-revalidate-secret` header) |

## Authentication & User Roles

### Roles

| Role | Permissions |
|---|---|
| `ADMIN` | Full access: all articles, all backoffice sections including user management |
| `CO_EDITOR` | Restricted access: can only create and edit their own articles; no access to user management |

### Seeding the Initial Admin Account

The database ships empty. Before the first login, create the admin user with the seed script:

```bash
# Set these in .env.local (never commit real values)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=strongpassword
SEED_ADMIN_NAME=Admin        # optional, defaults to "Admin"

npm run db:seed
```

The seed script hashes the password with bcrypt (12 rounds) before storing it. Running `db:seed` multiple times is safe — it upserts and leaves an existing admin untouched.

### Creating Co-editor Accounts

Additional co-editor accounts are created from the **Backoffice → Utenti → Nuovo co-editor** panel (admin role required). Passwords are hashed server-side before storage; plaintext passwords are never persisted. An admin can also disable or re-enable a co-editor (preventing login without deleting data) or permanently delete an account that has no associated articles.

### Backoffice Login

The backoffice is protected by Next.js middleware. Unauthenticated requests to any `/backoffice` route are redirected to `/backoffice/login`. Two sign-in methods are supported:

- **Email + password** — credentials validated against bcrypt-hashed passwords stored in PostgreSQL. User accounts must exist in the database (created by the seed script or by an admin). Disabled accounts are rejected at login.
- **Google OAuth** — delegates to Google using the credentials configured in `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

The user's role (`ADMIN` or `CO_EDITOR`) is propagated from the database through the JWT into `session.user.role`.

### Google OAuth — Redirect URI Configuration

The authorised redirect URI must be registered in the [Google Cloud Console](https://console.cloud.google.com/) under **APIs & Services → Credentials → OAuth 2.0 Client IDs**.

| Environment | Redirect URI |
|---|---|
| Local development | `http://localhost:3000/api/auth/callback/google` |
| Cloud Run (production) | `https://<YOUR_CLOUD_RUN_URL>/api/auth/callback/google` |

Steps:
1. Open **APIs & Services → Credentials** and select (or create) your OAuth 2.0 client.
2. Under **Authorised redirect URIs**, add both URIs above.
3. Copy the **Client ID** and **Client Secret** into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (locally in `.env.local`; in production via Secret Manager).
4. Ensure `NEXTAUTH_URL` is set to the canonical URL of the deployment (e.g. `https://app.example.com` on Cloud Run) so that NextAuth generates the correct callback URL.

> **Note:** Google OAuth is optional for local development. If `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are left empty, only email + password login will work.

## Production Hardening

### Input Validation

All Route Handlers that accept a request body validate input with **Zod schemas** (`src/lib/schemas.ts`). Invalid requests receive a structured JSON response:

```json
{
  "error": "Dati non validi",
  "errors": [{ "field": "email", "message": "Formato email non valido" }]
}
```

HTTP 422 is returned for validation failures; HTTP 400 for malformed JSON bodies.

### Rate Limiting

The credentials login endpoint (`POST /api/auth/callback/credentials`) is protected by an **in-process sliding-window rate limiter**: a maximum of 10 attempts per IP address within a 15-minute window. Exceeded requests receive HTTP 429.

The rate limiter lives in `src/lib/rate-limit.ts` and uses an in-memory Map — it is intentionally per-instance. On Cloud Run with multiple active revisions each instance maintains its own window, which is the accepted trade-off for a stateless, no-dependency approach. For stricter enforcement across instances, replace the store with Redis/Memorystore.

### Security Headers

The following HTTP security headers are applied to every response via `next.config.ts`:

| Header | Value |
|---|---|
| `Content-Security-Policy` | Restricts scripts/styles/fonts/images/connections to `'self'` + required Google domains |
| `X-Frame-Options` | `DENY` — prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` — prevents MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disables camera, microphone, geolocation |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

### Error Handling

- **`app/error.tsx`** — catches runtime errors in any page or layout segment; renders a user-friendly Italian-language fallback inside the root layout.
- **`app/global-error.tsx`** — catches errors thrown inside the root layout itself; renders a full-page fallback with its own `<html>/<body>` shell.
- **`app/not-found.tsx`** — custom 404 page shown for unknown routes or when `notFound()` is called server-side.

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
   - `DATABASE_URL` — PostgreSQL connection string using the Unix socket path for Cloud Run with pool limits:
     `postgresql://USER:PASS@/DB?host=/cloudsql/PROJECT:REGION:INSTANCE&connection_limit=5&pool_timeout=2`
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GCS_BUCKET_NAME`, `REVALIDATION_SECRET`
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

### Cloud SQL Auth Proxy Sidecar

The Cloud Run service definition must include the Cloud SQL Auth Proxy as a sidecar container alongside the Next.js container. The proxy listens on a Unix socket (`/cloudsql/PROJECT:REGION:INSTANCE`) that Prisma connects to via `DATABASE_URL`. No public IP or VPC connector is needed.

Minimum Cloud Run service configuration:

```yaml
# containers:
#   - name: app
#     image: <ARTIFACT_REGISTRY_IMAGE>
#     env:
#       - name: DATABASE_URL
#         valueFrom:
#           secretKeyRef: { name: database-url, key: latest }
#       # ... other secrets
#   - name: cloud-sql-proxy
#     image: gcr.io/cloud-sql-connectors/cloud-sql-proxy:2
#     args:
#       - "--unix-socket=/cloudsql"
#       - "PROJECT:REGION:INSTANCE"
#     volumeMounts:
#       - name: cloudsql
#         mountPath: /cloudsql
# volumes:
#   - name: cloudsql
#     emptyDir: {}
```

### Health Check

Cloud Run liveness probe hits `GET /api/health`, which returns:

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```
