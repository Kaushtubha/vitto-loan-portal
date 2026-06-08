# Vitto Loan Application Portal

A premium, production-ready, full-stack Loan Application Portal built for a fintech operations team to log, track, filter, and review customer loan applications. Inspired by premium modern interfaces like Stripe, Linear, and Clerk.

## 🚀 Live Links
- **Frontend URL**: [https://vitto-loan-portal.vercel.app](https://vitto-loan-portal.vercel.app) *(example placeholder)*
- **Backend URL**: [https://vitto-loan-portal.onrender.com](https://vitto-loan-portal.onrender.com) *(example placeholder)*
- **Database**: Hosted on Neon PostgreSQL

---

## ✨ Features
1. **Apply Loan Page**: Dynamic form with client-side regex-based validation (e.g. 10-digit mobile check, amount range limits), visual load indicators, and a confirmation modal showcasing a copyable UUID Reference ID.
2. **Interactive Analytics Dashboard**:
   - **Metrics Bar**: Stats cards (Total applications,Requested amount, Approved capital, Pending review counts) with interactive hover animations.
   - **Portfolio demand Curve**: Dynamic Area Chart (powered by Recharts) showing recent capital application volumes.
   - **Demographics Chart**: Pie chart showing borrower preferred language distributions.
3. **Operations Table**:
   - **Language Badges**: Language labels styled with unique color palettes (Hindi -> Orange, Tamil -> Indigo, Marathi -> Blue, Telugu -> Pink, English -> Emerald).
   - **Optimistic UI updates**: Direct status updates (Pending ➔ Approved / Rejected) using state cache which propagates instantly without full page reloads. If the database update fails, it rolls back gracefully.
   - **Search & Filters**: Instant search by Applicant Name or Mobile Number, paired with status category filters.
   - **Pagination**: Client-side/Server-side matching pagination.
   - **Copy ID Utility**: Quick inline clipboard copy utility.
4. **Data Portability**: **Export CSV** button on dashboard to instantly download active application list data.
5. **Theme Switcher**: Fluid Dark and Light appearance modes with state persistent in localStorage.

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS v3, Zustand, Framer Motion, Recharts, React Hot Toast, Lucide React
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL (Neon.tech), Zod Validation
- **CI/CD & Hosting**: Vercel (Frontend), Render/Railway (Backend), Neon (Database)

---

## 📁 Folder Structure
```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma database schema definition
│   │   └── seed.js            # Mock data seeder
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # Prisma Client initialization instance
│   │   ├── controllers/
│   │   │   └── applicationController.js # App logic, filters & aggregate metrics
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js # Centralized JSON error format handler
│   │   │   └── validation.js   # Zod body validation schemas
│   │   ├── routes/
│   │   │   └── routes.js       # Route bindings
│   │   ├── app.js             # Express app & CORS rules configuration
│   │   └── server.js          # Main entry server point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx     # Sidebars & Theme wrap frame
│   │   ├── pages/
│   │   │   ├── ApplyLoan.jsx  # Multi-validated Application Form
│   │   │   └── Dashboard.jsx  # Metrics, Recharts visualizer, Filters & Modal
│   │   ├── store/
│   │   │   └── useStore.js    # Zustand store & Optimistic UI controller
│   │   ├── App.jsx            # Router and Hot-Toaster registry
│   │   ├── index.css          # Tailwind configurations & Custom scrollbars
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
├── migrations/
│   └── 001_init.sql           # Raw PostgreSQL initial schema file
└── .gitignore
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database instance (local or hosted on Neon/Supabase)

### 1. Database Setup
Create a PostgreSQL database called `loan_portal`. A migration script is provided in `migrations/001_init.sql` for inspection or raw CLI execution.

### 2. Backend Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Copy `.env.example` to `.env` and fill in your connection string and Port:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/loan_portal?schema=public"
   PORT=5000
   CLIENT_URL="http://localhost:5173"
   ```
4. Run migrations and generate Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Seed the database with mock records:
   ```bash
   npm run db:seed
   ```
6. Start the server (Development mode):
   ```bash
   npm run dev
   ```
   *Expected Output: Server is running in development mode on port 5000*

---

### 3. Frontend Installation
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Expected Output: Local server running at http://localhost:5173*
4. Open the link in your browser to interact with the portal.

---

## 📋 API Spec Reference
- **POST `/api/applications`**: Submit loan application. Enforces name, phone, purpose, language and positive numeric amount requirements.
- **GET `/api/applications`**: Query applications with optional query params `status`, `search`, `page`, and `limit`.
- **PATCH `/api/applications/:id/status`**: Transition status between `pending`, `approved`, or `rejected`.
- **GET `/api/summary`**: Returns total counts, sum total of requested amounts, total approved capital, status ratios, and language groupings.

---

## ☁️ Deployment Guide

### Database (Neon PostgreSQL)
1. Register a free tier database at [Neon.tech](https://neon.tech).
2. Grab the PostgreSQL Connection URI and use it as `DATABASE_URL` in your server environment configs.

### Backend (Render or Railway)
1. Sign up on [Render.com](https://render.com) or Railway and link your Git repository.
2. Setup a **Web Service**:
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
   - Root Directory: `backend`
3. Define Environment Variables:
   - `DATABASE_URL`: Your Neon DB connection string.
   - `PORT`: `5000` (Render binds this automatically).
   - `CLIENT_URL`: Your deployed frontend URL (e.g. `https://vitto-loan-portal.vercel.app`).
   - `NODE_ENV`: `production`

### Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and import the repository.
2. Select the `frontend` folder as the framework root directory.
3. Configure the build parameters:
   - Framework Preset: `Vite`
   - Output Directory: `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: Your deployed backend service URL (e.g., `https://vitto-loan-portal.onrender.com/api`).
