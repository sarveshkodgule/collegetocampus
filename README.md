# 🎮 Placement Quest — Silicon Metropolis

**Placement Quest** is an immersive, full-stack edtech platform designed to transform engineering placement preparation into a gamified virtual reality experience. Set inside **Silicon Metropolis**, students explore themed training sectors, fight DSA data behemoths, hack SQL databases, build SaaS startups, and compete on global real-time leaderboards.

---

## ✨ Key Platform Features

* **🏙️ Central World — Silicon Metropolis Hub:** A cyberpunk hub connecting 11 specialized technical mini-games and career preparation sectors.
* **🌐 Google OAuth & ID Verification:** One-click Google Sign-In, Student ID / Roll Number verification gates, and instant password recovery.
* **⚔️ 11 Technical Mini-Game Sectors:** Covering Data Structures & Algorithms, SQL Querying, System Design, Aptitude Quants, PR Code Debugging, ML/AI, and Workplace Visual Novels.
* **🛡️ MongoDB-Synced Developer Clans:** Join SDE Guilds (Backend Guardians, AI Alchemists, UI/UX Rogues) and compete on clan rankings.
* **🪪 Futuristic Digital Student ID Card:** Glassmorphic campus credential card with barcode graphics, department status, and institutional standings.
* **📄 Detailed 4-Page PDF Guidebooks:** Exportable 4-page PDF sector manuals generated via jsPDF, complete with solution cheats and answer keys.
* **🏆 Real-Time Live Standings:** 3-second live polling synchronization updating global player ranks dynamically.

---

## 🎮 The 11 Interactive Training Sectors

1. **🏰 Career Tower (Life Architect):** Class constellation skill tree to unlock developer specialties (Frontend Mage, Backend Guardian, AI Alchemist, UI/UX Rogue) and allocate mastery points.
2. **💾 Data Bank (SQL Heist):** Interactive database schema explorer where players write raw SQL `SELECT` and `JOIN` queries to bypass security vaults and extract audit logs.
3. **👾 DSA Arena (Algorithm Arena):** A 10-boss space combat simulator where players analyze algorithmic time/space complexities to fire laser cannons at array monsters.
4. **🏃 Aptitude District (Apti Rush):** A procedural 3D-perspective quants runner featuring randomized math logic, firewall obstacles, shield powerups, and time penalties.
5. **🕵️ Office Complex (Internship Detective):** A visual novel workplace simulator exploring Git merge conflicts, code review friction, standups, and corporate soft-skills.
6. **🏎️ Startup Garage (Startup Tycoon):** A tech-startup simulator managing a weekly 40-hour runway, server infrastructure loads, social media marketing, and venture capital pitches.
7. **🔍 PR Review (Code Inspector):** An IDE debugger where players inspect buggy code snippets, select optimal syntax patches, and submit clean pull requests.
8. **🔐 Assessment Suite (Interview Escape Room):** A timed room escape challenge requiring database vault hacks, logic node matching, and system design puzzles.
9. **📜 Development Center (Resume Builder Tycoon):** Student life simulator balancing study hours, project typing mini-games, portfolio building, and placement applications.
10. **🐍 Code Snake Arena (Syntax Collector):** Cyberpunk snake arena collecting code keywords in strict sequence while evading throttled insect crawlers.
11. **🧠 AI Master Challenge (Millionaire-Style ML Quiz):** A 10-tier machine learning & deep learning quiz featuring KBC-style lifelines (50:50, AI Mentor, Dataset Preview, Extra Time) and safe-haven checkpoints.

---

## 🚀 Tech Stack

### Frontend (Client)
* **Framework:** React 18 (Vite)
* **State Management:** Zustand (Global Player Store)
* **Styling:** Glassmorphic Cyberpunk Dark UI (CSS Variables & Glow Utilities)
* **Icons:** Lucide React
* **Graphics & Audio:** HTML5 Canvas API & Web Audio API Synthesizers
* **Document Generator:** jsPDF

### Backend (Server)
* **Runtime:** Node.js & Express.js
* **Database:** MongoDB Atlas (Cloud Database Cluster)
* **Authentication:** JWT (JSON Web Tokens), Bcrypt.js, and Google Identity Services API
* **Security & Reliability:** Helmet HTTP headers, Express Rate Limiting, CORS origin handling

---

## 🛠️ Local Setup Instructions

### Prerequisites
* Node.js (v18 or higher recommended)
* Running MongoDB Atlas cluster (or local MongoDB instance)

### 1. Configure Environment Variables
Create a `.env` file inside the `Backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/collegetocampus
JWT_SECRET=your_jwt_secret_token_here
```

### 2. Run the Backend Server
```bash
cd Backend
npm install
npm start
```
*The backend server will automatically connect to MongoDB and seed initial questions if the database is fresh.*

### 3. Run the Frontend Client
```bash
cd Frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser to enter **Placement Quest**!

---

## 📡 API Endpoints Reference

| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register a new student profile | Public |
| `/api/auth/login` | `POST` | Authenticate student credentials (with ID verification check) | Public |
| `/api/auth/verify-id` | `POST` | Verify Student ID / Roll Number to issue JWT session | Public |
| `/api/auth/forgot-password` | `POST` | Reset password validated via Student ID / Roll Number | Public |
| `/api/auth/google` | `POST` | Sign-in or register using Google OAuth ID Token | Public |
| `/api/auth/me` | `GET` | Re-hydrate student profile data | Protected (JWT) |
| `/api/auth/progress` | `PUT` | Synchronize XP, coins, streak, and clan progress | Protected (JWT) |
| `/api/leaderboard` | `GET` | Fetch top SDE profiles sorted by XP descending | Public |
| `/api/questions` | `GET` | Fetch questions filtered by game sector | Public |
| `/api/daily-challenge` | `GET` / `POST` | Retrieve or complete daily rotational challenges | Public / Protected |
