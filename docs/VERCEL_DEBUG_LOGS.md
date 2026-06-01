# Vercel MongoDB Connection — Architecture & Logs

## How connection works now

1. Vercel imports `server.js` → loads `src/app.js`.
2. Every API request passes **`ensureDbConnection`** middleware (except `/health`, `/public`).
3. Middleware calls **`connectDatabase()`**:
   - **readyState === 1** → reuses cached connection (`[DB] reusing cached MongoDB connection`).
   - **connect in flight** → awaits same promise (concurrent-safe).
   - **disconnected** → `mongoose.connect()` once, then reuse.

Local `node server.js` still works: middleware + optional eager connect before `listen()`.

## Debug endpoint

`GET /api/debug/db` — should show `"connected": true` after first successful connect.

## Log prefixes

`[STARTUP]` `[DB]` `[API]` `[AUTH]` `[QUERY]` `[WARNING]` `[ERROR]`

## Where to view logs

Vercel Dashboard → Project → Deployments → Functions → `server.js` → **Logs**
