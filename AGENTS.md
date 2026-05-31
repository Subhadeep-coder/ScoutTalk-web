<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ScoutTalk Web

## Tech stack

- **Framework:** Next.js 16.2.6 (App Router)
- **Language:** TypeScript (strict)
- **UI:** React 19.2.4, shadcn/ui (Radix Rhea style)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss` plugin, no `tailwind.config.js`)
- **Linting:** ESLint v9 (flat config) with `eslint-config-next`
- **Package manager:** pnpm

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm dlx shadcn@latest add <component>` | Add a shadcn/ui component |

## Project structure

```
├── app/               # App Router pages & layouts
├── components/        # React components
│   └── ui/            # shadcn/ui primitives
├── lib/
│   └── utils.ts       # cn() utility (clsx + tailwind-merge)
├── public/            # Static assets
├── components.json    # shadcn/ui config
└── postcss.config.mjs # PostCSS with @tailwindcss/postcss plugin
```

## Conventions

- **Components:** Default-exported function components, no `React.FC`
- **Props:** `Readonly<{ ... }>` inline types
- **Imports:** Use `import type` for type-only imports
- **Path alias:** `@/*` maps to project root (e.g. `@/components/ui/button`)
- **Metadata:** Export `const metadata: Metadata`
- **Styling:** Tailwind utility classes via `cn()` from `@/lib/utils`
- **JSX transform:** No `import React` needed (React 19)
- **shadcn:** Components under `@/components/ui`, use `cn()` for className merging

## Commit messages

Use conventional commits:
```
<type>: <short description>

<optional body>
```

Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`.
Scope is optional. Body explains what and why, not how.
One commit per logical change. No `--no-verify` or `--force` pushes.
