import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import {
  BookOpen,
  PlusCircle,
  Clock,
  CheckCircle2,
  Users,
  CreditCard,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch student's tuitions
  const { data: tuitions, isLoading: isTuitionsLoading } = useQuery({
    queryKey: ['myTuitionsSummary'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-tuitions');
      return res.data?.data || [];
    },
  });

  // Fetch payments made
  const { data: payments, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['studentPaymentsSummary'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-payments');
      return res.data?.data || [];
    },
  });

  if (isTuitionsLoading || isPaymentsLoading) {
    return <LoadingSpinner text="Loading student dashboard metrics..." />;
  }

  const allTuitions = tuitions || [];
  const allPayments = payments || [];

  const pendingCount = allTuitions.filter((t) => t.status === 'pending').length;
  const approvedCount = allTuitions.filter((t) => t.status === 'approved').length;
  const assignedCount = allTuitions.filter((t) => t.status === 'assigned').length;
  const totalSpent = allPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-primary/15 via-primary/5 to-base-100 border border-primary/20 p-6 md:p-8 rounded-3xl space-y-3">
        <div className="badge badge-primary badge-sm font-semibold uppercase text-[10px]">
          Student Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
          Welcome back, {user?.displayName || 'Student'}! 👋
        </h1>
        <p className="text-xs text-base-content/70 max-w-xl">
          Track your active tuition posts, review candidate proposals, and hire certified educators with Stripe escrow.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            to="/dashboard/student/post-tuition"
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Tuition</span>
          </Link>
          <Link
            to="/dashboard/student/applied-tutors"
            className="btn btn-outline btn-sm rounded-xl font-bold gap-2 text-xs"
          >
            <Users className="w-4 h-4" />
            <span>View Tutor Applicants</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Posted
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content">{allTuitions.length}</div>
          <div className="text-[11px] text-base-content/60">Tuition requirements created</div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Pending Review
            </span>
            <div className="p-2.5 rounded-2xl bg-warning/10 text-warning">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-warning">{pendingCount}</div>
          <div className="text-[11px] text-base-content/60">Awaiting admin moderation</div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Active / Hired
            </span>
            <div className="p-2.5 rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-success">{approvedCount + assignedCount}</div>
          <div className="text-[11px] text-base-content/60">{assignedCount} Ongoing with tutors</div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Tuition Escrow Paid
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-primary">${totalSpent.toLocaleString()}</div>
          <div className="text-[11px] text-base-content/60">{allPayments.length} Completed transactions</div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-base-content">Recent Tuition Posts</h2>
          <Link
            to="/dashboard/student/my-tuitions"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {allTuitions.length === 0 ? (
          <div className="text-center py-8 space-y-2 text-xs text-base-content/60">
            <p>You have not posted any tuition requirements yet.</p>
            <Link to="/dashboard/student/post-tuition" className="btn btn-primary btn-xs rounded-lg">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr className="text-base-content/60 border-b border-base-200">
                  <th>Subject & Class</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTuitions.slice(0, 4).map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div>
                        <div className="font-bold text-base-content">{t.subject}</div>
                        <div className="text-[10px] text-base-content/60">Class: {t.class}</div>
                      </div>
                    </td>
                    <td>{t.location}</td>
                    <td className="font-bold text-primary">${t.budget}/mo</td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold uppercase text-[9px] ${
                          t.status === 'approved'
                            ? 'badge-success'
                            : t.status === 'assigned'
                            ? 'badge-info'
                            : t.status === 'rejected'
                            ? 'badge-error'
                            : 'badge-warning'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="text-right">
                      <Link
                        to={`/dashboard/student/applied-tutors?tuitionId=${t._id}`}
                        className="btn btn-primary btn-outline btn-xs rounded-lg"
                      >
                        Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
