# Alumni Management Platform

A production-ready MERN stack web application for centralized alumni data management, group mentorship, and knowledge sharing.

## 🚀 Features

### Multi-Role Access System
- **Admin**: User management, platform analytics, content moderation
- **Alumni**: Profile management, host webinars, post jobs, make donations
- **Student**: Browse alumni directory, register for webinars, apply for jobs, attend events
- **Coordinator**: Content moderation, event management, engagement tracking

### Core Modules
- 📚 **Alumni Directory**: Searchable directory with privacy controls
- 🎓 **Group Mentorship Webinars**: Alumni-led sessions for all students
- 💼 **Job Board**: Job postings with application tracking
- 📅 **Events Management**: Alumni meets, career talks, workshops
- 💰 **Donation Tracking**: Support institutional development

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt password hashing
- CORS + Helmet security

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios with interceptors
- Context API for state management

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alumni-platform
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-key
CORS_ORIGIN=http://localhost:5173
```

Run backend:
```bash
# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:
```bash
npm run dev
```

## 🧪 Sample Credentials

After running the seed script, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | Admin@123 |
| Coordinator | coordinator@university.edu | Coordinator@123 |
| Alumni | john.doe@alumni.edu | Alumni@123 |
| Alumni | jane.smith@alumni.edu | Alumni@123 |
| Student | student1@university.edu | Student@123 |
| Student | student2@university.edu | Student@123 |

## 📁 Project Structure

### Backend
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Auth, RBAC, error handling
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── seeds/           # Database seed scripts
│   └── app.js           # Express app
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── context/         # React Context
│   ├── routes/          # Protected routes
│   ├── utils/           # API client, constants
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
└── package.json
```

## 🔐 Security Features

- JWT access & refresh tokens
- Password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Protected API routes
- Input validation
- XSS protection (Helmet)
- CORS configuration
- Automatic token refresh

## 🎯 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Alumni
- GET `/api/alumni` - Get alumni directory
- GET `/api/alumni/:id` - Get alumni profile
- PUT `/api/alumni/:id` - Update alumni profile
- PUT `/api/alumni/:id/approve` - Approve alumni (Admin only)

### Webinars
- GET `/api/webinars` - Get all webinars
- POST `/api/webinars` - Create webinar (Alumni)
- POST `/api/webinars/:id/register` - Register for webinar
- PUT `/api/webinars/:id/approve` - Approve webinar (Admin/Coordinator)
- PUT `/api/webinars/:id/feedback` - Submit feedback

### Jobs
- GET `/api/jobs` - Get all jobs
- POST `/api/jobs` - Post job (Alumni)
- POST `/api/jobs/:id/apply` - Apply for job (Student)
- PUT `/api/jobs/:id/approve` - Approve job (Admin)

### Events
- GET `/api/events` - Get all events
- POST `/api/events` - Create event (Admin/Coordinator)
- POST `/api/events/:id/register` - Register for event

### Donations
- POST `/api/donations` - Make donation (Alumni)
- GET `/api/donations/my-donations` - Get user donations
- GET `/api/donations/stats` - Get donation statistics (Admin)

## 🔄 Development Workflow

1. Start MongoDB
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm run dev`
4. Access application: `http://localhost:5173`
5. Login with sample credentials

## 📝 Key Features Implementation

### Alumni Directory
- Privacy levels: Public, Students+Alumni, Hidden
- Full-text search on name, skills, organization
- Filters: Department, Batch, Career Domain
- Pagination support

### Webinar System
- Alumni create and host webinars
- Admin/Coordinator approval required
- Student/Alumni registration
- Attendance tracking
- Post-webinar feedback and ratings
- Resource sharing (PDFs, links, recordings)

### Job Board
- Alumni post job opportunities
- Admin moderation
- Student applications with resume/cover letter
- Application status tracking
- Job status: Open/Closed

### RBAC Protection
- Middleware-based authorization
- Frontend route guards
- API endpoint protection
- Role-specific dashboard access

## 🚀 Deployment

### Backend (Railway/Render/DigitalOcean)
1. Set environment variables
2. Configure MongoDB Atlas
3. Deploy backend
4. Update CORS_ORIGIN

### Frontend (Vercel/Netlify)
1. Set VITE_API_URL to backend URL
2. Build: `npm run build`
3. Deploy dist folder

## 📊 Database Models

- **User**: Authentication & role management
- **AlumniProfile**: Extended alumni data with privacy
- **StudentProfile**: Student information
- **Webinar**: Webinar details, registrations, feedback
- **Job**: Job postings and applications
- **Event**: Event management and registrations
- **Donation**: Donation tracking and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👥 Authors

Built as a final year project for university alumni engagement.

## 🆘 Support

For issues or questions, please open an issue in the repository.

---

**Note**: This is a production-ready application with comprehensive security, scalable architecture, and modular design. All features are fully functional and tested.
