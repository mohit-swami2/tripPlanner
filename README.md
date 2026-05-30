# TripPlanner Backend

Module-first Node.js + Express 5 + MongoDB API for the Jaipur Tourism Portal.

## Stack

- Express 5, Mongoose, Zod, JWT, bcrypt, nodemailer, multer, helmet, cors, express-rate-limit, morgan

## Project structure

```text
src/
  app.js, server.js
  shared/          → utils, middleware, validators
  modules/         → one folder per domain (admin, inquiry, trip, …)
  routes/          → admin + website composers
scripts/           → seeds
public/            → static assets
```

**Flow:** Route → Middleware → Controller → Service → Model

**Response shape:**

```json
{ "success": true, "message": "...", "data": [], "page": 1, "total": 0, "limit": 10, "totalPages": 0 }
```

## Setup

```bash
npm install
cp .env.example .env
# Edit MONGO_URI, JWT_SECRET, SMTP_*, ADMIN_EMAIL
npm run seed:admin
npm run dev
```

**Important (macOS MongoDB):** Use the exact database name casing in `MONGO_URI`, e.g. `mongodb://localhost:27017/tripPlanner` (not `tripplanner`). Wrong casing connects to an empty DB and login will fail.

**Admin login URLs (all supported):**

- `POST /api/admin/auth/login`
- `POST /api/v1/admin/auth/login` (legacy)
- `POST /admin/auth/login`

Default admin (after seed): `mohit@mailinator.com` / `123123123`

## API surfaces

| Surface | Base paths |
|---------|------------|
| Admin (JWT) | `/api/admin`, `/admin` |
| Website (public) | `/api/website`, `/api/v1/website` |
| Health | `GET /health` |

### Admin routes (Bearer JWT)

| Method | Path | Module |
|--------|------|--------|
| POST | `/auth/login` | admin |
| POST | `/auth/forgotPassword` | admin |
| POST | `/auth/resetPassword/:token` | admin |
| GET/PATCH | `/auth/profile` | admin |
| GET | `/dashboard` | dashboard |
| GET/PATCH/DELETE | `/inquiries`, `/inquiries/:id`, `/inquiries/:id/status` | inquiry (`PENDING` / `DONE`) |
| CRUD | `/vendors` | vendor |
| CRUD | `/trips`, `/trips/:id/enable` | trip (`isEnabled` for website) |
| POST/GET | `/itineraries`, `/itineraries/trip/:tripId` | itinerary |
| GET/POST | `/payments`, `/payments/trip/:tripId` | payment |
| GET | `/invoices/:tripId` | invoice |
| CRUD | `/packages` | package |
| PUT/GET | `/cms` | content |
| CRUD | `/cms/testimonials`, `/cms/faqs`, `/cms/email-templates` | cms |
| GET/DELETE | `/contacts` | contactUs |

### Website routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/packages`, `/packages/:id` | Active packages |
| GET | `/trips`, `/trips/:id` | Enabled trips only (`isEnabled: true`) |
| POST | `/inquiries` | Plan My Trip form |
| POST | `/contact` | Contact form |
| GET | `/testimonials` | Published testimonials |
| POST | `/testimonials` | Submit review |
| GET | `/faqs` | FAQ list |
| GET | `/cms/:section` | Dynamic CMS section |

## Patterns

- **Soft delete:** `isDeleted: true` on all business models
- **Auto codes:** `INQ-*`, `VEN-*`, `TRP-*`, `PKG-*`, `PAY-*`, `INV-*`
- **Pagination:** `$match` → `$sort` → `$facet` (data + count)
- **Filters:** `buildQueryFilter(query, model)` from query params

## Postman

Import `postman_collection.json`. Run **Admin Login** first; the test script stores the JWT for protected routes.

## Deployment

Vercel uses root `server.js` → `src/server.js`. Ensure `MONGO_URI` and env vars are set in the Vercel project.

## Google Sheet API status

| Sheet endpoint | Implemented route |
|----------------|-------------------|
| GET `/admin/dashboard` | `GET /admin/dashboard` |
| GET `/admin/inquiries` | `GET /admin/inquiries` |
| PATCH `/admin/inquiries/:id` | `PATCH /admin/inquiries/:id` |
| POST `/admin/vendors` | `POST /admin/vendors` |
| POST `/admin/trips` | `POST /admin/trips` |
| POST `/admin/itineraries` | `POST /admin/itineraries` |
| POST `/admin/payments` | `POST /admin/payments` |
| GET `/admin/invoices/:tripId` | `GET /admin/invoices/:tripId` |
| POST `/admin/packages` | `POST /admin/packages` |
| PUT `/admin/cms` | `PUT /admin/cms` |
| GET `/api/v1/website/packages` | `GET /api/v1/website/packages` |
| GET `/api/v1/website/packages/:id` | `GET /api/v1/website/packages/:id` |
| POST `/api/v1/website/inquiries` | `POST /api/v1/website/inquiries` |
| POST `/api/v1/website/contact` | `POST /api/v1/website/contact` |
| GET `/api/v1/website/testimonials` | `GET /api/v1/website/testimonials` |
| POST `/api/v1/website/testimonials` | `POST /api/v1/website/testimonials` |
| GET `/api/v1/website/faqs` | `GET /api/v1/website/faqs` |
| GET `/api/v1/website/cms/:section` | `GET /api/v1/website/cms/:section` |

Mark column **Status** as `Done` for rows 2–20 in your sheet.
