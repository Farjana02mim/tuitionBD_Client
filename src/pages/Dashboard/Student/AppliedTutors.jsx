import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  Users,
  CreditCard,
  XCircle,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  DollarSign,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const AppliedTutors = () => {
  const [searchParams] = useSearchParams();
  const tuitionIdParam = searchParams.get('tuitionId') || '';

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedTuitionId, setSelectedTuitionId] = useState(tuitionIdParam);

  // 1. Fetch student's tuitions for dropdown filter
  const { data: myTuitions } = useQuery({
    queryKey: ['myTuitionsFilterList'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-tuitions');
      return res.data?.data || [];
    },
  });

  // 2. Fetch applications
  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['studentAppliedTutors', selectedTuitionId],
    queryFn: async () => {
      if (selectedTuitionId) {
        const res = await axiosSecure.get(`/tuitions/${selectedTuitionId}/applications`);
        return res.data?.applications || [];
      }
      // If no specific tuition selected, fetch for all student tuitions or general endpoint
      const res = await axiosSecure.get('/my-tuitions');
      const allTuitions = res.data?.data || [];
      const appPromises = allTuitions.map((t) =>
        axiosSecure.get(`/tuitions/${t._id}/applications`).catch(() => ({ data: { applications: [] } }))
      );
      const results = await Promise.all(appPromises);
      const flatApps = results.flatMap((r) => r.data?.applications || []);
      return flatApps;
    },
  });

  // 3. Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ applicationId, rejectionReason }) => {
      return await axiosSecure.patch(`/applications/${applicationId}/reject`, { rejectionReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentAppliedTutors'] });
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
        title: 'Reject Failed',
        text: error.response?.data?.message || error.message,
      });
    },
  });

  const handleReject = (appId) => {
    Swal.fire({
      title: 'Reject Tutor Application?',
      input: 'text',
      inputLabel: 'Reason for rejection (optional)',
      inputPlaceholder: 'e.g. Schedule mismatch or found alternate candidate',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Reject Applicant',
    }).then((result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate({
          applicationId: appId,
          rejectionReason: result.value || 'Application declined by student',
        });
      }
    });
  };

  // 4. Accept & Pay via Stripe Checkout
  const handleAccept = async (appId, tutorName) => {
    try {
      Swal.fire({
        title: 'Creating Stripe Checkout',
        text: `Securing escrow checkout session for ${tutorName}...`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await axiosSecure.post('/create-checkout-session', {
        applicationId: appId,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('Failed to generate Stripe checkout URL.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Setup Failed',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Fetching applicant proposals..." />;
  }

  const applications = applicationsData || [];
  const tuitionsList = myTuitions || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-base-content tracking-tight">Applied Tutor Candidates</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Review tutor credentials, experience, and fee proposals. Accepting initiates secure Stripe escrow.
          </p>
        </div>

        {tuitionsList.length > 0 && (
          <div className="w-full sm:w-64">
            <select
              value={selectedTuitionId}
              onChange={(e) => setSelectedTuitionId(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-xs"
            >
              <option value="">All My Tuitions</option>
              {tuitionsList.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.subject} (Class {t.class})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl space-y-3">
          <Users className="w-12 h-12 text-base-content/30 mx-auto" />
          <h3 className="font-bold text-base text-base-content">No Tutor Applications Found</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            Once certified tutors review and apply to your tuition requirements, their proposals will appear here.
          </p>
          <Link to="/dashboard/student/post-tuition" className="btn btn-primary btn-sm rounded-xl">
            Post Tuition Requirement
          </Link>
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
                    <div className="w-12 h-12 rounded-2xl border border-base-200 overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          app.tutorName || 'Tutor'
                        )}&background=0284c7&color=fff`}
                        alt={app.tutorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-base-content">{app.tutorName || 'Tutor Candidate'}</h3>
                    <p className="text-xs text-base-content/60">{app.tutorEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
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
                    <span className="text-[10px] text-base-content/50 block">Proposed Salary</span>
                    <span className="font-black text-primary text-base">${app.expectedSalary}/mo</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-base-200/30 p-4 rounded-2xl border border-base-200">
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-base-content block">Academic Credentials</span>
                    <span className="text-base-content/80">{app.qualifications}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-base-content block">Teaching Experience</span>
                    <span className="text-base-content/80">{app.experience}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {app.status === 'pending' && (
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-base-200">
                  <button
                    onClick={() => handleReject(app._id)}
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl text-xs gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleAccept(app._id, app.tutorName)}
                    className="btn btn-primary btn-sm rounded-xl font-bold text-xs gap-1.5 shadow-md shadow-primary/20"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Accept & Pay with Stripe</span>
                  </button>
                </div>
              )}

              {app.status === 'approved' && (
                <div className="bg-success/10 text-success p-3 rounded-2xl flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hired & Active: Payment confirmed via Stripe.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
