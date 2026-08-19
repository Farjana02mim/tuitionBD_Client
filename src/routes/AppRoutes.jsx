import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Pages
import { Home } from '../pages/Home';
import { Tuitions } from '../pages/Tuitions';
import { TuitionDetails } from '../pages/TuitionDetails';
import { Tutors } from '../pages/Tutors';
import { TutorProfile } from '../pages/TutorProfile';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ErrorPage } from '../pages/ErrorPage';
import { NotFound } from '../pages/NotFound';

// Dashboard Common Pages
import { Overview } from '../pages/Dashboard/Overview';
import { ProfileSettings } from '../pages/Dashboard/Student/ProfileSettings';

// Student Pages
import { StudentDashboard } from '../pages/Dashboard/Student/StudentDashboard';
import { PostTuition } from '../pages/Dashboard/Student/PostTuition';
import { MyTuitions } from '../pages/Dashboard/Student/MyTuitions';
import { AppliedTutors } from '../pages/Dashboard/Student/AppliedTutors';
import { Payments } from '../pages/Dashboard/Student/Payments';
import { PaymentSuccess } from '../pages/Dashboard/Student/PaymentSuccess';

// Tutor Pages
import { TutorDashboard } from '../pages/Dashboard/Tutor/TutorDashboard';
import { MyApplications } from '../pages/Dashboard/Tutor/MyApplications';
import { OngoingTuitions } from '../pages/Dashboard/Tutor/OngoingTuitions';
import { RevenueHistory } from '../pages/Dashboard/Tutor/RevenueHistory';

// Admin Pages
import { AdminDashboard } from '../pages/Dashboard/Admin/AdminDashboard';
import { ManageUsers } from '../pages/Dashboard/Admin/ManageUsers';
import { ManageTuitions } from '../pages/Dashboard/Admin/ManageTuitions';
import { ReportsAnalytics } from '../pages/Dashboard/Admin/ReportsAnalytics';
import { PlatformPayments } from '../pages/Dashboard/Admin/PlatformPayments';

// Route Guards
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import { TutorRoute } from './TutorRoute';
import { StudentRoute } from './StudentRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'tuitions',
        element: <Tuitions />,
      },
      {
        path: 'tuitions/:id',
        element: <TuitionDetails />,
      },
      {
        path: 'tutors',
        element: <Tutors />,
      },
      {
        path: 'tutors/:id',
        element: <TutorProfile />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'profile',
        element: <ProfileSettings />,
      },
      {
        path: 'payment-success',
        element: <PaymentSuccess />,
      },

      // Student Routes
      {
        path: 'student',
        element: (
          <StudentRoute>
            <StudentDashboard />
          </StudentRoute>
        ),
      },
      {
        path: 'student/post-tuition',
        element: (
          <StudentRoute>
            <PostTuition />
          </StudentRoute>
        ),
      },
      {
        path: 'student/my-tuitions',
        element: (
          <StudentRoute>
            <MyTuitions />
          </StudentRoute>
        ),
      },
      {
        path: 'student/applied-tutors',
        element: (
          <StudentRoute>
            <AppliedTutors />
          </StudentRoute>
        ),
      },
      {
        path: 'student/payments',
        element: (
          <StudentRoute>
            <Payments />
          </StudentRoute>
        ),
      },
      {
        path: 'student/profile',
        element: (
          <StudentRoute>
            <ProfileSettings />
          </StudentRoute>
        ),
      },

      // Tutor Routes
      {
        path: 'tutor',
        element: (
          <TutorRoute>
            <TutorDashboard />
          </TutorRoute>
        ),
      },
      {
        path: 'tutor/my-applications',
        element: (
          <TutorRoute>
            <MyApplications />
          </TutorRoute>
        ),
      },
      {
        path: 'tutor/ongoing',
        element: (
          <TutorRoute>
            <OngoingTuitions />
          </TutorRoute>
        ),
      },
      {
        path: 'tutor/revenue-history',
        element: (
          <TutorRoute>
            <RevenueHistory />
          </TutorRoute>
        ),
      },
      {
        path: 'tutor/earnings',
        element: (
          <TutorRoute>
            <RevenueHistory />
          </TutorRoute>
        ),
      },

      // Admin Routes
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/stats',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/tuitions',
        element: (
          <AdminRoute>
            <ManageTuitions />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/reports',
        element: (
          <AdminRoute>
            <ReportsAnalytics />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/payments',
        element: (
          <AdminRoute>
            <PlatformPayments />
          </AdminRoute>
        ),
      },
    ],
  },
]);
