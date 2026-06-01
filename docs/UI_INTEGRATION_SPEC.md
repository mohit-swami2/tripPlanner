# TripPlanner Backend — UI Integration Specification

> Generated from codebase analysis. Canonical base paths: **Admin** `/api/admin`, **Website** `/api/v1/website` (aliases listed in [Global Conventions](#global-conventions)).

---

## Table of Contents

1. [Health](#module-health)
2. [Admin Auth](#module-admin-auth)
3. [Dashboard](#module-dashboard)
4. [Inquiries](#module-inquiries)
5. [Vendors](#module-vendors)
6. [Trips](#module-trips)
7. [Itineraries](#module-itineraries)
8. [Payments](#module-payments)
9. [Invoices](#module-invoices)
10. [Packages](#module-packages)
11. [Contacts](#module-contacts)
12. [CMS — Content](#module-cms--content)
13. [CMS — Testimonials](#module-cms--testimonials)
14. [CMS — FAQs](#module-cms--faqs)
15. [CMS — Email Templates](#module-cms--email-templates)
16. [Website — Public APIs](#module-website--public)
17. [Global Conventions](#global-conventions)

---

## Module: Health

---
### [HEALTH] – Health Check
**Method:** GET  
**URL:** `/health`  
**Auth:** No  

**Headers:** None required  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running OK",
  "data": [{ "status": "healthy" }]
}
```

**Error Response:** Standard (404 if wrong path)

---

## Module: Admin Auth

Base path: `/api/admin/auth` (also `/admin/auth`, `/api/v1/admin/auth`)

---
### [AUTH] – Login
**Method:** POST  
**URL:** `/api/admin/auth/login`  
**Auth:** No  

**Headers:**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| Content-Type | string | Yes | `application/json` |

**Request Body:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| email | string | Yes | Valid email |
| password | string | Yes | Min 6 characters |

```json
{
  "email": "admin@example.com",
  "password": "123123123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": [
    {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "admin": {
        "id": "6a059fe6da4e8bcc6eaea69b",
        "name": "Super Admin",
        "email": "admin@example.com"
      }
    }
  ]
}
```
Also sets HttpOnly cookie `jwt` (optional for browser clients).

**Error Response (401):**
```json
{ "success": false, "message": "Incorrect email or password", "data": [] }
```

---
### [AUTH] – Forgot Password
**Method:** POST  
**URL:** `/api/admin/auth/forgotPassword`  
**Auth:** No  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| email | string | Yes (email) |

```json
{ "email": "admin@example.com" }
```

**Success Response (200):**
```json
{ "success": true, "message": "Reset link sent to email", "data": [] }
```

---
### [AUTH] – Reset Password
**Method:** POST  
**URL:** `/api/admin/auth/resetPassword/:token`  
**Auth:** No  

**Path Params:**
| Param | Type | Description |
|-------|------|-------------|
| token | string | Plain reset token from email link |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| password | string | Yes (min 6) |

```json
{ "password": "newSecurePassword123" }
```

**Success Response (200):** Same shape as Login (token + admin).

**Error Response (400):**
```json
{ "success": false, "message": "Token is invalid or has expired", "data": [] }
```

---
### [AUTH] – Get Profile
**Method:** GET  
**URL:** `/api/admin/auth/profile`  
**Auth:** Yes — Bearer JWT  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched",
  "data": [
    {
      "_id": "6a059fe6da4e8bcc6eaea69b",
      "name": "Super Admin",
      "email": "admin@example.com",
      "profileImage": null,
      "lastActive": "2026-05-30T06:00:00.000Z",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-05-30T06:00:00.000Z"
    }
  ]
}
```

---
### [AUTH] – Update Profile
**Method:** PATCH  
**URL:** `/api/admin/auth/profile`  
**Auth:** Yes — Bearer JWT  

**Request Body:** (all optional)
| Field | Type | Rules |
|-------|------|-------|
| name | string | min 2 |
| profileImage | string | URL or path |

```json
{ "name": "Super Admin", "profileImage": "uploads/profile.jpg" }
```

**Success Response (200):** Updated admin object in `data[0]`.

---
### [AUTH] – Change Password
**Method:** PATCH  
**URL:** `/api/admin/auth/change-password`  
**Auth:** Yes — Bearer JWT  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| currentPassword | string | Yes (min 6) |
| newPassword | string | Yes (min 6) |

```json
{
  "currentPassword": "123123123",
  "newPassword": "newPassword456"
}
```

**Success Response (200):**
```json
{ "success": true, "message": "Password changed successfully", "data": [] }
```

---

## Module: Dashboard

Base: `/api/admin/dashboard` — **All routes require Auth**

---
### [DASHBOARD] – Overview Stats
**Method:** GET  
**URL:** `/api/admin/dashboard`  
**Auth:** Yes — Bearer JWT  

**Query Params:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| from | string (ISO date) | No | — | Filter stats from date |
| to | string (ISO date) | No | — | Filter stats to date |

**Pagination:** No  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Dashboard stats",
  "data": [
    {
      "stats": {
        "inquiries": 45,
        "bookings": 12,
        "activePackages": 8,
        "contacts": 5
      },
      "revenue": 50000,
      "inquiryByStatus": [
        { "_id": "PENDING", "count": 30 },
        { "_id": "DONE", "count": 15 }
      ]
    }
  ]
}
```

---

## Module: Inquiries

**Admin base:** `/api/admin/inquiries` (Auth required)  
**Website base:** `/api/v1/website/inquiries` (Public POST, rate-limited)

### Filter options (admin list)
| Param | Type | Match | Allowed values |
|-------|------|-------|----------------|
| status | string | exact (enum) | `PENDING`, `DONE` |
| customerName | string | partial (regex) | any |
| contact | string | partial | any |
| destinationInterest | string | partial | any |
| code | string | partial | e.g. `INQ-00001` |

### Pagination & sort (admin list)
See [Global Conventions](#global-conventions). Default `sortBy=createdAt`, `sortOrder=desc`.

---
### [INQUIRIES] – List (Admin)
**Method:** GET  
**URL:** `/api/admin/inquiries`  
**Auth:** Yes  

**Query Params:** Pagination + filters above.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Inquiries fetched",
  "data": [
    {
      "_id": "674a1b2c3d4e5f6789012345",
      "code": "INQ-00001",
      "customerName": "Jane Doe",
      "contact": "jane@mail.com",
      "destinationInterest": "Jaipur",
      "travelDates": "2026-12-01T00:00:00.000Z",
      "status": "PENDING",
      "notes": "",
      "createdAt": "2026-05-30T10:00:00.000Z",
      "updatedAt": "2026-05-30T10:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "sort": "createdAt",
  "sortOrder": "desc",
  "total": 42,
  "totalPages": 5
}
```

---
### [INQUIRIES] – Get By ID (Admin)
**Method:** GET  
**URL:** `/api/admin/inquiries/:id`  
**Auth:** Yes  

**Path Params:** `id` — MongoDB ObjectId (24 hex chars)

**Success Response (200):** Single inquiry in `data[0]`.

**Error (404):** `{ "success": false, "message": "Inquiry not found", "data": [] }`

---
### [INQUIRIES] – Update Status (Admin)
**Method:** PATCH  
**URL:** `/api/admin/inquiries/:id/status`  
**Auth:** Yes  

**Request Body:**
| Field | Type | Required | Values |
|-------|------|----------|--------|
| status | string | Yes | `PENDING`, `DONE` |

```json
{ "status": "DONE" }
```

**Success Response (200):** Updated inquiry in `data[0]`.

---
### [INQUIRIES] – Update (Admin)
**Method:** PATCH  
**URL:** `/api/admin/inquiries/:id`  
**Auth:** Yes  

**Request Body:** (optional fields)
| Field | Type | Values |
|-------|------|--------|
| status | string | `PENDING`, `DONE` |
| notes | string | — |

```json
{ "notes": "Called customer, awaiting reply" }
```

---
### [INQUIRIES] – Soft Delete (Admin)
**Method:** DELETE  
**URL:** `/api/admin/inquiries/:id`  
**Auth:** Yes  

**Success Response (200):**
```json
{ "success": true, "message": "Inquiry deleted", "data": [] }
```

---
### [INQUIRIES] – Submit (Website)
**Method:** POST  
**URL:** `/api/v1/website/inquiries`  
**Auth:** No (rate-limited: ~30/hour per IP)  

**Request Body:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| customerName | string | Yes | min 2 |
| contact | string | Yes | min 3 |
| destinationInterest | string | Yes | min 2 |
| travelDates | string/date | Yes | ISO date coerced |

```json
{
  "customerName": "Jane Doe",
  "contact": "jane@mail.com",
  "destinationInterest": "Jaipur",
  "travelDates": "2026-12-01"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Inquiry submitted",
  "data": [
    {
      "inquiryId": "INQ-00002",
      "inquiry": { "...": "full inquiry document, status PENDING" }
    }
  ]
}
```

---

## Module: Vendors

**Base:** `/api/admin/vendors` — Auth required

### Filter options
| Param | Type | Match | Allowed values |
|-------|------|-------|----------------|
| type | string | exact | `Hotel`, `Vehicle`, `Restaurant`, `Guide`, `Other` |
| name | string | partial | any |
| pricing | number | exact | number |
| code | string | partial | `VEN-*` |

---
### [VENDORS] – List
**Method:** GET  
**URL:** `/api/admin/vendors`  

**Example:** `GET /api/admin/vendors?type=Hotel&page=1&limit=10`

**Success Response (200):** Paginated `data[]` of vendor objects.

**Vendor object fields:**
| Field | Type |
|-------|------|
| _id | string (ObjectId) |
| code | string |
| name | string |
| type | enum |
| pricing | number |
| contactInfo | string? |
| description | string? |
| createdAt, updatedAt | ISO date |

---
### [VENDORS] – Get By ID
**Method:** GET  
**URL:** `/api/admin/vendors/:id`  

---
### [VENDORS] – Create
**Method:** POST  
**URL:** `/api/admin/vendors`  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | Yes (min 2) |
| type | string | Yes (enum) |
| pricing | number | No (≥ 0) |
| contactInfo | string | No |
| description | string | No |

```json
{
  "name": "Hotel X",
  "type": "Hotel",
  "pricing": 2500,
  "contactInfo": "+91 9999999999",
  "description": "4-star partner hotel"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Vendor created",
  "data": [{ "vendorId": "VEN-00001", "vendor": { } }]
}
```

---
### [VENDORS] – Update
**Method:** PATCH  
**URL:** `/api/admin/vendors/:id`  

**Request Body:** Partial of create fields.

---
### [VENDORS] – Soft Delete
**Method:** DELETE  
**URL:** `/api/admin/vendors/:id`  

---

## Module: Trips

**Admin:** `/api/admin/trips` (Auth)  
**Website:** `/api/v1/website/trips` (public, **enabled trips only**)

### Admin filter options
| Param | Type | Match | Allowed values |
|-------|------|-------|----------------|
| status | string | exact | `Draft`, `Confirmed`, `In Progress`, `Completed`, `Cancelled` |
| isEnabled | boolean | exact | `true`, `false` |
| customerName | string | partial | any |
| code | string | partial | `TRP-*` |
| inquiryId | ObjectId | exact | 24-char hex |

### Website list
Automatically adds `isEnabled=true`. No auth.

---
### [TRIPS] – List (Admin)
**Method:** GET  
**URL:** `/api/admin/trips`  

**Success Response (200):** Paginated; items may include populated `inquiry` sub-document from aggregation.

---
### [TRIPS] – List (Website — enabled only)
**Method:** GET  
**URL:** `/api/v1/website/trips`  

**Query Params:** Pagination + schema filters (only enabled trips returned).

---
### [TRIPS] – Get By ID (Admin)
**Method:** GET  
**URL:** `/api/admin/trips/:id`  

---
### [TRIPS] – Get By ID (Website)
**Method:** GET  
**URL:** `/api/v1/website/trips/:id`  

Returns 404 if trip not enabled.

---
### [TRIPS] – Create (Admin)
**Method:** POST  
**URL:** `/api/admin/trips`  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| customerName | string | Yes |
| totalCost | number | Yes (≥ 0) |
| inquiryId | string (ObjectId) | No |
| customerId | string | No (alias → inquiryId) |
| customerContact | string | No |
| status | enum | No (default `Draft`) |
| isEnabled | boolean | No (default `false`) |
| title | string | No |
| description | string | No |
| images | string[] | No |

```json
{
  "customerName": "John Doe",
  "customerContact": "john@mail.com",
  "totalCost": 15000,
  "title": "Jaipur Heritage Tour",
  "description": "3-day curated experience",
  "isEnabled": false,
  "status": "Draft"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Trip created",
  "data": [{ "tripId": "TRP-00001", "trip": { } }]
}
```

**Trip object (computed):** `pendingDues = totalCost - paidAmount`

---
### [TRIPS] – Update (Admin)
**Method:** PATCH  
**URL:** `/api/admin/trips/:id`  

**Request Body:** Partial of create fields.

---
### [TRIPS] – Enable / Disable for Website (Admin)
**Method:** PATCH  
**URL:** `/api/admin/trips/:id/enable`  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| isEnabled | boolean | Yes |

```json
{ "isEnabled": true }
```

**Success Response (200):** Message varies: `Trip enabled for website` / `Trip disabled`.

---
### [TRIPS] – Soft Delete (Admin)
**Method:** DELETE  
**URL:** `/api/admin/trips/:id`  

Sets `isDeleted=true` and `isEnabled=false`.

---

## Module: Itineraries

**Base:** `/api/admin/itineraries` — Auth required

---
### [ITINERARIES] – Create or Upsert by Trip
**Method:** POST  
**URL:** `/api/admin/itineraries`  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| tripId | string (ObjectId) | Yes |
| days | array | Yes (min 1 item) |

**Day item:**
| Field | Type | Required |
|-------|------|----------|
| day | number | Yes (positive int) |
| activity | string | Yes |
| timing | string | No |
| location | string | No |

```json
{
  "tripId": "674a1b2c3d4e5f6789012345",
  "days": [
    { "day": 1, "activity": "Amber Fort", "timing": "9:00 AM", "location": "Jaipur" },
    { "day": 2, "activity": "City Palace", "timing": "10:00 AM", "location": "Jaipur" }
  ]
}
```

**Success Response (201):** Itinerary document in `data[0]`. Updates existing itinerary for same `tripId` if present.

---
### [ITINERARIES] – Get By Trip ID
**Method:** GET  
**URL:** `/api/admin/itineraries/trip/:tripId`  

**Path Params:** `tripId` — ObjectId  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Itinerary fetched",
  "data": [
    {
      "_id": "...",
      "tripId": "...",
      "days": [ { "day": 1, "activity": "...", "timing": "...", "location": "..." } ],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## Module: Payments

**Base:** `/api/admin/payments` — Auth required

### Filter options
| Param | Type | Allowed |
|-------|------|---------|
| tripId | ObjectId | exact |
| type | string | `Token`, `Full`, `Partial` |
| code | string | partial `PAY-*` |
| amount | number | exact |

---
### [PAYMENTS] – List
**Method:** GET  
**URL:** `/api/admin/payments`  

**Success Response (200):** Paginated payment records.

---
### [PAYMENTS] – List By Trip
**Method:** GET  
**URL:** `/api/admin/payments/trip/:tripId`  

**Success Response (200):** Array of payments in `data` (not paginated).

---
### [PAYMENTS] – Record Payment
**Method:** POST  
**URL:** `/api/admin/payments`  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| tripId | string (ObjectId) | Yes |
| amount | number | Yes (> 0) |
| type | string | Yes — `Token`, `Full`, `Partial` |
| notes | string | No |

```json
{
  "tripId": "674a1b2c3d4e5f6789012345",
  "amount": 5000,
  "type": "Token",
  "notes": "Advance payment"
}
```

**Success Response (201):** Updates trip `paidAmount` and `pendingDues` automatically.

```json
{
  "success": true,
  "message": "Payment recorded",
  "data": [{ "paymentId": "PAY-00001", "payment": { } }]
}
```

---

## Module: Invoices

**Base:** `/api/admin/invoices` — Auth required

---
### [INVOICES] – Generate / Get By Trip
**Method:** GET  
**URL:** `/api/admin/invoices/:tripId`  

**Path Params:** `tripId` — Trip ObjectId  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Invoice generated",
  "data": [
    {
      "pdfUrl": "http://localhost:8083/public/invoices/TRP-00001.pdf",
      "invoiceNo": "INV-00001",
      "invoice": {
        "_id": "...",
        "code": "INV-00001",
        "tripId": "...",
        "lineItems": [
          { "description": "Trip Total", "amount": 15000 },
          { "description": "Token Payment (PAY-00001)", "amount": 5000 }
        ],
        "totalAmount": 15000,
        "paidAmount": 5000,
        "pendingDues": 10000
      }
    }
  ]
}
```

> **UI note:** `pdfUrl` is a placeholder path; PDF file may not exist until a PDF service is integrated.

---

## Module: Packages

**Admin:** `/api/admin/packages`  
**Website:** `/api/v1/website/packages` (**status = active only**)

### Admin filter options
| Param | Type | Allowed |
|-------|------|---------|
| status | string | `active`, `inactive`, `draft` |
| title | string | partial |
| price | number | exact |
| code | string | partial `PKG-*` |

### Website
Only `active` packages returned regardless of query `status`.

---
### [PACKAGES] – List (Admin)
**Method:** GET  
**URL:** `/api/admin/packages`  

---
### [PACKAGES] – List (Website)
**Method:** GET  
**URL:** `/api/v1/website/packages`  

---
### [PACKAGES] – Get By ID (Admin / Website)
**Method:** GET  
**URL:** `/api/admin/packages/:id` or `/api/v1/website/packages/:id`  

---
### [PACKAGES] – Create (Admin)
**Method:** POST  
**URL:** `/api/admin/packages`  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| title | string | Yes (min 2) |
| price | number | Yes (≥ 0) |
| duration | string | Yes (min 2) |
| description | string | No |
| images | string[] | No |
| itinerary | array | No |
| status | string | No — default `active` |

**Itinerary day item:** `day?`, `title?`, `activity?`, `location?` (numbers/strings)

```json
{
  "title": "Jaipur Explorer",
  "price": 9999,
  "duration": "3D/2N",
  "status": "active",
  "description": "Popular heritage package",
  "images": ["https://cdn.example.com/jaipur.jpg"],
  "itinerary": [
    { "day": 1, "title": "Arrival", "activity": "City tour", "location": "Jaipur" }
  ]
}
```

---
### [PACKAGES] – Update (Admin)
**Method:** PATCH  
**URL:** `/api/admin/packages/:id`  

Use `{ "status": "inactive" }` to hide from website.

---
### [PACKAGES] – Soft Delete (Admin)
**Method:** DELETE  
**URL:** `/api/admin/packages/:id`  

---

## Module: Contacts

**Admin:** `/api/admin/contacts`  
**Website:** `/api/v1/website/contact` (POST)

### Admin filters
| Param | Type | Match |
|-------|------|-------|
| name, email, message | string | partial |
| code | string | partial `CNT-*` |

---
### [CONTACTS] – List (Admin)
**Method:** GET  
**URL:** `/api/admin/contacts`  

---
### [CONTACTS] – Soft Delete (Admin)
**Method:** DELETE  
**URL:** `/api/admin/contacts/:id`  

---
### [CONTACTS] – Submit (Website)
**Method:** POST  
**URL:** `/api/v1/website/contact` (alias: same handler on `/contact` mount)  
**Auth:** No (rate-limited)  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | Yes (min 2) |
| email | string | Yes (email) |
| message | string | Yes (min 5) |

```json
{
  "name": "Bob",
  "email": "bob@mail.com",
  "message": "I would like more information about packages."
}
```

**Success Response (201):**
```json
{ "success": true, "message": "Message sent successfully", "data": [] }
```

---

## Module: CMS — Content

**Admin base:** `/api/admin/cms`  
**Website:** `/api/v1/website/cms/:section`

**Allowed sections:** `FAQ`, `About Us`, `Hero Section`, `Terms`, `Privacy`

---
### [CMS] – List All Sections (Admin)
**Method:** GET  
**URL:** `/api/admin/cms`  

**Success Response (200):** `data[]` = array of `{ section, data, createdAt, updatedAt }` (not paginated).

---
### [CMS] – Save Section (Admin)
**Method:** PUT  
**URL:** `/api/admin/cms`  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| section | string | Yes (enum above) |
| data | any (JSON) | Yes |

```json
{
  "section": "Hero Section",
  "data": {
    "headline": "Plan Your Jaipur Trip",
    "subheadline": "Custom itineraries & packages",
    "ctaText": "Plan My Trip"
  }
}
```

---
### [CMS] – Get Section (Website)
**Method:** GET  
**URL:** `/api/v1/website/cms/:section`  

**Path Params:** `section` — URL-encode spaces (e.g. `Hero%20Section`)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Content fetched",
  "data": [
    {
      "section": "Hero Section",
      "content": { "headline": "Plan Your Jaipur Trip" }
    }
  ]
}
```

---

## Module: CMS — Testimonials

**Admin:** `/api/admin/cms/testimonials`  
**Website:** `/api/v1/website/testimonials`

### Admin filters
| Param | Type | Match |
|-------|------|-------|
| name, email, description | string | partial |
| rating | number | exact (1–5) |
| isEnabled | boolean | exact |

### Website list
Only `isEnabled=true`.

---
### [TESTIMONIALS] – List (Admin)
**Method:** GET  
**URL:** `/api/admin/cms/testimonials`  

---
### [TESTIMONIALS] – List (Website)
**Method:** GET  
**URL:** `/api/v1/website/testimonials`  

---
### [TESTIMONIALS] – Submit (Website)
**Method:** POST  
**URL:** `/api/v1/website/testimonials`  
**Auth:** No (rate-limited)  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| email | string | Yes |
| rating | number | Yes (1–5 int) |
| description | string | Yes (min 5) |
| image | string | No |

```json
{
  "name": "Alice",
  "email": "alice@mail.com",
  "rating": 5,
  "description": "Amazing trip to Jaipur!"
}
```

Creates with `isEnabled: false` (requires admin approval).

---
### [TESTIMONIALS] – Update / Approve (Admin)
**Method:** PATCH  
**URL:** `/api/admin/cms/testimonials/:id`  

```json
{ "isEnabled": true }
```

---
### [TESTIMONIALS] – Soft Delete (Admin)
**Method:** DELETE  
**URL:** `/api/admin/cms/testimonials/:id`  

---

## Module: CMS — FAQs

**Admin:** `/api/admin/cms/faqs`  
**Website:** `/api/v1/website/faqs`

### Admin filters
| Param | Type | Match |
|-------|------|-------|
| question, answer | string | partial |
| order | number | exact |
| isEnabled | boolean | exact |

### Website
Only `isEnabled=true`. Default sort favors `order` ascending.

---
### [FAQS] – List (Admin / Website)
**Method:** GET  
**URL:** `/api/admin/cms/faqs` or `/api/v1/website/faqs`  

---
### [FAQS] – Create (Admin)
**Method:** POST  
**URL:** `/api/admin/cms/faqs`  

```json
{
  "question": "Best time to visit Jaipur?",
  "answer": "October to March is ideal.",
  "order": 1,
  "isEnabled": true
}
```

---
### [FAQS] – Update (Admin)
**Method:** PATCH  
**URL:** `/api/admin/cms/faqs/:id`  

---
### [FAQS] – Soft Delete (Admin)
**Method:** DELETE  
**URL:** `/api/admin/cms/faqs/:id`  

---

## Module: CMS — Email Templates

**Base:** `/api/admin/cms/email-templates` — Auth required

### Filters
| Param | Type | Match |
|-------|------|-------|
| name, slug, subject | string | partial |
| isEnabled | boolean | exact |

---
### [EMAIL TEMPLATES] – List
**Method:** GET  
**URL:** `/api/admin/cms/email-templates`  

---
### [EMAIL TEMPLATES] – Create
**Method:** POST  

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| slug | string | Yes (unique) |
| subject | string | Yes |
| description | string | Yes (HTML, supports `{{placeholders}}`) |
| isEnabled | boolean | No |

```json
{
  "name": "New Enquiry",
  "slug": "enquiry-email",
  "subject": "New Trip Inquiry",
  "description": "<p>Hello {{customerName}}</p>",
  "isEnabled": true
}
```

---
### [EMAIL TEMPLATES] – Update
**Method:** PATCH  
**URL:** `/api/admin/cms/email-templates/:id`  

**Note:** `slug` cannot be changed on update.

---
### [EMAIL TEMPLATES] – Soft Delete
**Method:** DELETE  
**URL:** `/api/admin/cms/email-templates/:id`  

---

## Module: Website — Public

Summary of public endpoints (no JWT):

| Method | URL | Purpose |
|--------|-----|---------|
| POST | `/api/v1/website/inquiries` | Plan My Trip form |
| GET | `/api/v1/website/packages` | Active packages |
| GET | `/api/v1/website/packages/:id` | Package detail |
| GET | `/api/v1/website/trips` | Enabled trips |
| GET | `/api/v1/website/trips/:id` | Enabled trip detail |
| POST | `/api/v1/website/contact` | Contact form |
| GET | `/api/v1/website/testimonials` | Approved testimonials |
| POST | `/api/v1/website/testimonials` | Submit review |
| GET | `/api/v1/website/faqs` | Enabled FAQs |
| GET | `/api/v1/website/cms/:section` | CMS section content |

All website POST routes use **rate limiting** (~30 requests/hour/IP unless env overrides).

---

## Global Conventions

### Base URL

| Environment | Example |
|-------------|---------|
| Local | `http://localhost:8083` |
| Production | Set per deployment (`PORT` / reverse proxy) |

### URL aliases (same handlers)

| Surface | Primary | Legacy aliases |
|---------|---------|----------------|
| Admin API | `/api/admin` | `/admin`, `/api/v1/admin` |
| Website API | `/api/v1/website` | `/api/website` |

**UI recommendation:** Use `/api/admin` and `/api/v1/website` consistently.

---

### Auth mechanism

| Type | Detail |
|------|--------|
| **Admin protected routes** | JWT required |
| **Header** | `Authorization: Bearer <token>` |
| **Cookie (optional)** | HttpOnly `jwt` set on login/reset (browser only) |
| **Token payload** | `{ adminId, email }` |
| **Expiry** | `JWT_EXPIRES_IN` env (default `10d`) |

**Flow:**
1. `POST /api/admin/auth/login` → read `data[0].token`
2. Attach to all `/api/admin/*` requests except auth public routes

**401 examples:**
```json
{ "success": false, "message": "You are not logged in. Please log in to get access.", "data": [] }
```
```json
{ "success": false, "message": "Invalid or expired token.", "data": [] }
```

---

### Standard success response

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": []
}
```

- `data` is **always an array** (single items are `data[0]`).
- List endpoints add pagination fields at **root level** (siblings of `data`).

---

### Pagination format (list endpoints)

**Query params:**

| Param | Type | Required | Default | Rules |
|-------|------|----------|---------|-------|
| page | number | No | `1` | ≥ 1 |
| limit | number | No | `10` | 1–100 |
| sortBy | string | No | `createdAt` | Any model field name |
| sortOrder | string | No | `desc` | `asc`, `desc`, `1`, `-1` |

**Response extras:**

| Field | Type | Description |
|-------|------|-------------|
| page | number | Current page |
| limit | number | Page size |
| sort | string | Field used (`sortBy`) |
| sortOrder | string | `asc` or `desc` |
| total | number | Total matching records |
| totalPages | number | `ceil(total / limit)` |

**Pattern:** page/limit (not offset). No `offset` query param.

---

### Dynamic filters (list endpoints)

Any query param whose name matches a **top-level Mongoose schema field** (except pagination keys) is applied automatically:

| Schema type | Query behavior |
|-------------|----------------|
| String | Case-insensitive **contains** (regex) |
| Number | Exact match |
| Boolean | `true` / `false` |
| Date | ISO date parsed |
| ObjectId | Exact 24-char hex |
| Enum | Exact value |

**Reserved (never filters):** `page`, `limit`, `sortBy`, `sortOrder`, `sort`, `fields`

**Soft delete:** Lists exclude `isDeleted: true` automatically.

**Module-specific overrides:**
- Website packages → only `status: active`
- Website trips → only `isEnabled: true`
- Website testimonials / FAQs → only `isEnabled: true`

---

### Sort / order

- Controlled by `sortBy` + `sortOrder` query params.
- Default: `createdAt` descending.
- FAQ website list internally prefers `order` ascending when using default sort field logic.
- Sortable fields = any indexed schema field on that model (`createdAt`, `updatedAt`, `status`, `type`, `price`, etc.).

---

### Standard error response

```json
{
  "success": false,
  "message": "Error description",
  "data": []
}
```

**Validation errors (400)** may include:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": [],
  "details": [
    { "path": ["body", "email"], "message": "Invalid email" }
  ]
}
```

| Status | Typical cause |
|--------|----------------|
| 400 | Validation, duplicate key, cast error |
| 401 | Missing/invalid token, wrong password |
| 403 | (reserved; role checks minimal today) |
| 404 | Resource not found, unknown route |
| 500 | Server error |

**Rate limit (429):**
```json
{
  "success": false,
  "message": "Too many submissions. Please try again later.",
  "data": []
}
```

---

### Required headers

| Header | When | Value |
|--------|------|-------|
| `Content-Type` | POST/PATCH/PUT with body | `application/json` |
| `Authorization` | Admin protected routes | `Bearer <token>` |

No API key header. CORS enabled for origins in `CORS_WHITELIST` / `WEB_ORIGIN`.

---

### Date & time formats

| Context | Format |
|---------|--------|
| Request dates | ISO 8601 strings (`2026-12-01`, `2026-12-01T00:00:00.000Z`) |
| Response dates | ISO 8601 UTC from MongoDB (`createdAt`, `updatedAt`, `travelDates`) |
| Dashboard `from` / `to` | ISO date strings |

---

### Entity codes (auto-generated)

| Entity | Prefix example |
|--------|----------------|
| Inquiry | `INQ-00001` |
| Vendor | `VEN-00001` |
| Trip | `TRP-00001` |
| Package | `PKG-00001` |
| Payment | `PAY-00001` |
| Invoice | `INV-00001` |
| Contact | `CNT-00001` |

Use `_id` (ObjectId) for URL path params; `code` for display/reference.

---

### Enum quick reference

| Domain | Field | Values |
|--------|-------|--------|
| Inquiry | status | `PENDING`, `DONE` |
| Trip | status | `Draft`, `Confirmed`, `In Progress`, `Completed`, `Cancelled` |
| Trip | isEnabled | `true`, `false` |
| Package | status | `active`, `inactive`, `draft` |
| Vendor | type | `Hotel`, `Vehicle`, `Restaurant`, `Guide`, `Other` |
| Payment | type | `Token`, `Full`, `Partial` |
| CMS | section | `FAQ`, `About Us`, `Hero Section`, `Terms`, `Privacy` |

---

*Document version: aligned with TripPlanner backend v2.0 module-first architecture.*
