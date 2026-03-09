# SmileFit — Project Conventions

## Overview
Outdoor fitness class booking platform for Italian cities.

## Tech Stack
- React 19, TypeScript (strict, no `any`), Vite 7
- Tailwind CSS v4, shadcn/ui (Radix)
- React Router v7, TanStack Query v5
- React Hook Form + Zod v4
- Supabase (auth, database, storage)

## Commands
- `npm run dev` — start dev server
- `npm run build` — type-check and build
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

## Project Structure
```
src/
├── components/     # Shared components
│   └── ui/         # shadcn/ui components
├── context/        # React context providers
├── hooks/          # Custom hooks
├── lib/            # Utilities (supabase client, helpers)
├── pages/          # Route-level page components
└── types/          # Shared TypeScript interfaces
```

## Conventions
- **Named exports only** — no default exports
- **Co-locate types** in component files unless shared across modules; shared types go in `src/types/`
- **Brand color**: `#2563EB` (used for "Smile" in logo, primary CTAs)
- **Import alias**: `@/` maps to `src/`
- **No `any`** — use `unknown` and narrow, or define proper types
- **Forms**: React Hook Form + Zod schemas for validation
- **Data fetching**: TanStack Query hooks in `src/hooks/`
- **Auth**: use `useUser()` hook from `src/context/AuthContext.tsx`
- **CSS**: Tailwind utility classes; use shadcn/ui components from `@/components/ui/`
- **Environment variables**: prefix with `VITE_`; never commit `.env` files
