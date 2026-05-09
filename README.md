# Jaipur Tourism Portal Backend

A production-ready Node.js and Express backend built for the Jaipur Tourism Portal. This project uses a strict MVC architecture in vanilla JavaScript, MongoDB for the database, Zod for schema validation, and implements a full Content Management System (CMS) and Admin portal.

## 🚀 Features
- **Strict Scope Separation**: Divided into `/website` (Public) and `/admin` (Protected) routes to ensure high security for internal operations.
- **Advanced Admin Auth**: JWT-based authentication, password reset flows via email, profile image uploading, and `lastActive` tracking.
- **Dynamic CMS Module**: Full CRUD operations for Testimonials and dynamic Email Templates used across the application.
- **Automated Emailing**: Integrates seamlessly with Nodemailer to push real-time Admin notifications when new inquiries are submitted, and to send password reset links.
- **Pagination & Filtering**: Includes a globally scalable `APIFeatures` utility that dynamically maps any `Mongoose` schema into queryable APIs with built in Zod validation.
- **Security Utilities**: Pre-configured with Helmet, CORS, and Express Rate Limit, wrapped in a generic `errorHandler` to catch schema validation and asynchronous execution errors.

---

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/en/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or an Atlas URI.

---

## ⚙️ Getting Started

### 1. Installation
Clone this repository and install the dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory. You can use the provided `.env.example` as a template:
```bash
cp .env.example .env
```
Ensure you fill out the `SMTP_` variables with real Mailtrap or SMTP provider credentials for the email functionality to work.

### 3. Database Seeding
To initialize the system, you must run the seeder script. This will generate the `Super Admin` account and inject the mandatory Email Templates (`forgot-password` and `enquiry-email`) into MongoDB.

```bash
node seeds/seedAdmin.js
```
*Default Super Admin Credentials:*
- **Email:** `mohit@mailinator.com`
- **Password:** `123123123`

### 4. Running the Server
Start the development server:
```bash
node server.js
```
The server will default to port `3000`.

---

## 📁 Project Structure

```text
/controllers
  /admin        -> Logic for the authenticated dashboard APIs
  /website      -> Logic for public-facing APIs (inquiries, submitting testimonials)
/middlewares    -> Auth logic, Global Error Catcher, and Zod Validator
/models         -> Mongoose schemas (User, Inquiry, Testimonial, EmailTemplate)
/routes
  /admin        -> Admin routes (Protected via JWT and Role 'admin')
  /website      -> Open routes
/seeds          -> Scripts to populate default DB states
/services       -> Reusable business logic (Pagination logic, Email dispatcher, File Uploader)
/utils          -> CatchAsync wrappers and generic JSON response formatter
/validations    -> Zod schemas ensuring clean data processing
server.js       -> Main Express Entrypoint
vercel.json     -> Vercel Serverless Function configuration
```

---

## 📡 API Documentation
A fully configured Postman collection has been provided in the root directory: `postman_collection.json`. 

**To use the Postman Collection:**
1. Open Postman and select `Import`.
2. Upload the `postman_collection.json` file.
3. The collection is pre-configured with test scripts! Simply execute the **Admin Login** request, and the returned JWT token will be automatically applied to all subsequent Admin routes.

---

## ☁️ Deployment
This application is configured for deployment on Vercel. The Express app is explicitly exported inside `server.js` (instead of using `app.listen`), and the `vercel.json` maps all API routing gracefully. Simply link your repository to a Vercel project to deploy.
