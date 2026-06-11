# FIFA 2026 Forecast

A skill-based prediction game for the FIFA World Cup 2026. Users sign in with **Bale OTP**, pick a public **username**, predict match results, group standings, knockout brackets, tournament extras, and a permanent **podium** pick (top 3 teams), then compete on a points leaderboard.

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
  - Podium (top 3 teams — permanent pick, coin cost decays over time)
- **Rules engine** — locking windows, progressive stage unlocks, bracket consistency, tiered scoring, early-prediction bonuses
- **Game rules page** — points, early bonuses, virtual coins, locking, scoring updates, and public profiles explained in-app
- **Leaderboard** — points, exact scores, earliest submission tiebreaker; click `@username` to view predictions
- **Score recalculation** — saving or editing a match prediction updates your score; admin result entry rescored all users
- **Public profiles** — `/u/[username]` shows another player's predictions (read-only)
- **Admin panel** — enter match results, official standings/extras, rescore all users
- **i18n** — Persian (`fa`) and English (`en`), with locale switcher

## Tech stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Framework | SvelteKit 2, Svelte 5                          |
| Deploy    | Cloudflare Workers + D1                        |
| CI/CD     | GitHub Actions (check, lint, deploy on `main`) |
| Auth      | better-auth (phone OTP)                        |
| Database  | Drizzle ORM + SQLite (D1)                      |
| Styling   | Tailwind CSS v4                                |
| i18n      | Paraglide (en, fa, tr, ar, es)                 |

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

**Local preview** (`pnpm preview`) reads secrets from **`.dev.vars`**, not `.env`:

```sh
cp .dev.vars.example .dev.vars
```

Set at least `ORIGIN` and `BETTER_AUTH_SECRET`. Use the exact preview URL (default `http://localhost:4173`, no trailing slash). If you use another port, update `ORIGIN` to match.

**Drizzle / remote D1** — copy `.env.example` to `.env` for `CLOUDFLARE_*` only:

```sh
cp .env.example .env
```

| Variable              | Where       | Description                                             |
| --------------------- | ----------- | ------------------------------------------------------- |
| `ORIGIN`              | `.dev.vars` | App URL, e.g. `http://localhost:4173` for local preview |
| `BETTER_AUTH_SECRET`  | `.dev.vars` | 32+ character random secret                             |
| `BALE_CLIENT_ID`      | `.dev.vars` | Bale Safir client ID                                    |
| `BALE_CLIENT_SECRET`  | `.dev.vars` | Bale Safir client secret                                |
| `ADMIN_PHONE_NUMBERS` | `.dev.vars` | Admin phones (comma-separated, format `989XXXXXXXXX`)   |
| `DEV_OTP_CODE`        | `.dev.vars` | Optional fixed 6-digit login code for local preview only (requires `ORIGIN` on localhost; skips Bale) |
| `CLOUDFLARE_*`        | `.env` only | Required for remote `db:push` / `db:migrate` only       |

### 3. Initialize local database

```sh
pnpm db:local
```

Applies SQL migrations (`0001`–`0004`, including `username` and `podium_predictions`) to the local D1 instance in `wrangler.jsonc`.

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

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `pnpm build`       | Production build                                  |
| `pnpm preview`     | Run locally with D1 binding (port 4173)           |
| `pnpm check`       | Typecheck (Svelte + TypeScript)                   |
| `pnpm lint`        | ESLint + Prettier                                 |
| `pnpm db:local`    | Apply local D1 migrations                         |
| `pnpm db:remote`   | Apply migrations to remote D1                     |
| `pnpm db:push`     | Push schema to remote D1 (needs Cloudflare creds) |
| `pnpm deploy`      | Build and deploy to Cloudflare Workers            |
| `pnpm auth:schema` | Regenerate better-auth Drizzle schema             |
| `pnpm gen`         | Regenerate Wrangler types                         |

## App routes

| Route            | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `/login`         | Bale OTP sign-in + username setup                          |
| `/dashboard`     | Overview and upcoming matches                              |
| `/predict`       | Match predictions                                          |
| `/standings`     | Group table position picks                                 |
| `/bracket`       | Knockout bracket view                                      |
| `/extras`        | Champion, top scorer, etc.                                 |
| `/podium`        | Top 3 teams (permanent pick, coin cost decays before lock) |
| `/leaderboard`   | Rankings (links to public profiles)                        |
| `/rules`         | Full game rules (points, coins, locking, profiles)         |
| `/u/[username]`  | Public read-only prediction profile                        |
| `/admin/matches` | Admin: enter results (admin phones only)                   |
| `/admin/results` | Admin: official standings & extras                         |

Persian UI: switch locale via **فارسی** in the header (URLs use `/fa/...`).

## Scoring & coins

**Points** drive the leaderboard. See `/rules` in the app for the full breakdown, or `src/lib/forecast/scoring-rules.ts` for point values.

### How scoring works

