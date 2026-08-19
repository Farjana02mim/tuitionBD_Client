import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import { CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const PlatformPayments = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/payments');
      return res.data?.data || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Fetching platform transaction audits..." />;
  }

  const payments = data || [];
  const totalVolume = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-base-200 pb-4">
        <h1 className="text-2xl font-black text-base-content tracking-tight">Platform Payment Audits</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Complete ledger of all verified Stripe transactions processed across the platform.
        </p>
      </div>

      <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-1 shadow-sm">
        <span className="text-xs font-bold text-base-content/60 uppercase">Total Platform Volume</span>
        <div className="text-3xl font-black text-primary">${totalVolume.toLocaleString()} USD</div>
        <p className="text-[11px] text-base-content/50">{payments.length} verified escrow transactions</p>
      </div>

      <div className="card bg-base-100 border border-base-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-xs">
            <thead>
              <tr className="text-base-content/60 border-b border-base-200">
                <th>Date</th>
                <th>Student Email</th>
                <th>Tutor Email</th>
                <th>Transaction / Payment Intent</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="font-semibold">{p.studentEmail}</td>
                  <td>{p.tutorEmail}</td>
                  <td className="font-mono text-[10px] text-base-content/70">{p.transactionId}</td>
                  <td className="font-bold text-primary">${p.amount}</td>
                  <td>
                    <span className="badge badge-success badge-sm font-semibold uppercase text-[9px]">
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
