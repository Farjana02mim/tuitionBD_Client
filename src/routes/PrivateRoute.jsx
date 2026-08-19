import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for Firebase authentication state to finish loading before deciding whether a user is authenticated
  if (loading) {
    return <LoadingSpinner text="Verifying authentication session..." fullScreen={true} />;
  }

  if (user) {
    return children;
  }

  // Redirect to login preserving the intended destination
  return <Navigate to="/login" state={{ from: location }} replace />;
};
