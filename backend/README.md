# Job Portal Backend

Backend API for the MERN Job Portal project.

## Features implemented

- Express server with route versioning (`/api/v1`)
- MongoDB connection using Mongoose
- JWT authentication
- Role-based authorization middleware
- Core modules:
  - Auth (`/auth`)
  - Jobs (`/jobs`)
  - Applications (`/applications`)
  - Admin (`/admin`)

## Prerequisites

- Node.js v18+
- npm
- MongoDB local instance OR MongoDB Atlas URI

## Setup

1. Install dependencies

```powershell
cd d:\workport\backend
npm install
```

2. Create environment file

Create `backend/.env` from `backend/.env.example`.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/job_portal_db
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

3. Start development server

```powershell
npm run dev
```

4. Production start

```powershell
npm start
```

## API check

- Root: `GET http://localhost:5000/`
- Health: `GET http://localhost:5000/api/v1/health`

## Important notes

- Public register route allows only `jobseeker` and `employer` roles.
- First admin user should be created manually in database and role set to `admin`.
- Employers must be approved by admin (`approved`) before employer-only actions.
