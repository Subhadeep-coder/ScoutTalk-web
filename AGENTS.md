<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Before you code

- **pnpm** only — never use npm or yarn
- Tailwind v4: configured via `postcss.config.mjs` with `@tailwindcss/postcss`, no `tailwind.config.js`
- ESLint v9 flat config (`eslint.config.mjs`), not `.eslintrc*`
- shadcn/ui (Radix Rhea style): `cn()` from `@/lib/utils`, components live in `@/components/ui`
- App Router at root (`app/`, not `src/` or `pages/`)
- No test framework, no Prettier — `pnpm lint` is the only verification command

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Lint (only check — no typecheck or test) |
| `pnpm dlx shadcn@latest add <name>` | Add shadcn/ui component |

## Conventions

- **Commit:** `type: message` — types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`. No `--no-verify` or `--force`.
- **Components:** Default export function, no `React.FC`. Props typed inline as `Readonly<{ ... }>`.
- **Imports:** `import type` for type-only.
- **`@/*`** resolves from project root (e.g. `@/components/ui/button`).
- **Fonts** already configured: Space Grotesk (sans), Geist (mono), JetBrains Mono (heading). Check before adding more.
