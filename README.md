# Job Portal System (MERN)

A complete Job Portal System with three roles:

- Admin
- Employer
- Job Seeker

Tech stack:

- Frontend: React, React Router, Axios, Tailwind CSS, Context API
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

## Prerequisites

Install these first:

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- MongoDB (local server) OR MongoDB Atlas connection string

## Project Structure

- `backend/` -> Express + MongoDB API
- `frontend/` -> React + Vite UI

## Step-by-step local run guide

### 1. Setup backend

```powershell
cd d:\workport\backend
npm install
```

Create `.env` file in `backend` folder using values from `.env.example`.

Example `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/job_portal_db
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Start backend:

```powershell
npm run dev
```

Backend base URL:

- `http://localhost:5000`
- Health check: `http://localhost:5000/api/v1/health`

### 2. Setup frontend

Open a second terminal:

```powershell
cd d:\workport\frontend
npm install
```

Create `.env` file in `frontend` folder using values from `.env.example`.

Example `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Start frontend:

```powershell
npm run dev
```

Frontend URL:

- `http://localhost:5173`

### 3. Login flow notes

- Register as `jobseeker` or `employer` from UI.
- Employer account must be approved by admin before employer-protected APIs will work.
- Admin account is not created from public register route. Create one directly in MongoDB (set `role` = `admin`) if needed for first-time setup.

## Quick verification checklist

1. Open `http://localhost:5000/api/v1/health` and confirm API returns success JSON.
2. Open `http://localhost:5173` and register/login as job seeker.
3. Use admin account to approve employer.
4. Employer creates jobs, job seeker applies, employer updates status, seeker sees status in applications page.

## Current scope notes

- Company profile create/update API is not fully implemented yet.
- Job seeker profile update API is not fully implemented yet.
- Core auth, jobs, applications, and admin management APIs are connected.
