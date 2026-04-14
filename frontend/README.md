# Job Portal Frontend

Frontend app for the MERN Job Portal system.

## Features implemented

- React + Vite setup
- React Router with role-based route protection
- Tailwind CSS styling
- Context API auth state management
- Axios API integration with JWT token interceptor

## Prerequisites

- Node.js v18+
- npm
- Backend server running on `http://localhost:5000` (or update env)

## Setup

1. Install dependencies

```powershell
cd d:\workport\frontend
npm install
```

2. Create environment file

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

3. Start development server

```powershell
npm run dev
```

4. Open app

- `http://localhost:5173`

## Available flows

- Register/Login for Job Seeker and Employer
- Admin pages for stats/users/employer approvals/jobs
- Employer pages for posting jobs and managing applicants
- Job Seeker pages for browsing jobs and tracking applications

## Current scope notes

- Company profile update API is pending backend implementation.
- Job seeker profile update API is pending backend implementation.
