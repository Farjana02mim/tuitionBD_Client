import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  FileText,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  History,
} from 'lucide-react';

export const TutorMenu = () => {
  return (
    <div className="space-y-1">
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-base-content/40 flex items-center gap-1.5">
        <GraduationCap className="w-3.5 h-3.5 text-primary" />
        <span>Tutor Workspace</span>
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
        <span>Tutor Dashboard</span>
      </NavLink>

      <NavLink
        to="/tuitions"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <Search className="w-4 h-4" />
        <span>Browse Tuitions</span>
      </NavLink>

      <NavLink
        to="/dashboard/tutor/my-applications"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <FileText className="w-4 h-4" />
        <span>My Applications</span>
      </NavLink>

      <NavLink
        to="/dashboard/tutor/ongoing"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Ongoing Tuitions</span>
      </NavLink>

      <NavLink
        to="/dashboard/tutor/revenue-history"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
            isActive
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/80 hover:bg-base-200'
          }`
        }
      >
        <History className="w-4 h-4" />
        <span>Revenue History</span>
      </NavLink>
    </div>
  );
};
