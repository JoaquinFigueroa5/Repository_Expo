# AGENTS.md

## Project

**REMA** — Inventory & tool loan management system for a technical institute (Guatemala).  
Originally generated from a Figma design (expoOR). All app logic lives in a single file.

## Stack

- React 18 + TypeScript (Vite 6.3.5, `@vitejs/plugin-react`)
- Tailwind CSS v4 (`@tailwindcss/vite` plugin, `@import 'tailwindcss' source(none)`)
- Motion (React animation library)
- shadcn/ui components in `src/app/components/ui/` (48 files)
- MUI 7.3.5 + Emotion (labeled deps, used alongside shadcn)
- Radix UI primitives (many), recharts, sonner, vaul, react-hook-form, react-router

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |

No test, lint, or typecheck tooling is configured.

## Package manager

Use **npm**. Despite `pnpm-workspace.yaml` being present, `package-lock.json` is the lockfile and the README says `npm i`.

## Architecture

- **Entrypoint**: `src/main.tsx` → `src/app/App.tsx`
- **Single-file app**: Entire UI (landing, login, register, forgot-password, verify-code, catalog, account, admin) is one React component (~1800 lines in `src/app/App.tsx`). No code splitting or routing library is used internally (views are toggled via `useState`).
- **Style entry**: `src/styles/index.css` imports `fonts.css` (Google Fonts: Inter, Plus Jakarta Sans), `tailwind.css` (Tailwind v4 + tw-animate-css), and `theme.css` (CSS custom properties, dark mode via `.dark` class)
- **Theme**: Two CSS variable files — `theme.css` (active, dark-themed) and `default_shadcn_theme.css` (reference only, from the shadcn generator)
- **DB schema**: `db/Rema.sql` — MySQL reference for a backend, **not connected** to the frontend

## Vite config quirks

- Custom `figmaAssetResolver()` plugin allows `import 'figma:asset/filename'` → resolves to `src/assets/filename`
- `@` alias → `./src`
- `assetsInclude` includes `*.svg` and `*.csv` (comment warns: never add `.css`, `.tsx`, or `.ts`)
- React and Tailwind plugins are both required even if Tailwind is not actively used (per inline comment)
- pnpm override pins vite to 6.3.5 (in `package.json`)

## Import convention for assets

Images and files from the Figma export live in `src/imports/` and are referenced as `/src/imports/...` (public-relative paths), not via the `@` alias.

## shadcn/ui components

48 pre-generated components in `src/app/components/ui/`. Use `clsx`, `tailwind-merge` (`cn()`), `class-variance-authority` for styling. Standard shadcn patterns apply.

## Worth knowing

- No CI/CD, no linting, no formatting config, no pre-commit hooks
- `ATTRIBUTIONS.md` credits shadcn/ui (MIT) and Unsplash photos
- The project ships `default_shadcn_theme.css` as a reference; the actual active theme is `theme.css`
- `src/app/components/figma/ImageWithFallback.tsx` is the only custom figma component helper
