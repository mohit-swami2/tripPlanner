# Vercel Debug Logs Guide

## Where to view logs

1. Open [Vercel Dashboard](https://vercel.com) → your project.
2. **Deployments** → select the deployment → **Functions** tab.
3. Click the function (e.g. `server.js`) → **Logs** (runtime / function logs).
4. Or: **Logs** in the project sidebar (aggregated, filter by deployment).

All `console.log` / `console.error` output appears here in near real time.

## Log prefixes

| Prefix | Meaning |
|--------|---------|
| `[STARTUP]` | Boot, env, server listen |
| `[DB]` | MongoDB URI checks, connect, state, queries |
| `[API]` | HTTP requests (method, route, duration) |
| `[AUTH]` | JWT + Admin/`users` collection lookups |
| `[ERROR]` | Failures with stack traces |

## What to look for (connection failures)

1. **`[DB] MONGO_URI exists`** — must be `{ "present": true }` on Vercel (set in Project → Settings → Environment Variables).
2. **`[DB] MONGO_URI warning: double slash`** — fix URI like `mongodb.net//tripplanner` → `mongodb.net/tripplanner`.
3. **`[DB] mongoose.connect — failure`** — full stack here; common causes: IP not allowlisted in Atlas, wrong password, wrong DB name.
4. **`[DB] warning: request received but mongoose is not connected`** — connect did not run before the request (see note below).

## Vercel + Express note

`server.js` only calls `connectDatabase()` when started via `node server.js` (`require.main === module`).  
On Vercel, the serverless entry often **imports** the app without running `start()`, so you may see:

`[STARTUP] server.js loaded as module`  
and  
`[DB] warning: request received but mongoose is not connected`

If that appears, ensure MongoDB connects on cold start (e.g. call `connectDatabase()` before exporting the handler). That is a deployment wiring issue, not logging.

## Sensitive data

Passwords and tokens are **never** logged. Request bodies are redacted in `[ERROR]` logs.
