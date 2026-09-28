# Leave Management System

A full-stack MERN-based Leave Management System designed to manage employee leave requests, approvals, leave balances, employee records, and configurable leave policies.

The application provides separate workflows for **Employees** and **Administrators**, with JWT-based authentication, role-based authorization, MongoDB persistence, and a responsive Material UI frontend.

---

## 1. Project Overview

The Leave Management System digitizes the employee leave lifecycle:

1. Employees securely log in.
2. Employees view their leave balances and history.
3. Employees submit leave requests with leave type, dates, and reason.
4. Administrators review pending requests.
5. Administrators approve or reject requests.
6. Approved leave is deducted from the employee's applicable balance.
7. Administrators can add employees and configure leave policies.
8. Earned leave is calculated based on the employee's joining date and monthly accrual policy.

### User Roles

#### Employee
- Login
- View dashboard
- View leave balance
- Apply for leave
- View leave history
- Track request status

#### Administrator
- Login
- View dashboard metrics
- View and manage leave requests
- Approve/reject leave
- Add employees
- Configure leave policy
- View employee records

---

## 2. Features

### Authentication & Authorization
- Employee and admin login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based authorization
- Persistent frontend session using JWT

### Employee Features
- Employee dashboard
- Leave balance tracking
- Apply leave
- Leave history
- Pending/approved/rejected status tracking
- Leave validation for balance and overlapping requests

### Admin Features
- Admin dashboard
- Leave request management
- Approve/reject leave requests
- Add new employees
- Set employee joining date
- Set employee department and password
- View employee list
- Configure leave policies

### Leave Policy
The system supports configurable leave policies:

| Leave Type | Policy |
|---|---|
| Casual Leave | Annual allowance configurable by admin |
| Sick Leave | Annual allowance configurable by admin |
| Earned Leave | Monthly accrual configurable by admin and calculated from joining date |
| Casual Carry Forward | Configurable |
| Sick Carry Forward | Configurable |
| Earned Carry Forward | Configurable |

The current business rule can be configured by the administrator from the Leave Policy section.

### Leave Validation
- Prevents invalid date ranges
- Calculates leave duration automatically
- Checks available balance
- Prevents overlapping pending/approved leave requests
- Prevents approval when sufficient balance is unavailable

---

## 3. System Architecture

```text
                         ┌──────────────────────────┐
                         │        End User          │
                         │   Browser / Web App      │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │          Vercel          │
                         │   React + Vite Frontend   │
                         └────────────┬─────────────┘
                                      │ HTTPS / REST API
                                      ▼
                         ┌──────────────────────────┐
                         │          Render          │
                         │   Node.js + Express API   │
                         └────────────┬─────────────┘
                                      │ Mongoose
                                      ▼
                         ┌──────────────────────────┐
                         │      MongoDB Atlas        │
                         │        Database            │
                         └──────────────────────────┘
```

### Repository Structure

```text
leave-management-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── employee/
│   │   ├── services/
│   │   └── styles/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── BRD.md
├── README.md
└── .gitignore
```

---

## 4. Technology Stack

### Frontend
- React.js
- Vite
- Material UI (MUI)
- React Router
- Axios
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- CORS
- dotenv

### Deployment & Infrastructure
- GitHub — source control
- Vercel — frontend hosting
- Render — backend/API hosting
- MongoDB Atlas — cloud database

---

## 5. Prerequisites

Install the following before running locally:

- Node.js 20+ recommended
- npm
- Git
- MongoDB Atlas account

Verify:

```bash
node -v
npm -v
git --version
```

---

## 6. Local Setup

### Clone the repository

```bash
git clone https://github.com/Lolakshi-Bangera/leave-management-system.git
cd leave-management-system
```

### Backend setup

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The API will normally run at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

---

## 7. Database Setup

Create a MongoDB Atlas cluster and database user.

Configure Atlas Network Access so the deployed backend can connect to the database.

Add the Atlas connection string to:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

### Optional Seed Data

If the project includes the seed script, run from the backend directory:

```bash
npm run seed
```

