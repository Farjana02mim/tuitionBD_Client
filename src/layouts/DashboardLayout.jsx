import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Dashboard/Sidebar/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { Bell, Home, ChevronRight } from 'lucide-react';

export const DashboardLayout = () => {
  const { user } = useAuth();
  const [role] = useRole();
  const location = useLocation();

  // Generate breadcrumb path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="relative min-h-screen md:flex bg-base-200/40 text-base-content antialiased">
      {/* Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-base-100/80 backdrop-blur-md border-b border-base-200 sticky top-0 z-30">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1;
              const formatted = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-base-content/40" />
                  <span className={isLast ? 'text-primary font-bold' : 'text-base-content/70'}>
                    {formatted}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] font-bold text-base-content block leading-none">
                {user?.displayName || 'User Workspace'}
              </span>
              <span className="text-[10px] text-base-content/50 uppercase font-semibold">
                {role || 'Student'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full border border-primary/20 overflow-hidden">
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.displayName || 'User'
                  )}&background=0284c7&color=fff`
                }
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Child Routes */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
