# SuperFlats-FE-Web

Website for Superflats, built on the existing [superflats-backend](https://github.com/mkhan777717/superflats-backend) API. The backend is used as-is; this repo contains only the frontend.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19) with TypeScript
- **Tailwind CSS 4** for styling, using the Lovable design (teal theme, Outfit font)
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev   # http://localhost:3000
```

Optional settings go in a local `.env.local` file. Env files are git-ignored and must never be committed. Ask the team for the values.

| Variable                    | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `SUPERFLATS_API_URL`        | Backend base URL including `/api` (defaults to production)       |
| `NEXT_PUBLIC_SITE_URL`      | Public URL of the website, used for metadata                     |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Address shown on the forgot-password screen                      |

| Script          | What it does                    |
| --------------- | ------------------------------- |
| `npm run dev`   | Development server              |
| `npm run build` | Production build (type-checks)  |
| `npm run start` | Serve the production build      |
| `npm run lint`  | ESLint                          |

## How it talks to the backend

- Login and registration run as **Server Actions**. The access and refresh tokens returned by the backend are stored in **httpOnly cookies**, so browser JavaScript never sees them.
- Pages are **Server Components** that call the backend with the user's token (`src/lib/api.ts`).
- Browser-side actions (favourite, book a visit, cancel, profile photo upload) go through the route handler `src/app/api/sf/[...path]/route.ts`. It adds the token and forwards the request to the backend.
- `src/proxy.ts` (Next 16's replacement for middleware) redirects signed-out visitors away from protected pages.

## Branching

| Branch       | Purpose                                                          |
| ------------ | ---------------------------------------------------------------- |
| `main`       | Production-ready code                                            |
| `develop`    | Integration branch; feature branches merge here                  |
| `feature/*`  | One branch per feature, for example `feature/auth`               |

Feature branches are created from `develop` and merged back with `--no-ff`, so each feature remains visible in history.
