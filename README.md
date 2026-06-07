# FIFA 2026 Forecast

A skill-based prediction game for the FIFA World Cup 2026. Users sign in with **Bale OTP**, predict match results, group standings, knockout brackets, and tournament extras, then compete on a points leaderboard.

This is **not** a betting app — no stakes, odds, wallets, or cash prizes.

## Features

- **Bale OTP login** via the [Bale Safir gateway](https://docs.bale.ai/gateway)
- **48 teams**, 12 groups (official draw), 72 group matches + full knockout bracket
- **Prediction types**
  - Match scores (group + knockout)
  - Final group table positions (1–4)
  - Knockout bracket (with consistency validation)
  - Tournament extras (champion, runner-up, top scorer, dark horse)
- **Rules engine** — locking windows, progressive stage unlocks, bracket consistency, tiered scoring
- **Leaderboard** — points, exact scores, earliest submission tiebreaker
- **Admin panel** — enter match results, official standings/extras, rescore all users
- **i18n** — Persian (`fa`) and English (`en`), with locale switcher

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2, Svelte 5 |
| Deploy | Cloudflare Workers + D1 |
| Auth | better-auth (phone OTP) |
| Database | Drizzle ORM + SQLite (D1) |
| Styling | Tailwind CSS v4 |
| i18n | Paraglide (en, fa, tr, ar, es) |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)
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

This runs SQL migrations against the local D1 instance defined in `wrangler.jsonc`.

### 4. Run the app

This project uses Cloudflare D1 at runtime. Use **preview** (not `dev`) so the `DB` binding is available:

```sh
pnpm build
pnpm preview
```

Open [http://localhost:4173](http://localhost:4173).

On first visit to the dashboard, the tournament is seeded automatically (48 teams, matches, knockout bracket).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Production build |
| `pnpm preview` | Run locally with D1 binding |
| `pnpm check` | Typecheck (Svelte + TypeScript) |
| `pnpm lint` | ESLint + Prettier |
| `pnpm db:local` | Apply local D1 migrations |
| `pnpm db:push` | Push schema to remote D1 (needs Cloudflare creds) |
| `pnpm auth:schema` | Regenerate better-auth Drizzle schema |
| `pnpm gen` | Regenerate Wrangler types |

## App routes

| Route | Description |
|-------|-------------|
| `/login` | Bale OTP sign-in |
| `/dashboard` | Overview, scoring rules, upcoming matches |
| `/predict` | Match predictions |
| `/standings` | Group table position picks |
| `/bracket` | Knockout bracket view |
| `/extras` | Champion, top scorer, etc. |
| `/leaderboard` | Rankings |
| `/admin/matches` | Admin: enter results (admin phones only) |
| `/admin/results` | Admin: official standings & extras |

Persian UI: switch locale via **فارسی** in the header (URLs use `/fa/...`).

## Scoring (points only)

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

Rules config: `src/lib/forecast/scoring-rules.ts`

## Admin

1. Add your Bale phone to `ADMIN_PHONE_NUMBERS` (format `989XXXXXXXXX`, no leading `0`).
2. Log in with that phone.
3. Open **Admin** in the nav.

**Match results** — set scores and status; saving auto-rescores all users.

**Official results** — set final group positions and tournament extras (champion, etc.).

**Reseed tournament** — wipes predictions and reloads the full 48-team schedule. Use with care.

## Project structure

```
src/
├── lib/
│   ├── auth-client.ts          # better-auth client
│   ├── forecast/               # shared scoring rules
│   ├── components/             # UI components
│   └── server/
│       ├── auth.ts             # Bale OTP + better-auth
│       ├── bale/safir.ts       # Bale API client
│       ├── admin.ts            # Admin phone check
│       └── forecast/
│           ├── data/           # 48 teams, bracket tree
│           ├── rules/          # Validation & scoring engine
│           ├── seed.ts         # Tournament seed
│           └── admin-service.ts
├── routes/
│   ├── login/
│   └── (app)/                  # Protected app routes
migrations/                     # D1 SQL migrations
messages/                       # Paraglide i18n (en.json, fa.json, …)
```

## Bale OTP notes

- Phone numbers must be `989XXXXXXXXX` (Iranian mobile, no leading `0`).
- Users need a **Bale account** on that phone number.
- Rate limits: 30 OTP/hour per phone, 300/min per organization ([docs](https://docs.bale.ai/gateway)).

## Remote deployment

1. Create a Cloudflare D1 database and update `database_id` in `wrangler.jsonc`.
2. Run `pnpm db:push` or apply `migrations/*.sql` to remote D1.
3. Set secrets: `wrangler secret put BALE_CLIENT_ID`, etc.
4. Set `ORIGIN` to your production URL.
5. `pnpm build` and deploy via Wrangler / Cloudflare dashboard.

## License

Private project.
