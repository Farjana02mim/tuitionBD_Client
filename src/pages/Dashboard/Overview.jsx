import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  FileText,
  DollarSign,
  PlusCircle,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/Shared/LoadingSpinner';

export const Overview = () => {
  const { user } = useAuth();
  const [role, isRoleLoading] = useRole();
  const axiosSecure = useAxiosSecure();

  const { data: adminStats, isLoading: isAdminStatsLoading } = useQuery({
    queryKey: ['adminStats'],
    enabled: role === 'admin',
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
      return res.data?.stats;
    },
  });

  const { data: tutorEarnings, isLoading: isTutorLoading } = useQuery({
    queryKey: ['tutorEarnings'],
    enabled: role === 'tutor',
    queryFn: async () => {
      const res = await axiosSecure.get('/my-earnings');
      return res.data;
    },
  });

  if (isRoleLoading || (role === 'admin' && isAdminStatsLoading) || (role === 'tutor' && isTutorLoading)) {
    return <LoadingSpinner text="Loading dashboard metrics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-primary/15 via-base-100 to-base-100 border border-primary/20 p-6 md:p-8 rounded-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{role} Dashboard</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-base-content">
          Welcome back, {user?.displayName || 'User'}!
        </h1>
        <p className="text-sm text-base-content/70 max-w-xl">
          {role === 'admin' && 'Manage registered users, moderate tuition posts, and review platform payments.'}
          {role === 'tutor' && 'Track your submitted applications, active ongoing tuitions, and earnings.'}
          {role === 'student' && 'Post tuition requirements, review tutor applications, and hire certified teachers.'}
        </p>
      </div>

      {/* Admin Specific Stat Cards */}
      {role === 'admin' && adminStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-base-content/60">Total Users</span>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-black text-base-content mt-2">{adminStats.totalUsers || 0}</div>
            <div className="text-[11px] text-base-content/50 mt-1">
              {adminStats.totalStudents || 0} Students • {adminStats.totalTutors || 0} Tutors
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-base-content/60">Total Tuitions</span>
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-2xl font-black text-base-content mt-2">{adminStats.totalTuitions || 0}</div>
            <div className="text-[11px] text-base-content/50 mt-1">
              {adminStats.pendingTuitions || 0} Pending Moderation
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-base-content/60">Applications</span>
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div className="text-2xl font-black text-base-content mt-2">{adminStats.totalApplications || 0}</div>
            <div className="text-[11px] text-base-content/50 mt-1">
              {adminStats.approvedApplications || 0} Hired / Approved
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-base-content/60">Platform Volume</span>
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div className="text-2xl font-black text-primary mt-2">
              ${adminStats.totalPlatformEarnings?.toLocaleString() || 0}
            </div>
            <div className="text-[11px] text-base-content/50 mt-1">
              {adminStats.totalSuccessfulPayments || 0} Processed Payments
            </div>
          </div>
        </div>
      )}

      {/* Tutor Stat Cards */}
      {role === 'tutor' && tutorEarnings && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-base-content/60">Total Earnings</span>
            <div className="text-2xl font-black text-primary mt-2">
              ${tutorEarnings.totalEarnings?.toLocaleString() || 0}
            </div>
            <div className="text-[11px] text-base-content/50 mt-1">
              {tutorEarnings.totalTuitionsCompleted || 0} Confirmed Hires
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-base-content/60">Pending Applications</span>
            <div className="text-2xl font-black text-base-content mt-2">Active</div>
            <Link to="/dashboard/tutor/my-applications" className="text-xs text-primary font-bold mt-2 hover:underline">
              View Submitted Applications →
            </Link>
          </div>

          <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-base-content/60">Active Students</span>
            <div className="text-2xl font-black text-base-content mt-2">Ongoing</div>
            <Link to="/dashboard/tutor/ongoing" className="text-xs text-primary font-bold mt-2 hover:underline">
              View Ongoing Tuitions →
            </Link>
          </div>
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {role === 'student' && (
          <>
            <Link
              to="/dashboard/student/post-tuition"
              className="card bg-base-100 border border-base-200 p-6 rounded-2xl hover:border-primary transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-content transition-colors">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-base text-base-content mt-4">Post a Tuition Requirement</h3>
              <p className="text-xs text-base-content/60 mt-1">
                Looking for a teacher? Submit your subject, grade, budget, and location.
              </p>
            </Link>

            <Link
              to="/dashboard/student/my-tuitions"
              className="card bg-base-100 border border-base-200 p-6 rounded-2xl hover:border-primary transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-secondary/10 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-secondary-content transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-base-content/40 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-base text-base-content mt-4">Manage My Tuitions & Applicants</h3>
              <p className="text-xs text-base-content/60 mt-1">
                Review applications received, reject applicants, or accept and hire.
              </p>
            </Link>
          </>
        )}

        <Link
          to="/tuitions"
          className="card bg-base-100 border border-base-200 p-6 rounded-2xl hover:border-primary transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:bg-accent group-hover:text-accent-content transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-base-content/40 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-base text-base-content mt-4">Explore Tuition Board</h3>
          <p className="text-xs text-base-content/60 mt-1">
            Browse all live approved tuitions across subjects and regions.
          </p>
        </Link>
      </div>
    </div>
  );
};
