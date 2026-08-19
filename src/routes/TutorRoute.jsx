import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';

export const TutorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, isRoleLoading] = useRole();
  const location = useLocation();

  // Wait for both Firebase auth and role state before redirecting
  if (loading || isRoleLoading) {
    return <LoadingSpinner text="Verifying educator credentials..." fullScreen={true} />;
  }

  if (user && (role === 'tutor' || role === 'admin')) {
    return children;
  }

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};
