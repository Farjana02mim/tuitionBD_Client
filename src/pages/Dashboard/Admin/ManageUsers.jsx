import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  Users,
  Search,
  Trash2,
  Edit3,
  Shield,
  UserCheck,
  GraduationCap,
  BookOpen,
  X,
  Save,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  // 1. Fetch Users
  const { data, isLoading } = useQuery({
    queryKey: ['adminUsersList', searchTerm, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter) params.append('role', roleFilter);
      const res = await axiosSecure.get(`/admin/users?${params.toString()}`);
      return res.data?.data || [];
    },
  });

  // 2. Change Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, newRole }) => {
      return await axiosSecure.patch(`/admin/users/${id}/role`, { role: newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
      Swal.fire({
        icon: 'success',
        title: 'Role Updated',
        text: 'The user role has been changed successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Role Update Failed',
        text: error.response?.data?.message || error.message,
      });
    },
  });

  // 3. Edit User Profile Mutation
  const editUserMutation = useMutation({
    mutationFn: async ({ id, name, role }) => {
      // First update role
      await axiosSecure.patch(`/admin/users/${id}/role`, { role });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
      setEditingUser(null);
      Swal.fire({
        icon: 'success',
        title: 'User Updated',
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

  // 4. Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
      Swal.fire({
        icon: 'success',
        title: 'User Deleted',
        text: 'User record removed from platform.',
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

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name || '');
    setEditRole(user.role || 'student');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    editUserMutation.mutate({
      id: editingUser._id,
      name: editName,
      role: editRole,
    });
  };

  const handleChangeRole = (userId, currentRole) => {
    Swal.fire({
      title: 'Change User Role',
      input: 'select',
      inputOptions: {
        student: 'Student',
        tutor: 'Tutor',
        admin: 'Admin',
      },
      inputValue: currentRole,
      showCancelButton: true,
      confirmButtonText: 'Update Role',
      confirmButtonColor: '#0284c7',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        updateRoleMutation.mutate({
          id: userId,
          newRole: result.value,
        });
      }
    });
  };

  const handleDelete = (id, email) => {
    Swal.fire({
      title: 'Delete User Account?',
      text: `Are you sure you want to permanently remove ${email}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete user',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Fetching platform users..." />;
  }

  const users = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-base-content tracking-tight">User Management</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Browse registered students, tutors, and administrators. Manage account roles and security.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-sm rounded-xl text-xs w-full pl-9"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="select select-bordered select-sm rounded-xl text-xs w-full sm:w-44"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="tutor">Tutors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 border border-base-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-base-200 flex items-center justify-between font-bold text-xs text-base-content">
          <span>Registered Accounts ({users.length})</span>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center text-xs text-base-content/60">
            No users found matching your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr className="text-base-content/60 border-b border-base-200">
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-9 h-9 rounded-xl border border-base-200 overflow-hidden">
                            <img
                              src={
                                u.photoURL ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  u.name || 'User'
                                )}&background=0284c7&color=fff`
                              }
                              alt={u.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="font-bold text-base-content">{u.name || 'Anonymous User'}</div>
                      </div>
                    </td>
                    <td className="text-base-content/80">{u.email}</td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold uppercase text-[9px] ${
                          u.role === 'admin'
                            ? 'badge-primary'
                            : u.role === 'tutor'
                            ? 'badge-secondary'
                            : 'badge-ghost'
                        }`}
                      >
                        {u.role || 'student'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleChangeRole(u._id, u.role)}
                          className="btn btn-ghost btn-xs rounded-lg text-primary hover:bg-primary/10"
                          title="Change Role"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Role</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:bg-base-200"
                          title="Edit User"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.email)}
                          className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card bg-base-100 border border-base-200 w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="font-extrabold text-base text-base-content">Edit User Profile</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="btn btn-ghost btn-xs btn-square"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Email (Read-only)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={editingUser.email}
                  className="input input-bordered input-sm rounded-xl bg-base-200/50 text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Full Name</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input input-bordered input-sm rounded-xl text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Assign Role</span>
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="select select-bordered select-sm rounded-xl text-xs"
                >
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn btn-ghost btn-sm rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editUserMutation.isPending}
                  className="btn btn-primary btn-sm rounded-xl font-bold text-xs gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
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
