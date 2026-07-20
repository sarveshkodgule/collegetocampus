# 🛡️ Backend Production Security Checklist — Placement Quest

> *"A working app is not automatically a secure app. Attackers look for the small things developers assume nobody will notice."*

This document outlines the **6 Production Security Fundamentals** implemented across the **Placement Quest (Silicon Metropolis)** backend API.

---

## 🔐 1. Authentication & Authorization
* **JWT Protected Middleware:** Private routes (`/api/auth/me`, `/api/auth/progress`, `/api/daily-challenge/complete`) are guarded by the `protect` middleware in `Backend/middleware/auth.js`.
* **Secondary Student ID Verification Gate:** Authentication requires a secondary verification check against the student's registered Student ID / Roll Number before granting access tokens.
* **Bcrypt Password Hashing:** Passwords are pre-hashed with a salt factor of 10 (`bcryptjs`) before database persistence and excluded from default queries (`select: false`).

---

## 🧪 2. Input Validation & Sanitization
* **Schema Validation:** Mongoose schemas (`Student.js`) enforce strict type validation, field trimming, string limits, and email regex matching (`/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`).
* **Safe Parameter Handling:** Query parameters like `excludeIds` are strictly validated for length (24-character hexadecimal) and explicitly cast via `new mongoose.Types.ObjectId(id)` before reaching aggregation pipelines.

---

## 🗝️ 3. Secrets & Environment Variables
* **Dotenv Configuration:** Sensitive credentials (`MONGODB_URI`, `JWT_SECRET`, `PORT`) are loaded dynamically via `process.env`.
* **Git Isolation:** `.env` files are explicitly excluded via `.gitignore` to prevent secret leaks to public repositories.

---

## 💉 4. NoSQL & SQL Injection Defense
* **ORM Query Parameterization:** Mongoose ORM method calls (`Student.findOne({ email })`) bind inputs as parameters rather than raw string concatenation, preventing NoSQL injection vulnerabilities.
* **Database Query Sanitization:** Raw input is never evaluated directly in database commands.

---

## 🌐 5. CORS & Security Headers
* **Helmet.js Integration:** `app.use(helmet())` automatically injects HTTP security headers to guard against Cross-Site Scripting (XSS), MIME-sniffing, clickjacking, and header disclosure.
* **Controlled CORS Policies:** `cors()` restricts HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) and headers (`Content-Type`, `Authorization`).

---

## 🚦 6. Rate Limiting & Abuse Protection
* **DDoS & Brute Force Shield:** Configured `express-rate-limit` middleware (`apiLimiter`) capping requests to **150 API calls per 15 minutes** per IP address across all `/api/` routes.

---

## 📌 Pre-Deployment Audit Checklist

- [x] Verify `.env` is listed in `.gitignore`
- [x] Enable `helmet()` and CORS origin controls
- [x] Configure `express-rate-limit` on `/api/`
- [x] Ensure all private routes use `protect` JWT middleware
- [x] Validate password hashes use Bcrypt with 10+ salt rounds
- [x] Audit NoSQL queries for parameterized object inputs
