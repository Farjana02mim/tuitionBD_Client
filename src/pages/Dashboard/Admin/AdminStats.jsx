import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import {
  Users,
  BookOpen,
  DollarSign,
  FileCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#0284c7', '#0d9488', '#f59e0b', '#ef4444'];

export const AdminStats = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
      return res.data?.stats;
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Compiling platform analytics & metrics..." />;
  }

  const stats = data || {};

  const userDistribution = [
    { name: 'Students', value: stats.totalStudents || 0 },
    { name: 'Tutors', value: stats.totalTutors || 0 },
    { name: 'Admins', value: (stats.totalUsers || 0) - (stats.totalStudents || 0) - (stats.totalTutors || 0) },
  ];

  const tuitionDistribution = [
    { name: 'Approved', count: stats.approvedTuitions || 0 },
    { name: 'Pending', count: stats.pendingTuitions || 0 },
    { name: 'Assigned', count: stats.assignedTuitions || 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-base-200 pb-4">
        <h1 className="text-2xl font-black text-base-content tracking-tight">Platform Analytics & Reports</h1>
        <p className="text-xs text-base-content/60 mt-1">
          High-level overview of users, tuition posts, applications, and revenue streams.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Total Users</span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content">{stats.totalUsers || 0}</div>
          <div className="text-[11px] text-base-content/60">
            {stats.totalStudents || 0} Students • {stats.totalTutors || 0} Tutors
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Total Tuitions</span>
            <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content">{stats.totalTuitions || 0}</div>
          <div className="text-[11px] text-warning font-semibold">
            {stats.pendingTuitions || 0} Pending Moderation
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Applications</span>
            <div className="p-2.5 rounded-2xl bg-accent/10 text-accent">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content">{stats.totalApplications || 0}</div>
          <div className="text-[11px] text-success font-semibold">
            {stats.approvedApplications || 0} Approved / Hired
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">Revenue Volume</span>
            <div className="p-2.5 rounded-2xl bg-success/10 text-success">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-primary">
            ${stats.totalPlatformEarnings?.toLocaleString() || 0}
          </div>
          <div className="text-[11px] text-base-content/60">
            {stats.totalSuccessfulPayments || 0} Processed Payments
          </div>
        </div>
      </div>

      {/* Visual Analytics with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tuition Post Status Distribution */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-base-content">Tuition Posts Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tuitionDistribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-base-content">User Demographics by Role</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
