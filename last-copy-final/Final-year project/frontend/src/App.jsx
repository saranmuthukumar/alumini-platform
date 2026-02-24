import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import { ROLES } from './utils/constants';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard pages
import StudentDashboard from './pages/student/StudentDashboard';
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';

// Student pages
import AlumniDirectory from './pages/student/AlumniDirectory';
import Webinars from './pages/student/Webinars';
import JobBoard from './pages/student/JobBoard';
import Messages from './pages/student/Messages';
import MessageThread from './pages/student/MessageThread';
import Events from './pages/student/Events';

// Alumni pages
import HostWebinar from './pages/alumni/HostWebinar';
import PostJob from './pages/alumni/PostJob';
import Donation from './pages/alumni/Donation';

// Admin pages
import UsersManagement from './pages/admin/UsersManagement';
import ApprovalsPage from './pages/admin/ApprovalsPage';
import Analytics from './pages/admin/Analytics';
import CreateEvent from './pages/admin/CreateEvent';
import ManageContent from './pages/admin/ManageContent';

// Common pages
import Profile from './pages/common/Profile';
import Settings from './pages/common/Settings';

// Resume system pages
import ResumeUpload from './pages/student/ResumeUpload';
import AlumniResumeReview from './pages/alumni/ResumeReview';
import AdminResumes from './pages/admin/AdminResumes';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student routes */}
            <Route
              path="/student"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
                  <StudentDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/student/directory"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
                  <AlumniDirectory />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/student/webinars"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
                  <Webinars />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/student/jobs"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
                  <JobBoard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/student/events"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
                  <Events />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/student/resumes"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
                  <ResumeUpload />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/student/messages"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
                  <Messages />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/student/messages/:id"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
                  <MessageThread />
                </RoleBasedRoute>
              }
            />

            {/* Alumni routes */}
            <Route
              path="/alumni"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ALUMNI]}>
                  <AlumniDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/alumni/webinars/create"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ALUMNI]}>
                  <HostWebinar />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/alumni/jobs/create"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ALUMNI]}>
                  <PostJob />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/alumni/resumes"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ALUMNI]}>
                  <AlumniResumeReview />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/alumni/messages"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ALUMNI]}>
                  <Messages />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/alumni/messages/:id"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ALUMNI]}>
                  <MessageThread />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/alumni/donations"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ALUMNI]}>
                  <Donation />
                </RoleBasedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <UsersManagement />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <ApprovalsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <Analytics />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/admin/jobs/create"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <PostJob />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/admin/events/create"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <CreateEvent />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/admin/resumes"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminResumes />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/admin/manage"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                  <ManageContent />
                </RoleBasedRoute>
              }
            />

            {/* Coordinator routes */}
            <Route
              path="/coordinator"
              element={
                <RoleBasedRoute allowedRoles={[ROLES.COORDINATOR]}>
                  <CoordinatorDashboard />
                </RoleBasedRoute>
              }
            />

            {/* Authorized Common Pages */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized page */}
            <Route
              path="/unauthorized"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="card max-w-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                    <a href="/login" className="btn-primary mt-4 inline-block">
                      Go to Login
                    </a>
                  </div>
                </div>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
