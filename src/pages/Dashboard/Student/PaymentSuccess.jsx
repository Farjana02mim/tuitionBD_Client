import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import { CheckCircle, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const axiosSecure = useAxiosSecure();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setErrorMessage('No Stripe session ID found in URL parameters.');
        return;
      }

      try {
        const res = await axiosSecure.post('/verify-payment', { sessionId });
        if (res.data?.success) {
          setData(res.data);
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(res.data?.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage(error.response?.data?.message || error.message);
      }
    };

    verifyPayment();
  }, [sessionId, axiosSecure]);

  if (status === 'verifying') {
    return <LoadingSpinner text="Contacting Stripe gateway to verify payment..." />;
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      {status === 'success' ? (
        <div className="card bg-base-100 border border-success/30 p-8 rounded-3xl text-center space-y-6 shadow-xl shadow-success/5">
          <div className="w-16 h-16 rounded-3xl bg-success/10 text-success flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-base-content">Payment Verified & Tutor Hired!</h1>
            <p className="text-xs text-base-content/60">
              Your Stripe transaction was successfully confirmed. The tutor has been approved and assigned.
            </p>
          </div>

          {data?.payment && (
            <div className="bg-base-200/50 p-4 rounded-2xl text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-base-content/60">Amount Paid:</span>
                <span className="font-bold text-primary">${data.payment.amount} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Transaction ID:</span>
                <span className="font-mono text-[10px] text-base-content">{data.payment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Tutor Contact:</span>
                <span className="font-semibold text-base-content">{data.payment.tutorEmail}</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard/student/my-tuitions"
              className="btn btn-primary btn-block sm:flex-1 rounded-xl font-bold gap-2 text-xs"
            >
              <span>Back to My Tuitions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 border border-error/30 p-8 rounded-3xl text-center space-y-6 shadow-xl shadow-error/5">
          <div className="w-16 h-16 rounded-3xl bg-error/10 text-error flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-base-content">Payment Verification Incomplete</h1>
            <p className="text-xs text-error font-medium">{errorMessage}</p>
          </div>

          <Link
            to="/dashboard/student/my-tuitions"
            className="btn btn-outline btn-block rounded-xl font-bold text-xs"
          >
            Return to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};
