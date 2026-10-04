# SuperFlats-FE-Web

Website for Superflats, built on the existing [superflats-backend](https://github.com/mkhan777717/superflats-backend) API. The backend is used as-is; this repo contains only the frontend.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19) with TypeScript
- **Tailwind CSS 4** for styling, using the Lovable design (teal theme, Outfit font)
- **lucide-react** icons

## Getting started

```bash
npm install
cp .env.example .env.local   # point SUPERFLATS_API_URL at a local or production backend
npm run dev                  # http://localhost:3000
```

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
