import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [role] = useRole();
  const axiosSecure = useAxiosSecure();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      if (displayName !== user?.displayName) {
        await updateUserProfile(displayName, user?.photoURL || '');
      }

      await axiosSecure.patch('/user/profile', {
        name: displayName,
        phone,
      });

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile settings have been saved.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-base-200 pb-4">
        <h1 className="text-2xl font-black text-base-content tracking-tight">Profile Settings</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Manage your account details and contact information.
        </p>
      </div>

      <div className="card bg-base-100 border border-base-200 p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full border-2 border-primary/20">
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.displayName || 'User'
                  )}&background=0284c7&color=fff`
                }
                alt="Avatar"
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-base-content">{user?.displayName || 'User'}</h3>
            <p className="text-xs text-base-content/60">{user?.email}</p>
            <span className="badge badge-primary badge-sm font-semibold uppercase text-[10px] mt-1">
              {role}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-base-200">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Email Address (Immutable)</span>
            </label>
            <input
              type="email"
              readOnly
              value={user?.email || ''}
              className="input input-bordered input-sm rounded-xl bg-base-200/50 text-xs"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Display Name</span>
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input input-bordered input-sm rounded-xl text-xs"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Contact Phone</span>
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 0199"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input input-bordered input-sm rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs mt-2"
          >
            {isUpdating ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
