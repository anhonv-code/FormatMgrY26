# Shell Cafe CRM

A customer relationship management system for Shell Cafe built with Next.js 14, Supabase, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database / Auth**: Supabase — schema `shell_cafe` (not `public`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with a custom `brand` color palette
- **Supabase client**: `@supabase/ssr` for cookie-based SSR sessions

## Development Setup

```bash
npm install
cp .env.example .env.local   # fill in real Supabase credentials
npm run dev                   # http://localhost:3000
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL — **no trailing path** (e.g. `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — server-only, never exposed to browser |

## Common Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run type-check   # tsc --noEmit (no emitted files)
npm run lint         # eslint
```

## Project Structure

```
src/
  app/
    (auth)/login/          # login page + LoginForm client component
    (dashboard)/           # protected route group
      layout.tsx           # checks auth, renders Sidebar + Header
      dashboard/page.tsx   # stats overview (server component)
      customers/page.tsx   # customer list table
      orders/page.tsx      # orders table with status badges
      products/page.tsx    # product card grid
    layout.tsx             # root layout (Inter font, globals.css)
    page.tsx               # redirects / → /dashboard
    globals.css
  components/
    layout/
      Sidebar.tsx          # nav links, active-link highlighting (client)
      Header.tsx           # user email + SignOutButton
      SignOutButton.tsx     # calls supabase.auth.signOut() (client)
  lib/
    supabase/
      client.ts            # createClient() — browser, uses shell_cafe schema
      server.ts            # createClient() + createServiceClient() — server
      middleware.ts        # updateSession() — refreshes cookie & redirects
  middleware.ts            # Next.js edge middleware entry point
  types/
    supabase.ts            # Database type (shell_cafe tables)
    index.ts               # Row/Insert/Update aliases (Customer, Order, etc.)
```

## Supabase Schema Notes

All tables live in the `shell_cafe` schema. Every client is initialized with:

```ts
{ db: { schema: "shell_cafe" } }
```

Current tables: `customers`, `orders`, `order_items`, `products`.

When the schema changes, regenerate types:

```bash
npx supabase gen types typescript \
  --project-id <ref> \
  --schema shell_cafe \
  > src/types/supabase.ts
```

## Auth Flow

1. `src/middleware.ts` runs on every request (except static assets).
2. Unauthenticated requests to non-auth routes → redirect `/login`.
3. Authenticated requests to `/login` → redirect `/dashboard`.
4. Login uses `supabase.auth.signInWithPassword` (email + password).
5. Session is stored in cookies and refreshed by the middleware on each request.

## Coding Conventions

- **Server components** by default; add `"use client"` only when needed (event handlers, hooks, browser APIs).
- **Data fetching** in server components via `createClient()` from `@/lib/supabase/server`.
- **Mutations** (forms, buttons) in client components via `createClient()` from `@/lib/supabase/client`.
- Prices are stored as **integers (cents)** — display with `(value / 100).toFixed(2)`.
- Import alias `@/*` maps to `src/*`.
- No comments unless the WHY is non-obvious.
