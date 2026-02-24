# Alumni Management Platform - Project Analysis & Documentation

## 1. Project Overview
A production-ready MERN stack web application designed for centralized alumni data management, group mentorship, and knowledge sharing. The platform connects students, alumni, and administrators to facilitate career growth and institutional development.

---

## 2. Technology Stack

### Backend
- **Runtime Environment:** Node.js (v18+)
- **Framework:** Express.js (v5.2.1)
- **Database:** MongoDB (v6+) with Mongoose (v9.1.1) Object Data Modeling (ODM)
- **Authentication:** JSON Web Tokens (JWT) for stateless authentication
- **Security:**
  - `bcryptjs`: Password hashing
  - `helmet`: HTTP headers security
  - `cors`: Cross-Origin Resource Sharing
  - `express-validator`: Input validation
- **Dev Tools:** `nodemon` for hot reloading

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite (v7.2.4)
- **Styling:** Tailwind CSS (v3.4.1) & PostCSS
- **Routing:** React Router DOM (v7.11.0)
- **HTTP Client:** Axios (v1.13.2)
- **State Management:** React Context API (AuthContext, NotificationContext)
- **UI Libraries:**
  - `framer-motion`: Animations
  - `react-toastify`: Toast notifications
  - `date-fns`: Date manipulation

---

## 3. Architecture & Directory Structure

### Backend Structure (`/backend`)
The backend follows a MVC (Model-View-Controller) pattern with a service-oriented architecture approach.

| Directory/File | Description |
|---|---|
| `src/config/` | Configuration files (e.g., Database connection) |
| `src/controllers/` | Request handlers containing business logic |
| `src/middlewares/` | Custom middlewares (Auth, Role-based Access Control, Error handling) |
| `src/models/` | Mongoose schemas defining data structure |
| `src/routes/` | API route definitions mapping endpoints to controllers |
| `src/seeds/` | scripts to populate the database with initial data |
| `src/utils/` | Utility functions (helpers, constants) |
| `src/app.js` | Main application entry point, middleware setup |

### Frontend Structure (`/frontend`)
The frontend is a Single Page Application (SPA) built with React.

| Directory/File | Description |
|---|---|
| `src/assets/` | Static assets (images, icons) |
| `src/components/` | Reusable UI components |
| `src/context/` | Global state providers (Auth, Notifications) |
| `src/pages/` | Page components organized by user role |
| `src/routes/` | Route protection logic (`ProtectedRoute`, `RoleBasedRoute`) |
| `src/utils/` | Helper functions and constants (API clients) |
| `src/App.jsx` | Main application component with Route definitions |
| `src/main.jsx` | Application entry point |

---

## 4. Database Schema (Models)

The application uses the following Mongoose models to structure data:

1.  **User (`User.js`)**: Core authentication model. Stores credentials, roles (Admin, Alumni, Student, Coordinator), and base profile info.
2.  **AlumniProfile (`AlumniProfile.js`)**: Extended profile for alumni. Includes work history, skills, privacy settings, and graduation details.
3.  **StudentProfile (`StudentProfile.js`)**: Extended profile for students. Includes academic details, resume links, and interests.
4.  **Webinar (`Webinar.js`)**: Stores webinar sessions created by alumni. Includes topic, date, host, and registration list.
5.  **Job (`Job.js`)**: Job postings created by alumni/admin. Tracks applicants and job status.
6.  **Event (`Event.js`)**: Institutional events. Manages RSVPs and event details.
7.  **Donation (`Donation.js`)**: Records financial contributions from alumni.

---

## 5. API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Authenticate user and receive tokens
- `POST /refresh`: Refresh access token
- `POST /logout`: Invalidate session

### Alumni Operations (`/api/alumni`)
- `GET /`: List all alumni (with filters)
- `GET /:id`: View specific alumni profile
- `PUT /:id`: Update profile
- `PUT /:id/approve`: Admin approval for new alumni profiles

### Webinars (`/api/webinars`)
- `GET /`: List upcoming/past webinars
- `POST /`: Create a new webinar (Alumni)
- `POST /:id/register`: Register for a webinar
- `PUT /:id/feedback`: Submit feedback

### Jobs (`/api/jobs`)
- `GET /`: Browsable job board
- `POST /`: Post a new job opening
- `POST /:id/apply`: Submit job application (Student)

### Events (`/api/events`)
- `GET /`: List events
- `POST /`: create event (Admin/Coordinator)
- `POST /:id/rsvp`: RSVP to event

### Donations (`/api/donations`)
- `POST /`: Process a donation
- `GET /stats`: Admin view of donation statistics

---

## 6. Frontend Application Flow

### Role-Based Access Control (RBAC)
The frontend implements strict route protection validation based on user roles:
- **Public:** Login, Register
- **Student:** Can access Directory, Webinars, Job Board, Events, Resume Upload.
- **Alumni:** Can access Dashboard, Host Webinar, Post Job, Resume Review.
- **Admin:** Full access to User Management, Approvals (Jobs/Webinars/Users), Analytics.
- **Coordinator:** Access to Dashboard for managing events/content.

