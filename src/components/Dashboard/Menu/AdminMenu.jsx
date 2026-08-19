import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpenCheck,
  BarChart3,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export const AdminMenu = () => {
  return (
    <div className="space-y-1">
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-base-content/40 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span>Admin Panel</span>
      </div>

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
        <span>Admin Dashboard</span>
      </NavLink>

      <NavLink
        to="/dashboard/admin/users"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <Users className="w-4 h-4" />
        <span>Manage Users</span>
      </NavLink>

      <NavLink
        to="/dashboard/admin/tuitions"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <BookOpenCheck className="w-4 h-4" />
        <span>Manage Tuitions</span>
      </NavLink>

      <NavLink
        to="/dashboard/admin/reports"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <BarChart3 className="w-4 h-4" />
        <span>Reports & Analytics</span>
      </NavLink>

      <NavLink
        to="/dashboard/admin/payments"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <CreditCard className="w-4 h-4" />
        <span>Platform Payments</span>
      </NavLink>
    </div>
  );
};
