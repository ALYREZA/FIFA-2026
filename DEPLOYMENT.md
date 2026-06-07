# Deployment Guide

This app runs on **Cloudflare Workers** with a **D1** (SQLite) database. Production deploys use [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

## Architecture

```
Browser
   │
   ▼
Cloudflare Worker  (SvelteKit + adapter-cloudflare)
   │
   ├── ASSETS binding  → static files (.svelte-kit/cloudflare)
   └── DB binding      → D1 database (fifa-2026)
```

External services:

- **Bale Safir** — OTP delivery for phone login
- **better-auth** — session cookies (requires `ORIGIN` + `BETTER_AUTH_SECRET`)

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| Node.js 20+ | Same as local development |
| pnpm | `pnpm install` |
| Cloudflare account | [dash.cloudflare.com](https://dash.cloudflare.com) |
| Wrangler CLI | Included as a dev dependency (`pnpm wrangler`) |
| Bale Safir credentials | [Bale gateway docs](https://docs.bale.ai/gateway) |

## First-time setup

### 1. Log in to Cloudflare

```sh
pnpm wrangler login
```

This opens a browser window to authorize Wrangler with your Cloudflare account.

### 2. Create the D1 database

```sh
pnpm wrangler d1 create fifa-2026
```

Copy the `database_id` from the output and replace the placeholder in `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "fifa-2026",
    "database_id": "<your-real-database-id>"
  }
]
```

Also set `CLOUDFLARE_DATABASE_ID` in your local `.env` to the same value (needed for `pnpm db:push`).

Find your account ID in the Cloudflare dashboard (Workers & Pages → Overview → right sidebar) and set `CLOUDFLARE_ACCOUNT_ID` in `.env`.

### 3. Create a D1 API token (for Drizzle CLI only)

This token is used **only on your machine** when running `pnpm db:push`. It is **not** needed by the deployed Worker.

1. Cloudflare dashboard → **My Profile** → **API Tokens**
2. Create a token with **D1 Edit** permission for your account
3. Save it as `CLOUDFLARE_D1_TOKEN` in `.env`

### 4. Apply database migrations (remote)

Run each migration file against the **remote** D1 instance:

```sh
pnpm db:remote
```

Or run them individually:

```sh
pnpm wrangler d1 execute fifa-2026 --remote --file=migrations/0001_initial.sql
pnpm wrangler d1 execute fifa-2026 --remote --file=migrations/0002_admin_results.sql
pnpm wrangler d1 execute fifa-2026 --remote --file=migrations/0003_username.sql
```

Alternatively, push the Drizzle schema directly (requires `.env` Cloudflare vars):

```sh
pnpm db:push
```

### 5. Set Worker secrets and variables

Secrets are encrypted and only available at runtime on the Worker. Set each one interactively:

```sh
pnpm wrangler secret put BETTER_AUTH_SECRET
pnpm wrangler secret put BALE_CLIENT_ID
pnpm wrangler secret put BALE_CLIENT_SECRET
pnpm wrangler secret put ADMIN_PHONE_NUMBERS
pnpm wrangler secret put ORIGIN
```

| Secret | Value |
|--------|-------|
| `BETTER_AUTH_SECRET` | 32+ character random string ([better-auth docs](https://www.better-auth.com/docs/installation)) |
| `BALE_CLIENT_ID` | From Bale Safir dashboard |
| `BALE_CLIENT_SECRET` | From Bale Safir dashboard |
| `ADMIN_PHONE_NUMBERS` | Comma-separated phones, format `989XXXXXXXXX` |
| `ORIGIN` | Production URL with no trailing slash, e.g. `https://fifa-2026.yourdomain.com` |

Generate a strong secret:

```sh
openssl rand -base64 32
```

> **Important:** `ORIGIN` must exactly match the public URL users visit. Mismatched values break auth cookies and OTP redirects.

## Deploy

### Build and publish

```sh
pnpm deploy
```

This runs `pnpm build` (typecheck + Vite build) then `wrangler deploy`.

On first deploy, Wrangler assigns a `*.workers.dev` URL (because `workers_dev: true` in `wrangler.jsonc`). Use that URL as `ORIGIN` if you have not set up a custom domain yet.

### Verify the deployment

1. Open the Worker URL shown after deploy.
2. Visit `/login` and complete Bale OTP sign-in.
3. Visit `/dashboard` — the tournament seeds automatically on first load.
4. Log in with an admin phone and confirm `/admin/matches` is accessible.

## Custom domain (optional)

1. Cloudflare dashboard → **Workers & Pages** → your `fifa-2026` Worker
2. **Settings** → **Domains & Routes** → **Add Custom Domain**
3. Enter your domain (e.g. `fifa.example.com`)
4. Update the `ORIGIN` secret to match:

   ```sh
   pnpm wrangler secret put ORIGIN
   # Enter: https://fifa.example.com
   ```

5. Redeploy if needed: `pnpm deploy`

## Local preview (with D1)

Local development uses the **local** D1 instance, not the remote database.

```sh
cp .env.example .env        # fill in values
pnpm db:local               # apply local migrations
pnpm build
pnpm preview                # http://localhost:4173
```

For `pnpm preview` / `wrangler dev`, create a `.dev.vars` file (gitignored) with the same runtime secrets:

```ini
ORIGIN=http://localhost:4173
BETTER_AUTH_SECRET=your-local-secret-at-least-32-chars
BALE_CLIENT_ID=your-client-id
BALE_CLIENT_SECRET=your-client-secret
ADMIN_PHONE_NUMBERS=989XXXXXXXXX
```

> Use `pnpm preview`, not `pnpm dev`. The app needs the `DB` D1 binding, which `vite dev` does not provide.

## Updating a live deployment

| Change type | Steps |
|-------------|-------|
| App code | `pnpm deploy` |
| New SQL migration | Add file under `migrations/`, run `pnpm wrangler d1 execute fifa-2026 --remote --file=migrations/XXXX.sql`, then `pnpm deploy` |
| Secret / env var | `pnpm wrangler secret put <NAME>`, then `pnpm deploy` (redeploy ensures Workers pick up changes) |
| Schema via Drizzle | `pnpm db:push`, then `pnpm deploy` |

## Environment variable reference

### Runtime (Worker secrets)

Set via `wrangler secret put`. Required in production.

| Variable | Description |
|----------|-------------|
| `ORIGIN` | Public app URL |
| `BETTER_AUTH_SECRET` | Auth signing secret |
| `BALE_CLIENT_ID` | Bale Safir client ID |
| `BALE_CLIENT_SECRET` | Bale Safir client secret |
| `ADMIN_PHONE_NUMBERS` | Admin phones (`989XXXXXXXXX`, comma-separated) |

### Local-only (`.env`)

Used by Drizzle Kit for remote schema operations. **Not** injected into the Worker.

| Variable | Description |
|----------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_DATABASE_ID` | D1 database ID (same as `wrangler.jsonc`) |
| `CLOUDFLARE_D1_TOKEN` | API token with D1 Edit permission |

### Automatic bindings (`wrangler.jsonc`)

| Binding | Description |
|---------|-------------|
| `DB` | D1 database — no secret needed, configured in `wrangler.jsonc` |
| `ASSETS` | Static assets from the SvelteKit build |

## CI/CD

GitHub Actions workflow: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

| Trigger | Jobs |
|---------|------|
| Pull request | `check` — `pnpm check` + `pnpm lint` |
| Push to `main` | `check`, then `deploy` — `pnpm deploy` |

### One-time setup

1. Create a Cloudflare API token with **Workers Scripts Edit** (and **D1 Edit** if you run migrations in CI).
2. In GitHub → **Settings** → **Secrets and variables** → **Actions**, add:
   - `CLOUDFLARE_API_TOKEN` — the token from step 1

Worker secrets (`BETTER_AUTH_SECRET`, `BALE_*`, `ORIGIN`, etc.) are stored in Cloudflare via `wrangler secret put` and persist across deploys — you do not need to pass them in CI unless you are deploying to a new Worker for the first time.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Auth cookies not set | `ORIGIN` mismatch | Set `ORIGIN` to the exact URL in the browser bar |
| OTP not sent | Invalid Bale credentials or rate limit | Check Bale dashboard; see [Bale docs](https://docs.bale.ai/gateway) |
| `DB is not defined` locally | Using `pnpm dev` | Use `pnpm build && pnpm preview` |
| Admin pages 403 | Phone not in `ADMIN_PHONE_NUMBERS` | Use `989XXXXXXXXX` format, no leading `0` |
| Database errors after deploy | Migrations not applied remotely | Run `pnpm db:remote` |
| Build fails on types | Wrangler bindings out of date | Run `pnpm gen` after changing `wrangler.jsonc` |

## Quick checklist

- [ ] Cloudflare account + `wrangler login`
- [ ] D1 database created, `database_id` in `wrangler.jsonc`
- [ ] Remote migrations applied (`pnpm db:remote`)
- [ ] All five secrets set (`ORIGIN`, `BETTER_AUTH_SECRET`, `BALE_*`, `ADMIN_PHONE_NUMBERS`)
- [ ] `pnpm deploy` succeeds
- [ ] Login, dashboard, and admin flows tested on production URL