The seed script creates the initial demo administrator and employee accounts defined by the project.

For security, change demo credentials before using the application outside assessment/testing environments.

### Demo Accounts

**Admin**
- Email: `admin@leaveapp.com`
- Password: `Admin@123`

**Employee**
- Email: `john@leaveapp.com`
- Password: `Employee@123`

---

## 8. Environment Variables

### Frontend

| Variable | Description | Local Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

Production example:

```env
VITE_API_URL=https://leave-management-system-se4d.onrender.com/api
```

### Backend

| Variable | Description |
|---|---|
| `PORT` | Server port; Render supplies its own port in production |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CLIENT_URL` | Frontend URL allowed by CORS |

Production example:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
CLIENT_URL=https://leave-management-system-nine-black.vercel.app
```

### Security

## Password Management & Reset

The application follows secure password-handling practices:

- User passwords are never stored in plain text.
- Passwords are hashed using `bcryptjs` before being stored in MongoDB.
- JWT-based authentication is used for authenticated API requests.
- Passwords are excluded from user-facing API responses wherever applicable.
- Authentication tokens are stored on the client and attached to protected API requests.
- Unauthorized requests are rejected by the backend authentication middleware.
- Password reset functionality should use a secure, time-limited reset token rather than accepting a new password directly through an unauthenticated request.
- Reset tokens should be single-use, expire after a short period, and be stored securely (preferably as a hash) in the database.
- After a successful password reset, existing authentication tokens/sessions should be invalidated where applicable.
- Password reset responses should not reveal whether a particular email address exists in the system.

### Password Reset Flow

The recommended password reset flow is:

1. User selects **Forgot Password** on the login page.
2. User enters their registered email address.
3. Backend generates a cryptographically secure, time-limited reset token.
4. Reset token is sent to the user's registered email through a configured email service.
5. User opens the reset link and creates a new password.
6. Backend validates the token and expiration time.
7. New password is securely hashed using `bcryptjs`.
8. Reset token is invalidated after successful password change.
9. User can log in using the new password.

### Future Enhancement

A production-ready version can further improve password management by adding:

- Forgot Password / Reset Password UI
- Email-based password reset
- Short-lived, single-use reset tokens
- Password strength validation
- Change Password option for authenticated users
- Session/token invalidation after password change
- Rate limiting for login and password reset endpoints
- Account lockout or temporary throttling after repeated failed login attempts

Never commit `.env` files to GitHub.

The repository `.gitignore` should include:

```gitignore
node_modules/
.env
.env.*
dist/
build/
*.log
```

---

## 9. API Documentation

Base URL (local):

```text
http://localhost:5000/api
```

Base URL (production):

```text
https://leave-management-system-se4d.onrender.com/api
```

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register an employee |
| POST | `/auth/login` | Public | Login and receive JWT |

### Employee/User

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users/me` | Authenticated | Get current user and balance |

### Employee Leave

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/leaves` | Employee | Get employee leave history |
| POST | `/leaves` | Employee | Apply for leave |
| GET | `/leaves/:id` | Employee | Get a specific leave request |

### Admin Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin/dashboard` | Admin | Dashboard statistics |
| GET | `/admin/leaves` | Admin | Get all leave requests |
| PATCH | `/admin/leaves/:id/approve` | Admin | Approve leave |
| PATCH | `/admin/leaves/:id/reject` | Admin | Reject leave |
| GET | `/admin/employees` | Admin | List employees |
| POST | `/admin/employees` | Admin | Add an employee |

### API Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

The frontend Axios client automatically attaches the stored JWT to authenticated requests.

---

## 10. Leave Request Example

### POST `/api/leaves`

```json
{
  "leaveType": "casual",
  "startDate": "2026-10-05",
  "endDate": "2026-10-06",
  "reason": "Personal work"
}
```

The backend calculates the number of days and validates the employee's balance before creating the request.

---

## 11. Admin Approval Flow

