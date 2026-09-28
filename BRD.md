# Business Requirements Document (BRD)

# Leave Management System

## 1. Document Overview

### Purpose

The Leave Management System is a web-based application for managing employee leave requests, leave balances, approval workflows, employee records, and leave policies.

### Objective

The system aims to replace manual leave tracking with a centralized workflow that allows employees to apply for leave and administrators to manage requests and leave policies.

---

## 2. User Roles

### Employee

Employees can:

- Log in securely.
- View leave balances.
- Apply for leave.
- View leave history.
- Track pending, approved, and rejected requests.

### Administrator

Administrators can:

- Log in securely.
- View dashboard statistics.
- Review leave requests.
- Approve/reject requests.
- Add employees.
- Set employee joining dates.
- Configure leave policies.
- View employee records.

---

## 3. Functional Requirements

### Authentication

- User login using email and password.
- Passwords stored using secure hashing.
- JWT authentication for protected APIs.
- Role-based access control.

### Leave Management

- Employees can submit leave requests.
- Leave type, start date, end date, and reason are captured.
- Leave duration is calculated by the backend.
- Duplicate/overlapping requests are validated.
- Balance availability is validated.

### Approval Workflow

- New requests start in `pending` status.
- Admin can approve or reject pending requests.
- Approved leave deducts the applicable balance.
- Rejected requests remain visible in employee history.

### Leave Policy

- Admin can configure annual Casual Leave.
- Admin can configure annual Sick Leave.
- Admin can configure monthly Earned Leave accrual.
- Carry-forward rules can be configured by leave type.
- Earned Leave is calculated using employee joining date and completed monthly accrual periods.

### Employee Management

- Admin can add employees.
- Admin can specify name, email, password, department, and joining date.
- Employees receive leave entitlement based on the configured policy.

---

## 4. Non-Functional Requirements

- Responsive web interface.
- RESTful API architecture.
- Secure authentication.
- Password hashing.
- Environment-based configuration.
- Cloud-hosted database.
- Independent frontend and backend deployment.
- Source code maintained in GitHub.

---

## 5. System Architecture

```text
Browser
   |
   v
Vercel - React/Vite
   |
   | HTTPS REST API
   v
Render - Node/Express
   |
   | Mongoose
   v
MongoDB Atlas
```

---

## 6. Technology Stack

### Frontend

- React
- Vite
- Material UI
- React Router
- Axios

### Backend

- Node.js
- Express.js
- Mongoose
- MongoDB
- JWT
- bcryptjs
- dotenv
- CORS

### Hosting

- GitHub
- Vercel
- Render
- MongoDB Atlas

---

# 7. Deployment

## 7.1 Hosting

| Component | Hosting |
|---|---|
| Source Code | https://github.com/Lolakshi-Bangera/leave-management-system |
| Frontend | https://leave-management-system-nine-black.vercel.app/ |
| Backend | https://leave-management-system-se4d.onrender.com |
| Database | MongoDB Atlas |

## 7.2 Repository Structure

```text
leave-management-system/
├── frontend/
└── backend/
```

The frontend and backend are maintained in the same GitHub repository but deployed independently.

## 7.3 Frontend Deployment

The `frontend` directory is deployed to Vercel.

Configuration:

```text
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Required environment variable:

```text
VITE_API_URL=https://leave-management-system-se4d.onrender.com/api
```

## 7.4 Backend Deployment

The `backend` directory is deployed as a Render Web Service.

Configuration:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Required environment variables:

```text
MONGODB_URI
JWT_SECRET
CLIENT_URL
```

## 7.5 Database Deployment

MongoDB Atlas is used as the cloud database.

The backend connects using:

```text
MONGODB_URI
```

The database contains collections for users, leave requests, and leave policy configuration.

## 7.6 Deployment Steps

### Initial Deployment

1. Create GitHub repository.
2. Push `frontend` and `backend` folders.
3. Create MongoDB Atlas cluster.
4. Configure MongoDB database user and network access.
5. Create Render Web Service.
6. Set Render root directory to `backend`.
7. Add backend environment variables.
8. Deploy backend.
9. Verify the backend health endpoint.
10. Create Vercel project.
11. Set Vercel root directory to `frontend`.
12. Add `VITE_API_URL` pointing to Render.
13. Deploy frontend.
14. Update Render `CLIENT_URL` with the Vercel URL.
15. Test the complete application flow.

### Application Update

For future changes:

```bash
git add .
git commit -m "Update leave workflow"
git push origin main
```

The connected hosting services can automatically rebuild and redeploy the affected application.

If an environment variable changes, update it in the respective hosting platform and redeploy the affected service.

---

## 8. Required Services

The deployed system requires:

1. GitHub repository
2. Vercel account/project
3. Render Web Service
4. MongoDB Atlas cluster
5. Node.js/npm for local development

---

## 9. Deployment Security

- `.env` files must not be committed.
- MongoDB credentials must be stored as environment variables.
- JWT secret must be stored as an environment variable.
- Production CORS should allow only the deployed frontend origin.
- Strong database credentials should be used.
- Production credentials should not be reused as publicly documented demo credentials.

---

## 10. Acceptance Criteria

The system is considered successfully deployed when:

- Employee can log in.
- Admin can log in.
- Employee can apply for leave.
- Admin can view pending requests.
- Admin can approve/reject leave.
- Employee can view updated leave history.
- Employee leave balance is updated correctly.
- Admin can add employees.
- Joining date is captured.
- Leave policy can be configured.
- Frontend communicates with the deployed backend.
- Backend communicates with MongoDB Atlas.
- No secrets are committed to GitHub.