### Key Features
1.  **Dashboard:** Personalized view for each role showing relevant stats and quick actions.
2.  **Alumni Directory:** Searchable list of alumni with filters for networking.
3.  **Webinar System:** End-to-end system for scheduling, approving, and attending webinars.
4.  **Job Board:** Platform for alumni to share opportunities and students to apply.
5.  **Resume Operations:** Students upload resumes; Alumni/Admin review and provide feedback.
6.  **Messaging:** Internal messaging system for networking.
7.  **Theme Customization:** Complete support for Dark/Light mode preferences.

---

## 7. Security Implementation
- **JWT Authentication:** Secure, stateless session management.
- **Password Hashing:** `bcryptjs` ensures passwords are never stored in plain text.
- **Protected Routes:** Frontend components check for valid tokens and correct roles before rendering.
- **Environment Variables:** Sensitive data (DB URI, Secrets) stored in `.env` files.
- **CORS Policies:** Restricts API access to the trusted frontend domain.

---

## 8. Setup Instructions

1.  **Prerequisites:** Install Node.js (v18+), MongoDB.
2.  **Clone Repository:** `git clone <repo_url>`
3.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create .env with MONGODB_URI, JWT_SECRET, etc.
    npm run seed # Optional: Seed sample data
    npm run dev
    ```
4.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    # Create .env with VITE_API_URL
    npm run dev
    ```
5.  **Access:** Open `http://localhost:5173` in your browser.

---

## 9. Core Application Workflows

### A. User Onboarding Flow
1.  **Registration:** User signs up and selects a role (Student/Alumni).
2.  **Verification:**
    *   **Students:** Account is active immediately (or pending email verification if configured).
    *   **Alumni:** Account status is set to `pending`.
3.  **Approval (Alumni only):** Admin reviews the profile details and approves the account.
4.  **Login:** Validated users log in and receive a JWT access token.

### B. Webinar Lifecycle
1.  **Creation:** Alumni navigates to "Host Webinar", fills details, and submits. Status: `pending`.
2.  **Moderation:** Admin/Coordinator views the webinar in "Approvals" and accepts it. Status: `upcoming`.
3.  **Registration:** Students view the webinar list and click "Register".
4.  **Execution:** Webinar link becomes active at the scheduled time.
5.  **Completion:** After the event, the status updates to `completed`.
6.  **Feedback:** Attendees can submit ratings and feedback.

### C. Job Recruitment Process
1.  **Posting:** Alumni/Admin posts a new job opportunity.
2.  **Approval:** Admin verifies the job posting.
3.  **Application:** Students upload resumes and apply for the job.
4.  **Review:** The poster (Alumni) views applications and downloads resumes.
5.  **Selection:** offline interview process ensues.

### D. Resume Review System
1.  **Upload:** Student uploads a PDF resume.
2.  **Assignment:** Resume enters a pool visible to Alumni/Admins.
3.  **Feedback:** Alumni selects a resume, reviews it, and adds comments/suggestions.
4.  **Notification:** Student receives feedback and can upload a revised version.

---

## 10. Dashboard Overview & Workflows

### A. Admin Dashboard
**Primary Goal:** Platform oversight and moderation.
- **Key Stats:**
    - Total User Base
    - Pending Alumni Approvals
    - Content Moderation Queue (Webinars, Jobs)
- **Workflow:**
    1.  **User Verification:** Admin sees `Pending Alumni` count → Clicks to view list → Reviews details (Batch, Dept) → Clicks **Approve** → Alumni gets email notification.
    2.  **Content Approval:** Admin tracks pending Job/Webinar requests -> Navigates to Approvals page -> Validates content -> Approves/Rejects.

### B. Alumni Dashboard
**Primary Goal:** Contribution and networking.
- **Key Stats:**
    - Webinars Hosted
    - Jobs Posted
    - Total Donations
    - Students Mentored
- **Workflow:**
    1.  **Host Webinar:** Click "Host Webinar" → Fill topic, date, time → Status: `Pending` → Wait for Admin Approval → Conduct session.
    2.  **Post Job:** Click "Post Job" → Enter role, company, requirements → Status: `Pending` → View applications after approval.
    3.  **Track Impact:** Monitor registration counts for webinars and application counts for posted jobs directly from the dashboard cards.

### C. Student Dashboard
**Primary Goal:** Learning and career advancement.
- **Key Stats:**
    - Upcoming Webinars (Registered)
    - Active Job Applications
    - Upcoming Events
- **Workflow:**
    1.  **Webinar Participation:** Dashboard shows "Upcoming Webinars" -> Click "Register" -> Event moves to "My Schedule".
    2.  **Job Application:** Dashboard shows "Latest Openings" -> Click "Apply" -> Upload/Select Resume -> status updates to `Applied`.
    3.  **Profile Status:** Students can see if their profile is complete and view their current academic details (Roll No, Dept) at a glance.
