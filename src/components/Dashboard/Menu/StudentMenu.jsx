import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Users,
  CreditCard,
  UserCheck,
  BookOpen,
} from 'lucide-react';

export const StudentMenu = () => {
  return (
    <div className="space-y-1">
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-base-content/40 flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-primary" />
        <span>Student Workspace</span>
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
        <span>Student Dashboard</span>
      </NavLink>

      <NavLink
        to="/dashboard/student/post-tuition"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <PlusCircle className="w-4 h-4" />
        <span>Post New Tuition</span>
      </NavLink>

      <NavLink
        to="/dashboard/student/my-tuitions"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <ListOrdered className="w-4 h-4" />
        <span>My Tuitions</span>
      </NavLink>

      <NavLink
        to="/dashboard/student/applied-tutors"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <Users className="w-4 h-4" />
        <span>Applied Tutors</span>
      </NavLink>

      <NavLink
        to="/dashboard/student/payments"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <CreditCard className="w-4 h-4" />
        <span>Payment History</span>
      </NavLink>
    </div>
  );
};
