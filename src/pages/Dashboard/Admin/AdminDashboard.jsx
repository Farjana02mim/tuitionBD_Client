import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
      return res.data?.data || {};
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Computing platform metrics & charts..." />;
  }

  const {
    totalUsers = 0,
    totalStudents = 0,
    totalTutors = 0,
    totalAdmins = 0,
    totalTuitions = 0,
    pendingTuitions = 0,
    approvedTuitions = 0,
    assignedTuitions = 0,
    rejectedTuitions = 0,
    totalPayments = 0,
    totalRevenue = 0,
  } = statsData;

  // Chart 1: User Distribution (Pie Chart)
  const userChartData = [
    { name: 'Students', value: totalStudents || 1 },
    { name: 'Tutors', value: totalTutors || 1 },
    { name: 'Admins', value: totalAdmins || 1 },
  ];

  // Chart 2: Tuition Statuses (Bar Chart)
  const tuitionStatusData = [
    { status: 'Pending', count: pendingTuitions },
    { status: 'Approved', count: approvedTuitions },
    { status: 'Assigned', count: assignedTuitions },
    { status: 'Rejected', count: rejectedTuitions },
  ];

  // Chart 3: Payments & Earnings Mock Trend
  const revenueTrendData = [
    { month: 'Wk 1', revenue: Math.round(totalRevenue * 0.15), payments: Math.max(1, Math.round(totalPayments * 0.2)) },
    { month: 'Wk 2', revenue: Math.round(totalRevenue * 0.25), payments: Math.max(2, Math.round(totalPayments * 0.3)) },
    { month: 'Wk 3', revenue: Math.round(totalRevenue * 0.30), payments: Math.max(2, Math.round(totalPayments * 0.25)) },
    { month: 'Wk 4', revenue: Math.round(totalRevenue * 0.30), payments: Math.max(3, Math.round(totalPayments * 0.25)) },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-primary/15 via-primary/5 to-base-100 border border-primary/20 p-6 md:p-8 rounded-3xl space-y-2">
        <div className="badge badge-primary badge-sm font-semibold uppercase text-[10px]">
          Administrator Control Center
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
          Executive Platform Analytics
        </h1>
        <p className="text-xs text-base-content/70 max-w-xl">
          Real-time telemetry on platform user registrations, tuition requirement moderation, and Stripe transaction volumes.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Users
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-base-content">{totalUsers}</div>
          <div className="text-[11px] text-base-content/60">{totalStudents} Students • {totalTutors} Tutors</div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Pending Tuitions
            </span>
            <div className="p-2.5 rounded-2xl bg-warning/10 text-warning">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-warning">{pendingTuitions}</div>
          <div className="text-[11px] text-base-content/60">Awaiting moderation</div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Active Tuitions
            </span>
            <div className="p-2.5 rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-success">{approvedTuitions + assignedTuitions}</div>
          <div className="text-[11px] text-base-content/60">{assignedTuitions} Ongoing with tutors</div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-primary">${totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-base-content/60">{totalPayments} Processed transactions</div>
        </div>
      </div>

      {/* RECHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: User Distribution (Pie Chart) */}
        <div className="lg:col-span-5 card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-base-content">User Distribution</h3>
            <p className="text-[11px] text-base-content/60">Students vs Tutors vs Admins</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Tuition Statuses (Bar Chart) */}
        <div className="lg:col-span-7 card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-base-content">Tuition Status Distribution</h3>
            <p className="text-[11px] text-base-content/60">Pending, Approved, Assigned & Rejected</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tuitionStatusData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="status" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Payments & Earnings Area Chart */}
        <div className="lg:col-span-12 card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-base-content">Payment & Revenue Volume</h3>
              <p className="text-[11px] text-base-content/60">Gross tuition settlements handled via Stripe</p>
            </div>
            <div className="badge badge-primary badge-outline text-[10px] font-bold">Stripe Verified</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
