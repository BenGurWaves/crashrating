# CrashRating

**Official NHTSA 5-star crash test ratings — served fast, designed to last.**

CrashRating is a high-performance Next.js web application that surfaces official
NHTSA safety ratings for 150+ popular vehicles. Users can look up ratings by
year/make/model, compare two vehicles side-by-side, save comparisons, and
track favorite models on a watchlist. Pro features (unlimited saves) are
available via Stripe Checkout.

## Tech Stack

| Layer        | Technology                                                         |
|--------------|-------------------------------------------------------------------|
| Framework    | [Next.js 16.3.1](https://nextjs.org) (App Router)                |
| UI           | React 19 · Tailwind CSS v4 · TypeScript 5                        |
| Fonts        | Space Grotesk (display) + Inter (body) via Google Fonts          |
| Auth         | Supabase Auth (email + password)                                  |
| Database     | Supabase PostgreSQL (rating cache, saved comparisons, watchlist) |
| Payments     | Stripe Checkout (server-side session creation)                   |
| Hosting      | Cloudflare Pages + Functions                                     |
| Rate limiting| NHTSA vPIC + SafetyRatings APIs (cached 30 days in Supabase)     |

## Features

- **Rating lookup** — Enter year/make/model via cascading dropdowns (powered by
  the NHTSA vPIC API) and see the full 5-star safety rating breakdown
  (overall, frontal, side, rollover, crash avoidance tech ratings).
- **Side-by-side comparison** — Compare two vehicles' ratings in a
  color-coded table. URL params pre-fill the selectors so comparisons can be
  shared via link.
- **Static detail pages** — 151 pre-generated SSG pages at
  `/safety-ratings/[year]/[make]/[model]` with daily ISR revalidation for
  top vehicles, complete with JSON-LD structured data.
- **Watchlist** — Authenticated users can add/remove vehicles from a
  personal watchlist.
- **Saved comparisons** — Pro users can save up to 50 comparison snapshots.
- **Pro tier** — Stripe Checkout for monthly or annual billing.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/          # POST — create Stripe Checkout Session
│   │   ├── ratings/lookup/    # GET — NHTSA rating lookup w/ Supabase cache
│   │   ├── saved-comparisons/ # GET/POST/DELETE — CRUD saved comparisons
│   │   ├── watchlist/         # GET/POST/DELETE — CRUD watchlist items
│   │   └── vpic/              # GET — vPIC API proxy (makes, models)
│   ├── about/                 # Static about page
│   ├── compare/               # Side-by-side comparison (Suspense + useSearchParams)
│   ├── dashboard/             # Auth-required saved comps + watchlist
│   ├── login/                 # Sign-in page
│   ├── pricing/               # Pricing tiers + Stripe Checkout
│   ├── safety-ratings/[y]/[m]/[model]/  # 151 SSG + ISR detail pages
│   ├── layout.tsx             # Root layout w/ SupabaseProvider + Header + Footer
│   ├── globals.css            # Tailwind v4 @theme + custom palette
│   ├── robots.ts              # Allow GPTBot, ClaudeBot, PerplexityBot
│   ├── sitemap.ts             # Auto-generated sitemap
│   └── llms.txt/              # LLM-friendly site summary
├── components/                # Modular React components
├── data/top-vehicles.ts       # 151 vehicles across 18 segments
├── lib/
│   ├── nhtsa.ts              # NHTSA API client (server-side, 8s timeout)
│   ├── supabase/             # client, server, admin helpers
│   ├── stripe.ts             # Lazy Stripe client (getStripe())
│   ├── content.ts            # Vehicle-specific generated content
│   └── utils.ts              # slugify, formatVehicleName, etc.
└── types/
    ├── nhtsa.ts              # NHTSA API response types
    └── supabase.ts           # Supabase Database interface
```

## Getting Started

### Prerequisites

- Node.js 20+ (tested on Node 26)
- npm 11+
- A Supabase project (for auth + database)
- A Stripe account (for checkout)
- A GitHub account (for deployment)

### Installation

```bash
git clone <your-fork-url> crashrating
cd crashrating
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Public/Private | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | Server-only; for cache writes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Private | Stripe secret key (server-side only) |
| `STRIPE_WEBHOOK_SECRET` | Private | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY` | Public | Stripe monthly price ID |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY` | Public | Stripe yearly price ID |

**Security note:** All private keys (`SUPABASE_SERVICE_ROLE_KEY`,
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) are read exclusively in
server-side API routes via `process.env`. They never appear in the
browser bundle.

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`.

### Build

```bash
npm run build
```

The build prerenders 151 static safety-rating pages with ISR (`revalidate: 86400`).
Each page fetches fresh data from the NHTSA API via the `/api/ratings/lookup`
route, which caches results in Supabase for 30 days.

### Lint

```bash
npm run lint
```

## Deployment (Cloudflare Pages)

### 1. Push to GitHub

```bash
git init
git add -A
git commit -m "Initial build"
git branch -M main
git remote add origin git@github.com:<your-username>/crashrating.git
git push -u origin main
```

### 2. Create a Cloudflare Pages Project

#### Option A: GitHub Integration (recommended for automatic deploys)

1. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/pages)
2. Create a new project → Connect to your GitHub repo (`BenGurWaves/crashrating`)
3. Configure build settings:

| Setting | Value |
|---|---|
| Framework preset | Next.js (App Router) |
| Build command | `npm run build && npx @cloudflare/next-on-pages` |
| Build output directory | `.vercel/output/static` |
| Node.js version | 20+ |

4. Add build environment variable: `NPM_CONFIG_LEGACY_PEER_DEPS=true`
   (needed for `@cloudflare/next-on-pages` peer dependency with Next.js 16)
5. Add all 9 environment variables from `.env.example` (both public and private) as
   "Secrets" so they're available at runtime. `NPM_CONFIG_LEGACY_PEER_DEPS` is also
   needed during build — set it as a secret or build env var.
6. Set the custom domain to `crashrating.calyvent.com`.

#### Option B: CLI Deploy (no GitHub integration)

```bash
npm install -D @cloudflare/next-on-pages --legacy-peer-deps
npm run build
NPM_CONFIG_LEGACY_PEER_DEPS=true npx @cloudflare/next-on-pages
npx wrangler pages deploy .vercel/output/static --project-name crashrating --branch main --no-bundle
```

> **Note:** A Cloudflare API token with `pages:write`, `account:read`, and
> `zone:DNS:edit` scopes is required for full CLI management (deploy + DNS).
> The token used in this project has `pages:write` + `zone:read` only — sufficient
> for deploys but not for DNS record creation.

**Current status:** The project is deployed and live at
<https://crashrating.pages.dev> (production, `--branch main`). The custom domain
`crashrating.calyvent.com` is configured in the Pages project (status: pending).
To activate the custom domain, create a CNAME DNS record:

| Record | Type | Name | Content | Proxy | TTL |
|---|---|---|---|---|---|
| (auto) | CNAME | `crashrating` | `crashrating.pages.dev` | Proxied (orange cloud) | Auto |

Create this record in the Cloudflare Dashboard → DNS for the `calyvent.com` zone.

### 3. Supabase Setup

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Rating cache (NHTSA data, 30-day TTL)
create table rating_cache (
  id text primary key,
  year integer,
  make text,
  model text,
  vehicle_id integer,
  rating_data jsonb,
  last_fetched timestamptz default now()
);

-- Saved comparisons
create table saved_comparisons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  vehicle_a jsonb,
  vehicle_b jsonb,
  created_at timestamptz default now()
);

-- Watchlist
create table watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  year integer,
  make text,
  model text,
  created_at timestamptz default now(),
  unique (user_id, year, make, model)
);

-- Enable RLS
alter table saved_comparisons enable row level security;
alter table watchlist enable row level security;

create policy "Users can CRUD own saved_comparisons"
  on saved_comparisons for all using (auth.uid() = user_id);

create policy "Users can CRUD own watchlist"
  on watchlist for all using (auth.uid() = user_id);
```

### 4. Stripe Setup

1. Create a product in the Stripe Dashboard
2. Add monthly and yearly price IDs
3. Set up a webhook endpoint for `checkout.session.completed` events
4. Add the webhook signing secret as `STRIPE_WEBHOOK_SECRET` in Cloudflare Pages

## SEO & AI Discoverability

- **`robots.txt`** — Allows Google, GPTBot, ClaudeBot, PerplexityBot
- **`sitemap.xml`** — Auto-generated, includes all static routes
- **`llms.txt`** — Plain-text site summary for LLM scraping
- **JSON-LD** — Article + FAQPage schema on safety-rating pages,
  Organization + FAQPage on the homepage
- **OpenGraph + Twitter Cards** — Meta tags on every route
- **Favicon set** — `favicon.ico`, 16/32/192/512px PNGs, Apple touch icon
- **`og-image.png`** — 1200×630 OpenGraph image

## Design System

- **Display font:** Space Grotesk (bold headlines, high contrast)
- **Body font:** Inter (clean, legible UI)
- **Color palette:** Deep charcoal (#0a0a0a) background, amber (#f59e0b)
  accent, gold (#d4af37) star ratings — inspired by automotive safety
  color coding (amber caution, gold excellence). No blue/purple gradients.

## License

Proprietary — all rights reserved.
