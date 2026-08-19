import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  PlusCircle,
  Users,
  Trash2,
  Edit3,
  MapPin,
  DollarSign,
  Calendar,
  BookOpen,
  X,
  Save,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const MyTuitions = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [editingTuition, setEditingTuition] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editSchedule, setEditSchedule] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['myTuitions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-tuitions');
      return res.data?.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/tuitions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTuitions'] });
      Swal.fire({
        icon: 'success',
        title: 'Tuition Deleted',
        text: 'Your post was removed successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.response?.data?.message || error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return await axiosSecure.put(`/tuitions/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTuitions'] });
      setEditingTuition(null);
      Swal.fire({
        icon: 'success',
        title: 'Tuition Updated',
        text: 'Your requirement updates have been saved.',
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

  const handleOpenEdit = (t) => {
    setEditingTuition(t);
    setEditSubject(t.subject || '');
    setEditClass(t.class || '');
    setEditLocation(t.location || '');
    setEditBudget(t.budget || '');
    setEditSchedule(t.schedule || '');
    setEditDescription(t.description || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTuition) return;

    updateMutation.mutate({
      id: editingTuition._id,
      payload: {
        subject: editSubject,
        class: editClass,
        location: editLocation,
        budget: Number(editBudget),
        schedule: editSchedule,
        description: editDescription,
      },
    });
  };

  const handleDelete = (id, subjectName) => {
    Swal.fire({
      title: 'Delete Tuition Post?',
      text: `Are you sure you want to delete "${subjectName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Fetching your tuition posts..." />;
  }

  const tuitions = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-base-content tracking-tight">My Tuition Posts</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Manage your posted tuition requirements, edit details, or review candidate proposals.
          </p>
        </div>
        <Link
          to="/dashboard/student/post-tuition"
          className="btn btn-primary btn-sm rounded-xl font-bold gap-2 shadow-sm text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Tuition</span>
        </Link>
      </div>

      {tuitions.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-base-content">No Tuition Posts Found</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            You haven't posted any requirements yet. Post a requirement to start receiving tutor applications.
          </p>
          <Link to="/dashboard/student/post-tuition" className="btn btn-primary btn-sm rounded-xl">
            Post Tuition Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tuitions.map((t) => (
            <div
              key={t._id}
              className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="badge badge-primary badge-sm font-semibold text-[10px] mb-1.5">
                      Class: {t.class}
                    </span>
                    <h3 className="font-bold text-base text-base-content">{t.subject}</h3>
                  </div>
                  <span
                    className={`badge badge-sm font-bold uppercase text-[10px] ${
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
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-base-200/40 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-base-content/70">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-primary">${t.budget}/mo</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-base-content/70">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    <span className="truncate">{t.location}</span>
                  </div>
                </div>

                <div className="text-xs text-base-content/70 space-y-1">
                  <div><strong className="text-base-content">Schedule: </strong>{t.schedule || 'Flexible'}</div>
                  <p className="line-clamp-2 text-base-content/60">{t.description || 'No additional notes.'}</p>
                  <div className="text-[10px] text-base-content/40 pt-1">
                    Posted on: {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-base-200 flex items-center justify-between gap-2">
                <Link
                  to={`/dashboard/student/applied-tutors?tuitionId=${t._id}`}
                  className="btn btn-primary btn-outline btn-sm rounded-xl font-bold text-xs gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Applicants</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:bg-base-200"
                    title="Edit Tuition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id, t.subject)}
                    className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                    title="Delete Tuition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT TUITION MODAL */}
      {editingTuition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card bg-base-100 border border-base-200 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="font-extrabold text-lg text-base-content">Edit Tuition Requirement</h3>
              <button
                onClick={() => setEditingTuition(null)}
                className="btn btn-ghost btn-xs btn-square"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">Subject *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">Class / Grade *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">Location *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">Monthly Budget ($) *</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Schedule</span>
                </label>
                <input
                  type="text"
                  value={editSchedule}
                  onChange={(e) => setEditSchedule(e.target.value)}
                  className="input input-bordered input-sm rounded-xl text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Description</span>
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="textarea textarea-bordered text-xs rounded-2xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setEditingTuition(null)}
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
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