```text
Employee
   │
   │ Apply Leave
   ▼
Pending Request
   │
   ▼
Admin Dashboard
   │
   ├── Approve ──► Balance deducted ──► Approved
   │
   └── Reject ───► Rejection reason ──► Rejected
```

---

## 12. Deployment

### Hosting

| Component | Platform |
|---|---|
| Source Code | GitHub |
| Frontend | Vercel |
| Backend/API | Render |
| Database | MongoDB Atlas |

### Live URLs



- **Frontend:** `https://leave-management-system-nine-black.vercel.app/login`
- **Backend API:** `https://leave-management-system-se4d.onrender.com`
- **API Health:** `https://leave-management-system-se4d.onrender.com/api/health`

### Deployment Approach

The application uses a single GitHub repository containing two independently deployable applications:

```text
leave-management-system/
├── frontend/  → Vercel
└── backend/   → Render
```

MongoDB Atlas provides the shared cloud database.

### Frontend Deployment — Vercel

1. Import the GitHub repository into Vercel.
2. Set **Root Directory** to:
   ```text
   frontend
   ```
3. Framework:
   ```text
   Vite
   ```
4. Build command:
   ```text
   npm run build
   ```
5. Output directory:
   ```text
   dist
   ```
6. Add:
   ```env
   VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
   ```
7. Deploy/redeploy the project.

### Backend Deployment — Render

1. Create a new Render Web Service.
2. Connect the GitHub repository.
3. Set **Root Directory** to:
   ```text
   backend
   ```
4. Build command:
   ```text
   npm install
   ```
5. Start command:
   ```text
   npm start
   ```
6. Add production environment variables:
   ```text
   MONGODB_URI
   JWT_SECRET
   CLIENT_URL
   ```
7. Deploy the service.
8. Verify:
   ```text
   https://YOUR-RENDER-BACKEND.onrender.com/api/health
   ```

### MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Configure Network Access for the deployment environment.
4. Copy the MongoDB connection string.
5. Add it as `MONGODB_URI` in Render.
6. Verify the backend logs show a successful MongoDB connection.

### Updating the Application

After the initial deployment:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

Vercel and Render can automatically deploy the new commit when GitHub integration and automatic deployments are enabled.

For frontend environment-variable changes, trigger a new Vercel deployment because Vite variables are embedded during the build.

---

## 13. Production Checklist

Before submission:

- [ ] Frontend deployed successfully on Vercel
- [ ] Backend deployed successfully on Render
- [ ] MongoDB Atlas connected
- [ ] `VITE_API_URL` points to the Render API
- [ ] Render `CLIENT_URL` points to the Vercel frontend
- [ ] `.env` files are not committed to GitHub
- [ ] Employee login tested
- [ ] Admin login tested
- [ ] Leave application tested
- [ ] Leave approval tested
- [ ] Leave rejection tested
- [ ] Leave history tested
- [ ] Leave balance tested
- [ ] Add employee tested
- [ ] Joining date tested
- [ ] Leave policy tested
- [ ] Production API health endpoint tested

---

## 14. Troubleshooting

### CORS error

Check:

```env
CLIENT_URL=https://leave-management-system-nine-black.vercel.app
```

and make sure the URL exactly matches the deployed frontend origin.

### Frontend still calls localhost

Check Vercel:

```text
Settings → Environment Variables
```

and verify:

```env
VITE_API_URL=https://leave-management-system-se4d.onrender.com/api
```

Then redeploy Vercel.

### MongoDB connection failure

Check:

- `MONGODB_URI`
- Atlas database username/password
- Atlas Network Access
- Special characters in the database password are URL-encoded
- Render environment variables are saved

### Render service unavailable

Check Render deployment logs and confirm:

```text
npm install
npm start
```

are succeeding.

---

## 15. Future Enhancements

Potential improvements for a production-scale version:

- Email notifications for leave approval/rejection
- Password reset
- Employee profile management
- Audit logs
- Pagination and filtering for large employee/leave datasets
- Automated leave-year processing
- Holiday/weekend-aware leave calculation
- Automated scheduled reports
- More granular permissions

---

## 16. License

This project was developed as part of a technical assessment.
