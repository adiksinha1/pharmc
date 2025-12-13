# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

# Pharmac — Local development

This repository contains the Pharmac frontend (Vite + React + Tailwind) and a small mock auth server used for local development.

Important files
- `src/hooks/useAuth.tsx` — client auth provider (calls mock API, falls back to localStorage)
- `src/pages/Login.tsx`, `src/pages/Signup.tsx` — auth pages with toasts and redirect
- `src/components/RequireAuth.tsx` — protects dashboard routes
- `server/index.cjs` — mock auth server (bcrypt password hashing)

Quick start (Windows)

1. Install Node.js (LTS)
	 - Official installer: https://nodejs.org/en/download/
	 - Or use `winget install OpenJS.NodeJS.LTS` or `nvm-windows` if you manage versions.

2. If PowerShell blocks `npm` due to execution policy, either use `cmd.exe` or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

3. From the project root install dependencies:
```powershell
cd "C:\Users\ADITYA\Downloads\dream-weaver-main (1)\Pharmac"
npm install
```

4. Start the mock auth server (separate terminal):
```powershell
npm run start:server
# This runs: node server/index.cjs
```

5. Start Vite dev server (separate terminal):
```powershell
npm run dev
```

Open the Local URL printed by Vite (e.g. `http://localhost:8080/`).

API endpoints (mock server)
- `POST /api/signup` — body: `{ name, email, password }` — returns `{ user }` on success and persists hashed password to `server/users.json`.
- `POST /api/login` — body: `{ email, password }` — returns `{ user }` on success.

Notes & troubleshooting
- If `npm` is not recognized in PowerShell, try running it via the npm shim:
	```powershell
	& 'C:\Program Files\nodejs\npm.cmd' install
	```
- If port `4000` is in use, either stop the other process or change the server `PORT` env var before starting.
- The mock server stores passwords with `bcryptjs` for local safety — still not production-grade.

Security
- This mock server is only for local development. For production, use a real backend, a database, hashed passwords, HTTPS, and secure session handling.

Next steps I can do for you
- Add a `start` script to run the server and client concurrently.
- Replace JSON storage with Sqlite for slightly more realistic persistence.
- Add automated tests for the auth flow.

Implemented extras
- `server/index.cjs` now uses SQLite (via `server/db.cjs` + `better-sqlite3`) instead of `server/users.json`.
- `package.json` includes `start:all` script which runs server and client concurrently using `concurrently`.
- A basic Playwright E2E test scaffold was added at `tests/e2e/auth.spec.ts` (requires Playwright install).

Run everything (after `npm install`)
```powershell
# install deps (includes better-sqlite3 & concurrently)
npm install

# start server and client together
npm run start:all

# run E2E tests (install playwright first)
npm i -D @playwright/test
npx playwright install
npm run test:e2e
```

Note: Playwright is optional; install it only if you want to run E2E tests locally.

If you want any of those, tell me which one and I'll implement it.
