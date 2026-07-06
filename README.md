# Silicon Metropolis: College-to-Campus SDE Training Platform

Silicon Metropolis is a gamified, full-stack software developer engineering (SDE) training and placement preparation platform. The platform wraps core technical benchmarks—such as database queries, algorithmic complexity, coding syntaxes, and behavioral interviews—into 9 interactive cyberpunk mini-games connected to a cloud MongoDB Atlas cluster.

---

## 🚀 Tech Stack

### Frontend (Client-side)
*   **Framework:** React 18 (Vite Bundler)
*   **State Management:** Zustand (Zustand Player Store)
*   **Visual Style:** Glassmorphic Dark UI (Custom Neon CSS Theme classes)
*   **Icons:** Lucide React
*   **Vector Canvas:** HTML5 Canvas API (DSA Bridge & Space Combat rendering)
*   **PDF Exporter:** jsPDF (automated placement guide downloads)

### Backend (Server-side)
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB Atlas (Cloud Cluster)
*   **Security:** Helmet (HTTP headers protection), Express Rate Limit (DDoS protection), CORS middleware.
*   **Authentication:** JWT (JSON Web Tokens) & Bcrypt (password hashing)

---

## 🎮 The 9 Interactive Training Sectors

1.  **Career Tower (Life Architect):** Interactive class constellations skill tree (Frontend, Backend, Fullstack, DSA) to allocate focus points.
2.  **Data Bank (SQL Heist):** DB schema map explorer where players type raw SQL `SELECT` and `JOIN` commands to hack vault logs.
3.  **Dsa Arena (Algorithm Arena):** A 10-boss combat flight simulator where users answer algorithmic complexity queries to shoot space lasers.
4.  **Aptitude District (Apti Rush):** A procedural, real-time quants math builder using mathematical randomized variables.
5.  **Office Complex (Internship Detective):** A visual SDE novel simulator exploring Git conflicts, QA friction, and standups.
6.  **Startup Garage (Startup Tycoon):** Tycoon simulator managing server load, budget hours, and venture capital pitches.
7.  **PR Review (Code Inspector):** An IDE debugger where players inspect codebases, write input patch modifications, and compile fixes.
8.  **Assessment Suite (Interview Escape Room):** Zooming 3D-feeling map chamber requiring vault query hacks and Canvas bridge matches.
9.  **Development Center (Resume Builder Tycoon):** Engineering student life tycoon spending hours on DSA, project typing mini-games, and placement cell applications.

---

## 🛠️ Local Setup Instructions

### Prerequisites
*   Node.js installed (v16+ recommended).
*   A running MongoDB Atlas database cluster.

### 1. Clone & Set Up Environment
Navigate to the project root and create a backend configuration file at `Backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password_encoded>@<cluster>.mongodb.net/collegetocampus
JWT_SECRET=your_placement_jwt_secret_token


# Install dependencies
npm install

# Seed the database & start server
npm start


🚀 SDE Server running in production on port 5000
📡 Cloud MongoDB Connected: ...
🌱 Seeding initial database questions...
✅ Initial database questions seeded successfully!

# Install dependencies
npm install

# Start Vite dev server
npm run dev

Open http://localhost:5173/ in your browser to begin SDE training!

📡 API Endpoints Reference
Route	Method	Description	Access
/api/auth/register	POST	Register a new student profile	Public
/api/auth/login	POST	Authenticate student credentials & get token	Public
/api/auth/me	GET	Retrieve student profile (Header state load)	Protected (JWT)
/api/questions	GET	Query randomized questions matching category	Public
/api/questions/seed	POST	Wipe database collection and reload seedData.json	Public
/api/leaderboard	GET	Fetch top SDE profiles sorted by XP descending	Public
