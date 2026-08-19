import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
import { AdminMenu } from '../Menu/AdminMenu';
import { TutorMenu } from '../Menu/TutorMenu';
import { StudentMenu } from '../Menu/StudentMenu';
import {
  BookOpen,
  LayoutDashboard,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Sparkles,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logOut } = useAuth();
  const [role] = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="bg-base-100/90 backdrop-blur-md text-base-content flex items-center justify-between md:hidden border-b border-base-200 px-4 py-3 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2 font-black text-primary text-lg tracking-tight">
          <div className="p-1.5 bg-primary/10 rounded-xl text-primary">
            <BookOpen className="w-4 h-4" />
          </div>
          <span>TuitionDesk</span>
        </Link>
        <button
          onClick={handleToggle}
          className="btn btn-ghost btn-sm btn-square rounded-xl"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5 text-error" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between overflow-y-auto bg-base-100 w-64 px-4 py-6 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out border-r border-base-200 shadow-sm`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="px-2 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-black text-primary tracking-tight">
              <div className="p-2 bg-primary/10 rounded-2xl text-primary shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>TuitionDesk</span>
            </Link>
            <button onClick={closeSidebar} className="btn btn-ghost btn-xs btn-square md:hidden">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Mini Badge */}
          <div className="bg-base-200/50 rounded-2xl p-3.5 flex items-center gap-3 border border-base-200">
            <div className="avatar">
              <div className="w-10 h-10 rounded-xl border border-primary/20 overflow-hidden">
                <img
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.displayName || 'User'
                    )}&background=0284c7&color=fff`
                  }
                  alt={user?.displayName || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-xs text-base-content truncate">
                {user?.displayName || 'Active User'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="badge badge-primary badge-xs uppercase font-extrabold text-[9px]">
                  {role || 'Student'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              </div>
            </div>
          </div>

          {/* Navigation Menus */}
          <div className="space-y-4" onClick={closeSidebar}>
            {/* Common overview link */}
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-primary text-primary-content shadow-sm'
                    : 'text-base-content/80 hover:bg-base-200'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Workspace Overview</span>
            </NavLink>

            {/* Role specific menus */}
            {role === 'admin' && <AdminMenu />}
            {role === 'tutor' && <TutorMenu />}
            {role === 'student' && <StudentMenu />}
          </div>
        </div>

        {/* Sidebar Footer Links */}
        <div className="pt-4 border-t border-base-200 space-y-1.5" onClick={closeSidebar}>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-base-content/80 hover:bg-base-200'
              }`
            }
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </NavLink>

          <button
            onClick={() => logOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-error hover:bg-error/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
