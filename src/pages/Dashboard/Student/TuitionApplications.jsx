import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  Users,
  CreditCard,
  XCircle,
  CheckCircle2,
  ArrowLeft,
  DollarSign,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const TuitionApplications = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['tuitionApplications', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tuitions/${id}/applications`);
      return res.data;
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ applicationId, rejectionReason }) => {
      return await axiosSecure.patch(`/applications/${applicationId}/reject`, { rejectionReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tuitionApplications', id] });
      Swal.fire({
        icon: 'success',
        title: 'Application Rejected',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Action Failed',
        text: error.response?.data?.message || error.message,
      });
    },
  });

  const handleReject = (appId) => {
    Swal.fire({
      title: 'Reject Application?',
      input: 'text',
      inputLabel: 'Reason for rejection (optional)',
      inputPlaceholder: 'e.g. Schedule mismatch or looking for different experience level',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Reject Applicant',
    }).then((result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate({
          applicationId: appId,
          rejectionReason: result.value || 'Application not selected by student',
        });
      }
    });
  };

  const handleAcceptAndPay = async (appId, tutorName, salary) => {
    try {
      Swal.fire({
        title: 'Preparing Secure Checkout',
        text: `Creating Stripe checkout session to hire ${tutorName}...`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await axiosSecure.post('/create-checkout-session', {
        applicationId: appId,
      });

      if (res.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = res.data.url;
      } else {
        throw new Error('Could not obtain checkout session URL');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Checkout Failed',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Fetching applicant profiles..." />;
  }

  const applications = data?.applications || [];
  const tuition = data?.tuition;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link
        to="/dashboard/student/my-tuitions"
        className="inline-flex items-center gap-2 text-xs font-bold text-base-content/60 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Tuitions</span>
      </Link>

      <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="badge badge-primary badge-sm font-semibold text-[10px] mb-1">
              Class: {tuition?.class || 'N/A'}
            </span>
            <h1 className="text-2xl font-black text-base-content">{tuition?.subject || 'Tuition Details'}</h1>
          </div>
          <div className="text-sm font-bold text-primary">Budget: ${tuition?.budget || 0}/mo</div>
        </div>
        <p className="text-xs text-base-content/60">
          Review candidate qualifications below. Accepting a tutor will initiate a secure Stripe escrow checkout.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl space-y-3">
          <Users className="w-12 h-12 text-base-content/30 mx-auto" />
          <h3 className="font-bold text-base text-base-content">No Applications Received Yet</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            Once verified tutors apply to your requirement, their credentials and salary proposals will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 rounded-2xl border border-base-200">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          app.tutorName || 'Tutor'
                        )}&background=0284c7&color=fff`}
                        alt="Tutor Avatar"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-base-content">{app.tutorName || 'Tutor Candidate'}</h3>
                    <p className="text-xs text-base-content/60">{app.tutorEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`badge badge-sm font-bold uppercase text-[10px] ${
                      app.status === 'approved'
                        ? 'badge-success'
                        : app.status === 'rejected'
                        ? 'badge-error'
                        : 'badge-warning'
                    }`}
                  >
                    {app.status}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-base-content/50 block">Expected Salary</span>
                    <span className="font-extrabold text-primary text-base">${app.expectedSalary}/mo</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-base-200/30 p-4 rounded-2xl border border-base-200">
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-base-content block">Academic Qualifications</span>
                    <span className="text-base-content/70">{app.qualifications}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-base-content block">Teaching Experience</span>
                    <span className="text-base-content/70">{app.experience}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {app.status === 'pending' && tuition?.status !== 'assigned' && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleReject(app._id)}
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl gap-1 text-xs"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleAcceptAndPay(app._id, app.tutorName, app.expectedSalary)}
                    className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs shadow-md shadow-primary/20"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Accept & Pay with Stripe</span>
                  </button>
                </div>
              )}

              {app.status === 'approved' && (
                <div className="bg-success/10 text-success p-3 rounded-2xl flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hired & Paid! This tutor is assigned to your tuition.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
