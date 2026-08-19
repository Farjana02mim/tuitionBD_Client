import { Link } from 'react-router-dom';
import { BookOpen, Home, Search, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="card bg-base-100 border border-base-200 p-8 sm:p-12 rounded-3xl max-w-lg shadow-xl space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-3xl font-black">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs w-full sm:w-auto shadow-sm">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link to="/tuitions" className="btn btn-outline btn-sm rounded-xl font-bold gap-2 text-xs w-full sm:w-auto">
            <Search className="w-4 h-4" />
            <span>Explore Tuitions</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
