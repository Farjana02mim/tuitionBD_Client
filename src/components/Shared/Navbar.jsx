import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { BookOpen, LogIn, UserPlus, LogOut, LayoutDashboard, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logOut } = useAuth();
  const [role] = useRole();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'font-bold text-primary' : 'text-base-content/80 hover:text-primary transition-colors'
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/tuitions"
          className={({ isActive }) =>
            isActive ? 'font-bold text-primary' : 'text-base-content/80 hover:text-primary transition-colors'
          }
        >
          Tuitions
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/tutors"
          className={({ isActive }) =>
            isActive ? 'font-bold text-primary' : 'text-base-content/80 hover:text-primary transition-colors'
          }
        >
          Tutors
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'font-bold text-primary' : 'text-base-content/80 hover:text-primary transition-colors'
          }
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? 'font-bold text-primary' : 'text-base-content/80 hover:text-primary transition-colors'
          }
        >
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4 md:px-8">
      <div className="navbar-start">
        {/* Mobile dropdown */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-sm lg:hidden mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-2xl w-56 space-y-1 border border-base-200"
          >
            {navLinks}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-primary">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <span>TuitionDesk</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium text-sm">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-primary/20">
              <div className="w-9 rounded-full">
                <img
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.displayName || 'User'
                    )}&background=0284c7&color=fff`
                  }
                  alt={user.displayName || 'User Profile'}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-2xl w-60 border border-base-200"
            >
              <li className="menu-title px-2 py-1.5 border-b border-base-200 mb-2">
                <div className="text-sm font-bold text-base-content truncate">{user.displayName || 'User'}</div>
                <div className="text-xs text-base-content/60 truncate">{user.email}</div>
                <div className="badge badge-primary badge-sm mt-1 uppercase font-semibold text-[10px]">
                  {role}
                </div>
              </li>
              <li>
                <Link to="/dashboard" className="py-2 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/profile" className="py-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Profile Settings
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button onClick={handleLogout} className="text-error hover:bg-error/10 py-2 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm text-xs rounded-xl gap-1">
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm text-xs rounded-xl font-bold gap-1 shadow-sm">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
