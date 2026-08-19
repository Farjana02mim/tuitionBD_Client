import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  FileText,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  MapPin,
  Calendar,
  X,
  Save,
  Search,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const MyApplications = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [editingApp, setEditingApp] = useState(null);
  const [editQualifications, setEditQualifications] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editExpectedSalary, setEditExpectedSalary] = useState('');

  // 1. Fetch applications
  const { data, isLoading } = useQuery({
    queryKey: ['myTutorApplications'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-applications');
      return res.data?.data || [];
    },
  });

  // 2. Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTutorApplications'] });
      Swal.fire({
        icon: 'success',
        title: 'Application Withdrawn',
        text: 'Your application proposal was removed.',
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

  // 3. Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return await axiosSecure.put(`/applications/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTutorApplications'] });
      setEditingApp(null);
      Swal.fire({
        icon: 'success',
        title: 'Application Updated',
        text: 'Your proposal changes have been saved.',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || error.message,
      });
    },
  });

  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setEditQualifications(app.qualifications || '');
    setEditExperience(app.experience || '');
    setEditExpectedSalary(app.expectedSalary || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingApp) return;

    updateMutation.mutate({
      id: editingApp._id,
      payload: {
        qualifications: editQualifications,
        experience: editExperience,
        expectedSalary: Number(editExpectedSalary),
      },
    });
  };

  const handleDelete = (id, subject) => {
    Swal.fire({
      title: 'Withdraw Application?',
      text: `Are you sure you want to withdraw your proposal for "${subject || 'this tuition'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, withdraw it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Fetching your submitted proposals..." />;
  }

  const applications = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-base-content tracking-tight">My Applications</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Monitor the status of your tuition applications. Pending proposals can be updated or withdrawn.
          </p>
        </div>
        <Link
          to="/tuitions"
          className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>Browse More Tuitions</span>
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-base-content">No Applications Submitted</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            Explore live student tuition posts and submit your qualifications and proposed monthly fee.
          </p>
          <Link to="/tuitions" className="btn btn-primary btn-sm rounded-xl">
            Browse Tuitions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-base-content">
                      {app.tuitionSubject || 'Tuition Requirement'}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-base-content/60 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      <span>{app.tuitionLocation || 'Online / Remote'}</span>
                    </div>
                  </div>
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
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-base-200/40 p-3 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-base-content/50 block">Proposed Salary</span>
                    <span className="font-extrabold text-primary text-sm">${app.expectedSalary}/mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-base-content/50 block">Applied Date</span>
                    <span className="font-medium text-base-content text-xs">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-base-content/70 space-y-1">
                  <div><strong className="text-base-content">Credentials:</strong> {app.qualifications}</div>
                  <div><strong className="text-base-content">Experience:</strong> {app.experience}</div>
                </div>
              </div>

              {/* Status Specific Footer */}
              <div className="pt-3 border-t border-base-200 flex items-center justify-between">
                {app.status === 'pending' ? (
                  <>
                    <span className="text-[11px] text-warning font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Student Review</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(app)}
                        className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:bg-base-200"
                        title="Edit Proposal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app._id, app.tuitionSubject)}
                        className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                        title="Withdraw Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : app.status === 'approved' ? (
                  <div className="w-full flex items-center justify-between text-xs">
                    <span className="text-success font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hired & Assigned (Read-only)</span>
                    </span>
                    <Link
                      to="/dashboard/tutor/ongoing"
                      className="btn btn-success btn-outline btn-xs rounded-lg"
                    >
                      View in Ongoing
                    </Link>
                  </div>
                ) : (
                  <span className="text-[11px] text-error font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Proposal Declined</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT APPLICATION MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card bg-base-100 border border-base-200 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-base-content">Update Application Proposal</h3>
                <p className="text-xs text-base-content/60">
                  Target: {editingApp.tuitionSubject || 'Tuition Requirement'}
                </p>
              </div>
              <button
                onClick={() => setEditingApp(null)}
                className="btn btn-ghost btn-xs btn-square"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Academic Qualifications *</span>
                </label>
                <input
                  type="text"
                  required
                  value={editQualifications}
                  onChange={(e) => setEditQualifications(e.target.value)}
                  placeholder="e.g. B.Sc. in Physics, University of California"
                  className="input input-bordered input-sm rounded-xl text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Teaching Experience *</span>
                </label>
                <input
                  type="text"
                  required
                  value={editExperience}
                  onChange={(e) => setEditExperience(e.target.value)}
                  placeholder="e.g. 4+ Years teaching High School & AP Physics"
                  className="input input-bordered input-sm rounded-xl text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Expected Monthly Salary ($) *</span>
                </label>
                <input
                  type="number"
                  required
                  value={editExpectedSalary}
                  onChange={(e) => setEditExpectedSalary(e.target.value)}
                  className="input input-bordered input-sm rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="btn btn-ghost btn-sm rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="btn btn-primary btn-sm rounded-xl font-bold text-xs gap-1.5"
                >
                  {updateMutation.isPending ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
