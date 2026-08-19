import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  BookOpenCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
  User,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const ManageTuitions = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('');

  // 1. Fetch Tuitions (Admin)
  const { data, isLoading } = useQuery({
    queryKey: ['adminTuitionsList', statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      const res = await axiosSecure.get(`/admin/tuitions?${params.toString()}`);
      return res.data?.data || [];
    },
  });

  // 2. Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }) => {
      return await axiosSecure.patch(`/admin/tuitions/${id}/status`, { status, rejectionReason });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminTuitionsList'] });
      Swal.fire({
        icon: 'success',
        title: `Tuition ${variables.status === 'approved' ? 'Approved' : 'Rejected'}`,
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

  const handleApprove = (id, subject) => {
    Swal.fire({
      title: 'Approve Tuition Requirement?',
      text: `Approve "${subject}" to become publicly visible for all verified tutors?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Yes, Approve',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ id, status: 'approved' });
      }
    });
  };

  const handleReject = (id, subject) => {
    Swal.fire({
      title: 'Reject Tuition Requirement?',
      input: 'text',
      inputLabel: 'Reason for rejection (optional)',
      inputPlaceholder: 'e.g. Inappropriate content, unrealistic budget, or duplicate post',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Reject Requirement',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({
          id,
          status: 'rejected',
          rejectionReason: result.value || 'Moderated by platform administrator',
        });
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Fetching tuition requirements for moderation..." />;
  }

  const tuitions = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-base-content tracking-tight">Tuition Moderation</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Review submitted tuition requirements. Approve valid postings or reject with clear feedback.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select select-bordered select-sm rounded-xl text-xs w-full sm:w-44"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending Moderation</option>
          <option value="approved">Approved & Active</option>
          <option value="assigned">Assigned with Tutor</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card bg-base-100 border border-base-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-base-200 font-bold text-xs text-base-content">
          Tuition Requirements ({tuitions.length})
        </div>

        {tuitions.length === 0 ? (
          <div className="p-12 text-center text-xs text-base-content/60">
            No tuition records found matching this status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr className="text-base-content/60 border-b border-base-200">
                  <th>Subject & Class</th>
                  <th>Student Email</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th className="text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {tuitions.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div>
                        <div className="font-bold text-base-content">{t.subject}</div>
                        <div className="text-[10px] text-base-content/60">Class: {t.class}</div>
                      </div>
                    </td>
                    <td className="font-medium text-base-content/80">{t.studentEmail || t.userEmail}</td>
                    <td>{t.location}</td>
                    <td className="font-bold text-primary">${t.budget}/mo</td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold uppercase text-[9px] ${
                          t.status === 'approved'
                            ? 'badge-success'
                            : t.status === 'assigned'
                            ? 'badge-info'
                            : t.status === 'rejected'
                            ? 'badge-error'
                            : 'badge-warning'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {t.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(t._id, t.subject)}
                            className="btn btn-success btn-xs rounded-lg font-bold gap-1 text-success-content"
                            title="Approve Post"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(t._id, t.subject)}
                            className="btn btn-error btn-outline btn-xs rounded-lg font-bold gap-1"
                            title="Reject Post"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-base-content/50 italic">
                          {t.status === 'approved' ? 'Active on Feed' : t.status === 'assigned' ? 'Hired' : 'Rejected'}
                        </span>
                      )}
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
