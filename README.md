# FIFA 2026 Forecast

A skill-based prediction game for the FIFA World Cup 2026. Users sign in with **Bale OTP**, pick a public **username**, predict match results, group standings, knockout brackets, and tournament extras, then compete on a points leaderboard.

This is **not** a betting app — no stakes, odds, real-money wallets, or cash prizes.

## Features

- **Bale OTP login** via the [Bale Safir gateway](https://docs.bale.ai/gateway)
- **Public username** — chosen at sign-in; shown on leaderboard and profiles (phone numbers stay private)
- **48 teams**, 12 groups (official draw), 72 group matches + full knockout bracket
- **Prediction types**
  - Match scores (group + knockout)
  - Final group table positions (1–4)
  - Knockout bracket (with consistency validation)
  - Tournament extras (champion, runner-up, top scorer, dark horse)
- **Rules engine** — locking windows, progressive stage unlocks, bracket consistency, tiered scoring
- **Game rules page** — points, virtual coins, locking, and public profiles explained in-app
- **Leaderboard** — points, exact scores, earliest submission tiebreaker; click `@username` to view predictions
- **Public profiles** — `/u/[username]` shows another player's predictions (read-only)
- **Admin panel** — enter match results, official standings/extras, rescore all users
- **i18n** — Persian (`fa`) and English (`en`), with locale switcher

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2, Svelte 5 |
| Deploy | Cloudflare Workers + D1 |
| CI/CD | GitHub Actions (check, lint, deploy on `main`) |
| Auth | better-auth (phone OTP) |
| Database | Drizzle ORM + SQLite (D1) |
| Styling | Tailwind CSS v4 |
| i18n | Paraglide (en, fa, tr, ar, es) |

## Prerequisites

- Node.js 22+ (required by Wrangler)
- [pnpm](https://pnpm.io/) — **use pnpm for this project** (not Yarn PnP from a parent monorepo)
- Bale Safir OTP credentials ([Bale gateway](https://docs.bale.ai/gateway))
- Cloudflare account (for production D1)

## Getting started

### 1. Install dependencies

```sh
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in:

```sh
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `ORIGIN` | App URL, e.g. `http://localhost:4173` for local preview |
| `BETTER_AUTH_SECRET` | 32+ character random secret |
| `BALE_CLIENT_ID` | Bale Safir client ID |
| `BALE_CLIENT_SECRET` | Bale Safir client secret |
| `ADMIN_PHONE_NUMBERS` | Admin phones (comma-separated, format `989XXXXXXXXX`) |
| `CLOUDFLARE_*` | Required for remote `db:push` / `db:migrate` only |

### 3. Initialize local database

```sh
pnpm db:local
```

Applies SQL migrations (`0001`–`0003`, including the `username` column) to the local D1 instance in `wrangler.jsonc`.

### 4. Run the app

This project uses Cloudflare D1 at runtime. Use **preview** (not `vite dev`) so the `DB` binding is available:

```sh
pnpm build
pnpm preview
```

Open [http://localhost:4173](http://localhost:4173).

On first sign-in, choose a username after OTP verification. On first visit to the dashboard, the tournament is seeded automatically (48 teams, matches, knockout bracket).

> **Important:** Always use `pnpm preview`, `pnpm deploy`, and `pnpm db:*` — not bare `wrangler` commands. Wrangler is run via `scripts/wrangler.mjs`, which loads `wrangler.jsonc` (required for D1 bindings, `nodejs_compat`, and module aliases).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Production build |
| `pnpm preview` | Run locally with D1 binding (port 4173) |
| `pnpm check` | Typecheck (Svelte + TypeScript) |
| `pnpm lint` | ESLint + Prettier |
| `pnpm db:local` | Apply local D1 migrations |
| `pnpm db:remote` | Apply migrations to remote D1 |
| `pnpm db:push` | Push schema to remote D1 (needs Cloudflare creds) |
| `pnpm deploy` | Build and deploy to Cloudflare Workers |
| `pnpm auth:schema` | Regenerate better-auth Drizzle schema |
| `pnpm gen` | Regenerate Wrangler types |

## App routes

| Route | Description |
|-------|-------------|
| `/login` | Bale OTP sign-in + username setup |
| `/dashboard` | Overview and upcoming matches |
| `/predict` | Match predictions |
| `/standings` | Group table position picks |
| `/bracket` | Knockout bracket view |
| `/extras` | Champion, top scorer, etc. |
| `/leaderboard` | Rankings (links to public profiles) |
| `/rules` | Full game rules (points, coins, locking, profiles) |
| `/u/[username]` | Public read-only prediction profile |
| `/admin/matches` | Admin: enter results (admin phones only) |
| `/admin/results` | Admin: official standings & extras |

Persian UI: switch locale via **فارسی** in the header (URLs use `/fa/...`).

## Scoring & coins

**Points** drive the leaderboard. See `/rules` in the app for the full breakdown, or `src/lib/forecast/scoring-rules.ts` for point values.

| Category | Points |
|----------|--------|
| Group — exact score | 5 |
| Group — correct result | 2 |
| Group — correct goal difference | +1 |
| Knockout — correct winner | 3 |
| Knockout — exact score bonus | +2 |
| Standings — exact position | 4 |
| Standings — off by one | 2 |
| Extras — champion | 10 |
| Extras — runner-up | 5 |
| Extras — top scorer | 8 |
| Extras — dark horse | 6 |

**Coins** are a virtual budget (starting balance 1000) documented on `/rules`. Coin spending/earn-back is planned gamification — not real money.

## Admin

1. Add your Bale phone to `ADMIN_PHONE_NUMBERS` (format `989XXXXXXXXX`, no leading `0`).
2. Log in with that phone and set a username.
3. Open **Admin** in the nav.

**Match results** — set scores and status; saving auto-rescores all users.

**Official results** — set final group positions and tournament extras (champion, etc.).

**Reseed tournament** — wipes predictions and reloads the full 48-team schedule. Use with care.

## Project structure

```
src/
├── lib/
│   ├── auth-client.ts          # better-auth client
│   ├── forecast/               # scoring rules, game rules (coins)
│   ├── components/             # UI components
│   └── server/
│       ├── auth.ts             # Bale OTP + better-auth
│       ├── user.ts             # Username validation & lookup
│       ├── bale/safir.ts       # Bale API client
│       ├── admin.ts            # Admin phone check
│       └── forecast/
│           ├── data/           # 48 teams, bracket tree
│           ├── rules/          # Validation & scoring engine
│           ├── seed.ts         # Tournament seed
│           ├── public-profile.ts
│           └── admin-service.ts
├── routes/
│   ├── login/                  # OTP + username step
│   └── (app)/                  # Protected app routes
scripts/
└── wrangler.mjs                # Wrangler wrapper (loads wrangler.jsonc)
.github/workflows/
└── ci.yml                        # GitHub Actions: check, lint, deploy
migrations/                     # D1 SQL migrations
messages/                       # Paraglide i18n (en.json, fa.json, …)
wrangler.jsonc                  # Worker config, D1, module aliases
```

## Bale OTP notes

- Phone numbers must be `989XXXXXXXXX` (Iranian mobile, no leading `0`).
- Users need a **Bale account** on that phone number.
- Rate limits: 30 OTP/hour per phone, 300/min per organization ([docs](https://docs.bale.ai/gateway)).

## Troubleshooting

### `wrangler: command not found`

Run `pnpm install` from the project root. All Wrangler commands go through `pnpm` scripts.

### `Could not resolve "drizzle-orm"` / `esm-env` / `async_hooks`

You are likely running bare `wrangler dev` (or from a Yarn PnP monorepo root) without loading `wrangler.jsonc`.

**Fix:** use `pnpm preview` from `fifa-2026/` after `pnpm build`.

If you must use Yarn in a parent repo, set `nodeLinker: node-modules` in that repo's `.yarnrc.yml`.

### Port 4173 already in use

Stop the previous preview process, or run:

```sh
node scripts/wrangler.mjs dev --port 4174
```

## Deployment & CI/CD

Production runs on **Cloudflare Workers + D1**. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full guide (D1 setup, secrets, custom domain, troubleshooting).

### GitHub Actions

Workflow: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

| Trigger | What runs |
|---------|-----------|
| Pull request | `pnpm check` + `pnpm lint` |
| Push to `main` | Check + lint, then `pnpm deploy` |

**One-time setup:** add a `CLOUDFLARE_API_TOKEN` repository secret (Cloudflare API token with **Workers Scripts Edit**). Worker runtime secrets (`ORIGIN`, `BETTER_AUTH_SECRET`, `BALE_*`, `ADMIN_PHONE_NUMBERS`) are stored in Cloudflare via `wrangler secret put` and persist across deploys.

### Manual deploy

For first-time setup or ad-hoc deploys:

```sh
node scripts/wrangler.mjs login
node scripts/wrangler.mjs d1 create fifa-2026   # update database_id in wrangler.jsonc
pnpm db:remote                                 # apply migrations to remote D1
node scripts/wrangler.mjs secret put ORIGIN    # repeat for all secrets (see DEPLOYMENT.md)
pnpm deploy
```

After CI is configured, routine deploys happen automatically when you merge to `main`.

## License

Private project.
