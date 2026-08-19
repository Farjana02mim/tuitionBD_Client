import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home, Search, RefreshCw, ArrowLeft } from 'lucide-react';

export const ErrorPage = () => {
  const error = useRouteError();
  const status = error?.status || 404;
  const statusText = error?.statusText || 'Page Not Found';
  const errorMessage =
    error?.data?.message ||
    error?.message ||
    "The page you're looking for doesn't exist, has been moved, or an unexpected error occurred.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200/40 px-4 py-16">
      <div className="card bg-base-100 border border-base-200 p-8 sm:p-12 rounded-3xl max-w-lg w-full shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-error/10 text-error flex items-center justify-center font-black text-4xl shadow-inner">
          <AlertTriangle className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <div className="badge badge-error badge-outline font-bold text-xs uppercase tracking-wider">
            Status: {status}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
            {status === 404 ? 'Lost in Navigation?' : statusText}
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 max-w-md mx-auto leading-relaxed">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-base-200">
          <Link
            to="/"
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs w-full sm:w-auto shadow-md shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/tuitions"
            className="btn btn-outline btn-sm rounded-xl font-bold gap-2 text-xs w-full sm:w-auto"
          >
            <Search className="w-4 h-4" />
            <span>Explore Tuitions</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
