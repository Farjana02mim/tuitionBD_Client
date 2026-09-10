import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../hooks/useAuth';
import { useRole } from '../../../hooks/useRole';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { User, Mail, Phone, Image, Save } from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const ProfileSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const [role] = useRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // ডাটাবেজ থেকে স্টুডেন্ট প্রোফাইল ডেটা ফেচ
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/user/profile');
      return res.data?.user || null;
    },
  });

  useEffect(() => {
    if (dbUser) {
      if (dbUser.name) setDisplayName(dbUser.name);
      if (dbUser.photoURL) setPhotoURL(dbUser.photoURL);
      if (dbUser.phone) setPhone(dbUser.phone);
    } else if (user) {
      if (user.displayName) setDisplayName(user.displayName);
      if (user.photoURL) setPhotoURL(user.photoURL);
    }
  }, [dbUser, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      if (displayName !== user?.displayName || photoURL !== user?.photoURL) {
        await updateUserProfile(displayName, photoURL);
      }

      await axiosSecure.patch('/user/profile', {
        name: displayName,
        phone,
        photoURL,
      });

      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.email] });

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your personal information has been saved.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading profile settings..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-base-200 pb-4">
        <h1 className="text-2xl font-black text-base-content tracking-tight">Student Profile Settings</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Update your student profile display name, avatar photo, and contact phone number.
        </p>
      </div>

      <div className="card bg-base-100 border border-base-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden">
              <img
                src={
                  photoURL ||
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName || 'Student'
                  )}&background=0284c7&color=fff`
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-base-content">{displayName || 'Student User'}</h3>
            <p className="text-xs text-base-content/60">{user?.email}</p>
            <span className="badge badge-primary badge-sm font-semibold uppercase text-[10px] mt-1">
              {role || 'Student'}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-base-200">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Email Address (Read-only)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="email"
                readOnly
                value={user?.email || ''}
                className="input input-bordered input-sm rounded-xl bg-base-200/50 text-xs w-full pl-9"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Full Name *</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                className="input input-bordered input-sm rounded-xl text-xs w-full pl-9"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Profile Picture URL</span>
            </label>
            <div className="relative">
              <Image className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered input-sm rounded-xl text-xs w-full pl-9"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Phone Number</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="input input-bordered input-sm rounded-xl text-xs w-full pl-9"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs shadow-sm"
            >
              {isUpdating ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Profile Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProfileSettings;