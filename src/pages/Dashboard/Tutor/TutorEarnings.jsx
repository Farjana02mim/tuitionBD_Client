import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import { DollarSign, CreditCard, TrendingUp, Calendar, ArrowDownRight } from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const TutorEarnings = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['tutorEarnings'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-earnings');
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Calculating your platform earnings..." />;
  }

  const totalEarnings = data?.totalEarnings || 0;
  const history = data?.history || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-base-200 pb-4">
        <h1 className="text-2xl font-black text-base-content tracking-tight">Earnings & Revenue</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Detailed breakdown of all completed student payments and earnings history.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card bg-gradient-to-br from-primary/10 to-base-100 border border-primary/20 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Accumulated Earnings
            </span>
            <div className="p-2.5 rounded-2xl bg-primary text-primary-content">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-primary">${totalEarnings.toLocaleString()}</div>
          <p className="text-[11px] text-base-content/60">Across {history.length} confirmed tuition assignments</p>
        </div>

        <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Payment Gateway
            </span>
            <div className="p-2.5 rounded-2xl bg-base-200 text-base-content">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-bold text-base-content">Stripe Escrow</div>
          <p className="text-[11px] text-success font-medium flex items-center gap-1">
            <span>●</span> Verified directly via Stripe webhook & server API
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card bg-base-100 border border-base-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-base-200 font-bold text-sm text-base-content">
          Transaction Records
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-base-content/60">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr className="text-base-content/60 border-b border-base-200">
                  <th>Date</th>
                  <th>Student Email</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h._id}>
                    <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                    <td className="font-semibold">{h.studentEmail}</td>
                    <td className="font-mono text-[10px] text-base-content/70">{h.transactionId}</td>
                    <td className="font-bold text-primary">${h.amount}</td>
                    <td>
                      <span className="badge badge-success badge-sm font-semibold uppercase text-[9px]">
                        {h.paymentStatus}
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
