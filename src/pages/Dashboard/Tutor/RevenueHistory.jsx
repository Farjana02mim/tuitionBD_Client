import { useEffect, useState } from 'react';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';
import { formatMongoId, safeDateString } from '../../../utils/formatters';

export const RevenueHistory = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axiosSecure.get('/my-earnings');
        setPayments(res.data?.data || res.data?.payments || []);
        setSummary(res.data?.summary || null);
      } catch (err) {
        console.error('Error loading earnings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner />;

  const totalEarned = summary?.totalEarnings ?? payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-base-content tracking-tight">Revenue & Earnings</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Complete ledger of tuition stipends received through secure student payments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl flex flex-row items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-base-content/60">Total Earnings</p>
            <p className="text-2xl font-black text-base-content">${totalEarned} USD</p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl flex flex-row items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-base-content/60">Paid Invoices</p>
            <p className="text-2xl font-black text-base-content">{payments.length}</p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 rounded-2xl flex flex-row items-center gap-4">
          <div className="p-3 bg-info/10 text-info rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-base-content/60">Payment Status</p>
            <p className="text-xs font-bold text-success flex items-center gap-1 mt-1">
              Verified & Direct
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-base-200">
          <h2 className="font-bold text-sm text-base-content">Disbursed Payments</h2>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center text-base-content/50 text-xs">
            No completed payments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm text-xs">
              <thead className="bg-base-200/50 text-base-content/70">
                <tr>
                  <th>Date</th>
                  <th>Student Email</th>
                  <th>Tuition ID</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => (
                  <tr key={formatMongoId(p._id) || idx}>
                    <td>{safeDateString(p.createdAt)}</td>
                    <td className="font-semibold text-base-content">{p.studentEmail}</td>
                    <td className="font-mono text-[10px] text-base-content/60 truncate max-w-[120px]" title={formatMongoId(p.tuitionId)}>
                      {formatMongoId(p.tuitionId)}
                    </td>
                    <td className="font-mono text-[10px] text-base-content/80">
                      {formatMongoId(p.transactionId)}
                    </td>
                    <td className="font-bold text-primary">${p.amount} USD</td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
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

export default RevenueHistory;