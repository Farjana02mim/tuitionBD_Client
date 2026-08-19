import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import {
  FileText,
  Clock,
  CheckCircle2,
  BookOpen,
  DollarSign,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const TutorDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch tutor's applications
  const { data: applications, isLoading: isAppsLoading } = useQuery({
    queryKey: ['tutorApplicationsSummary'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-applications');
      return res.data?.data || [];
    },
  });

  // Fetch tutor's ongoing tuitions
  const { data: ongoingTuitions, isLoading: isOngoingLoading } = useQuery({
    queryKey: ['tutorOngoingSummary'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-ongoing-tuitions');
      return res.data?.data || [];
    },
  });

  // Fetch tutor's payments / revenue
  const { data: payments, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['tutorRevenueSummary'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tutor/earnings');
      return res.data?.data || [];
    },
  });

  if (isAppsLoading || isOngoingLoading || isPaymentsLoading) {
    return <LoadingSpinner text="Loading tutor dashboard metrics..." />;
  }

  const allApps = applications || [];
  const allOngoing = ongoingTuitions || [];
  const allPayments = payments || [];

  const totalApplications = allApps.length;
  const pendingApplications = allApps.filter((a) => a.status === 'pending').length;
  const approvedApplications = allApps.filter((a) => a.status === 'approved').length;
  const ongoingTuitionsCount = allOngoing.length;
  const totalEarnings = allPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-primary/15 via-primary/5 to-base-100 border border-primary/20 p-6 md:p-8 rounded-3xl space-y-3">
        <div className="badge badge-primary badge-sm font-semibold uppercase text-[10px]">
          Tutor Workspace
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
          Welcome back, {user?.displayName || 'Educator'}! 🎓
        </h1>
        <p className="text-xs text-base-content/70 max-w-xl">
          Track your active applications, monitor approved student assignments, and manage your verified Stripe earnings.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            to="/tuitions"
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Browse New Tuitions</span>
          </Link>
          <Link
            to="/dashboard/tutor/my-applications"
            className="btn btn-outline btn-sm rounded-xl font-bold gap-2 text-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Review Applications</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Applications */}
        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Apps
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content">{totalApplications}</div>
          <div className="text-[11px] text-base-content/60">Proposals submitted</div>
        </div>

        {/* Pending Applications */}
        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Pending
            </span>
            <div className="p-2.5 rounded-2xl bg-warning/10 text-warning">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-warning">{pendingApplications}</div>
          <div className="text-[11px] text-base-content/60">Under student review</div>
        </div>

        {/* Approved Applications */}
        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Approved
            </span>
            <div className="p-2.5 rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-success">{approvedApplications}</div>
          <div className="text-[11px] text-base-content/60">Accepted & paid via escrow</div>
        </div>

        {/* Ongoing Tuitions */}
        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Ongoing
            </span>
            <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-secondary">{ongoingTuitionsCount}</div>
          <div className="text-[11px] text-base-content/60">Active tutoring cohorts</div>
        </div>

        {/* Total Earnings */}
        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Earnings
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-primary">${totalEarnings.toLocaleString()}</div>
          <div className="text-[11px] text-base-content/60">{allPayments.length} Payout records</div>
        </div>
      </div>

      {/* Recent Applications Feed */}
      <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-base-content">Recent Applications Status</h2>
          <Link
            to="/dashboard/tutor/my-applications"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {allApps.length === 0 ? (
          <div className="text-center py-8 space-y-2 text-xs text-base-content/60">
            <p>You haven't submitted any tuition applications yet.</p>
            <Link to="/tuitions" className="btn btn-primary btn-xs rounded-lg">
              Explore Available Tuitions
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr className="text-base-content/60 border-b border-base-200">
                  <th>Tuition Subject</th>
                  <th>Location</th>
                  <th>Expected Salary</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {allApps.slice(0, 4).map((app) => (
                  <tr key={app._id}>
                    <td className="font-bold text-base-content">
                      {app.tuitionSubject || 'General Tuition Requirement'}
                    </td>
                    <td>{app.tuitionLocation || 'Online / Remote'}</td>
                    <td className="font-bold text-primary">${app.expectedSalary}/mo</td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold uppercase text-[9px] ${
                          app.status === 'approved'
                            ? 'badge-success'
                            : app.status === 'rejected'
                            ? 'badge-error'
                            : 'badge-warning'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="text-right">
                      <Link
                        to="/dashboard/tutor/my-applications"
                        className="btn btn-ghost btn-xs rounded-lg text-primary"
                      >
                        Details
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
