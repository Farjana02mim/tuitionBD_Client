import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const RevenueHistory = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['tutorRevenueHistory'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tutor/earnings');
      return res.data?.data || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Fetching your earnings & revenue records..." />;
  }

  const payments = data || [];
  const totalEarnings = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-base-200 pb-4">
        <h1 className="text-2xl font-black text-base-content tracking-tight">Revenue & Payout History</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Detailed ledger of verified payments received from students for accepted tuition cohorts.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-primary/10 to-base-100 border border-primary/20 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-primary text-primary-content">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-primary">${totalEarnings.toLocaleString()} USD</div>
          <p className="text-[11px] text-base-content/60">Net earnings from approved student hires</p>
        </div>

        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Paid Contracts
            </span>
            <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-base-content">{payments.length}</div>
          <p className="text-[11px] text-base-content/60">Successful Stripe settlements</p>
        </div>

        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Payout Security
            </span>
            <div className="p-2.5 rounded-2xl bg-success/10 text-success">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-base font-bold text-success flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Stripe Direct Escrow</span>
          </div>
          <p className="text-[11px] text-base-content/60">Automatic escrow transfer upon hiring</p>
        </div>
      </div>

      {/* Revenue Table / Cards */}
      <div className="card bg-base-100 border border-base-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-base-200 font-bold text-sm text-base-content">
          Transaction Records
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center text-xs text-base-content/60 space-y-2">
            <DollarSign className="w-8 h-8 text-base-content/30 mx-auto" />
            <p>No earnings records yet. When students accept your applications and checkout, transactions appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr className="text-base-content/60 border-b border-base-200">
                  <th>Date</th>
                  <th>Student Email</th>
                  <th>Tuition ID</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="font-semibold text-base-content">{p.studentEmail}</td>
                    <td className="font-mono text-[10px] text-base-content/60 truncate max-w-[120px]">
                      {p.tuitionId}
                    </td>
                    <td className="font-mono text-[10px] text-base-content/80">
                      {p.transactionId}
                    </td>
                    <td className="font-bold text-primary">${p.amount} USD</td>
                    <td>
                      <span className="badge badge-success badge-sm font-semibold uppercase text-[9px]">
                        {p.paymentStatus || 'paid'}
                      </span>
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