1. **Users** submit predictions (match scores, standings, extras, podium).
2. **Admins** enter official results (match scores, final group positions, tournament extras).
3. The app compares predictions to official data and writes totals to `user_scores`.
4. **Saving or editing a match prediction** recalculates that user's score immediately (including early bonuses for finished matches).
5. **Admin saving official results** triggers a full rescore for all users.

Predictions never become official results — only admin entries do.

### Point values

| Category                        | Points |
| ------------------------------- | ------ |
| Group — exact score             | 5      |
| Group — correct result          | 2      |
| Group — correct goal difference | +1     |
| Knockout — correct winner       | 3      |
| Knockout — exact score bonus    | +2     |
| Standings — exact position      | 4      |
| Standings — off by one          | 2      |
| Extras — champion               | 10     |
| Extras — runner-up              | 5      |
| Extras — top scorer             | 8      |
| Extras — dark horse             | 6      |
| Podium — 1st place              | 15     |
| Podium — 2nd place              | 10     |
| Podium — 3rd place              | 8      |

### Early prediction bonus

Correct **match** predictions earn extra points when saved well before lock. Bonus tiers (added on top of base match points):

| Hours before lock | Bonus |
| ----------------- | ----- |
| 48+               | +3    |
| 24+               | +2    |
| 6+                | +1    |

- **Lock** = kickoff minus 15 minutes (same as the prediction deadline).
- Bonus uses your **last save time** — editing closer to kickoff reduces or removes the bonus.
- Bonus only applies when the prediction earned base match points (correct result or better).
- Your score is **recalculated** on every save and when admin enters results.

### Locking windows

| Prediction type   | Opens                                          | Locks                                             |
| ----------------- | ---------------------------------------------- | ------------------------------------------------- |
| Group matches     | Immediately                                    | 15 min before kickoff                             |
| Knockout matches  | After previous round is fully finished (admin) | 15 min before kickoff                             |
| Group standings   | Immediately                                    | Tournament start                                  |
| Tournament extras | Immediately                                    | Tournament start                                  |
| Podium            | ~180 days before tournament                    | Permanently on submit; closed at tournament start |

Match predictions can be **edited freely until lock**. After lock, during the match, or after the final whistle — no changes.

### Podium prediction

A separate prediction at `/podium` where users pick the **top 3 teams** (champion, runner-up, third place). Key differences from tournament extras:

|            | Podium                            | Tournament extras                           |
| ---------- | --------------------------------- | ------------------------------------------- |
| Positions  | 1st, 2nd, 3rd only                | Champion, runner-up, top scorer, dark horse |
| Editable?  | **No** — locked forever on submit | Yes, until tournament start                 |
| Coin cost? | **Yes** — decays over time        | Documented; not enforced yet                |
| Points     | 15 / 10 / 8 per correct position  | 10 / 5 / 8 / 6                              |

**Coin cost decay** (linear between open and lock):

- Opens **180 days** before tournament start
- Starts at **200 coins**, decreases to **40 coins** at lock
- Current price is shown on the page before you confirm
- You must keep at least **100 coins** in reserve after spending

**Coins** are a virtual budget (starting balance **1000**) — not real money. Podium submission deducts coins today; other coin costs (matches, standings, extras) are documented on `/rules` for future gamification. Leaderboard rank is based on **points only**, not coin balance.

### Leaderboard tiebreakers

1. Total points (highest wins)
2. Exact scores count (highest wins)
3. Earliest last prediction time (earlier wins)

## Admin

1. Add your Bale phone to `ADMIN_PHONE_NUMBERS` (format `989XXXXXXXXX`, no leading `0`).
2. Log in with that phone and set a username.
3. Open **Admin** in the nav.

**Match results** — set scores and status (`finished` required for points); saving auto-rescores all users.

**Official results** — set final group positions and tournament extras (champion, runner-up, **third place**, top scorer, dark horse). Third place is used to score podium predictions.

**Rescore all** — manually recalculate every user's points without changing results.

**Reseed tournament** — wipes predictions and reloads the full 48-team schedule. Use with care.

> Enter results **after each matchday**, not for future matches. Marking a future match `finished` early locks predictions and scores users prematurely.

## Project structure

```
src/
├── lib/
│   ├── auth-client.ts          # better-auth client
│   ├── forecast/               # scoring rules, game rules (coins, podium)
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
│           ├── coins.ts            # Coin balance & deduction
│           ├── public-profile.ts
│           └── admin-service.ts
├── routes/
│   ├── login/                  # OTP + username step
│   └── (app)/                  # Protected app routes
scripts/
└── wrangler.mjs                # Wrangler wrapper (loads wrangler.jsonc)
.github/workflows/
└── ci.yml                        # GitHub Actions: check, lint, deploy
migrations/                     # D1 SQL migrations (0004 = podium + coin balance)
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

| Trigger        | What runs                        |
| -------------- | -------------------------------- |
| Pull request   | `pnpm check` + `pnpm lint`       |
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
