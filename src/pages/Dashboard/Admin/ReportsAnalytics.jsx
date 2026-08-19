import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Download,
  BarChart2,
  ShieldCheck,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const ReportsAnalytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['adminFullReports'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
      return res.data?.data || {};
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Compiling executive platform reports..." />;
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
    totalApplications = 0,
    totalPayments = 0,
    totalRevenue = 0,
  } = data;

  const handleExportSummary = () => {
    const reportSummary = `--- TUITIONDESK EXECUTIVE PLATFORM REPORT ---
Generated: ${new Date().toISOString()}

1. USER METRICS
- Total Users: ${totalUsers}
- Students: ${totalStudents}
- Tutors: ${totalTutors}
- Admins: ${totalAdmins}

2. TUITION METRICS
- Total Tuitions Posted: ${totalTuitions}
- Pending Moderation: ${pendingTuitions}
- Approved & Live: ${approvedTuitions}
- Assigned Cohorts: ${assignedTuitions}
- Rejected: ${rejectedTuitions}

3. APPLICATIONS & FINANCIALS
- Total Tutor Applications: ${totalApplications}
- Successful Stripe Payments: ${totalPayments}
- Total Escrow Volume: $${totalRevenue.toLocaleString()} USD
`;

    const blob = new Blob([reportSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TuitionDesk_Executive_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-base-content tracking-tight">Executive Platform Reports</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Holistic audit report summarizing user growth, tuition pipeline, applications, and revenue milestones.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="btn btn-primary btn-sm rounded-xl font-bold text-xs gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* 9 Core Metric Cards in 3x3 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Total Users */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Users
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-base-content">{totalUsers}</div>
          <p className="text-xs text-base-content/60">Registered community members</p>
        </div>

        {/* 2. Total Students */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Students
            </span>
            <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-secondary">{totalStudents}</div>
          <p className="text-xs text-base-content/60">Learners & parent accounts</p>
        </div>

        {/* 3. Total Tutors */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Tutors
            </span>
            <div className="p-2.5 rounded-2xl bg-accent/10 text-accent">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-accent">{totalTutors}</div>
          <p className="text-xs text-base-content/60">Verified subject educators</p>
        </div>

        {/* 4. Total Tuitions */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Tuitions
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-base-content">{totalTuitions}</div>
          <p className="text-xs text-base-content/60">Created across all subjects</p>
        </div>

        {/* 5. Pending Tuitions */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Pending Tuitions
            </span>
            <div className="p-2.5 rounded-2xl bg-warning/10 text-warning">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-warning">{pendingTuitions}</div>
          <p className="text-xs text-base-content/60">In review queue</p>
        </div>

        {/* 6. Approved Tuitions */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Approved Tuitions
            </span>
            <div className="p-2.5 rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-success">{approvedTuitions}</div>
          <p className="text-xs text-base-content/60">Live for tutor applications</p>
        </div>

        {/* 7. Total Applications */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Applications
            </span>
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-base-content">{totalApplications}</div>
          <p className="text-xs text-base-content/60">Proposals submitted by tutors</p>
        </div>

        {/* 8. Total Successful Payments */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Successful Payments
            </span>
            <div className="p-2.5 rounded-2xl bg-success/10 text-success">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-success">{totalPayments}</div>
          <p className="text-xs text-base-content/60">Stripe checkout settlements</p>
        </div>

        {/* 9. Total Earnings */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Earnings / Volume
            </span>
            <div className="p-2.5 rounded-2xl bg-primary text-primary-content">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-primary">${totalRevenue.toLocaleString()} USD</div>
          <p className="text-xs text-base-content/60">Gross tuition escrow volume</p>
        </div>
      </div>
    </div>
  );
};
