import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useAxiosSecure } from './useAxiosSecure';

export const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = 'student',
    isLoading: isRoleLoading,
    refetch: refetchRole,
  } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !loading && !!user?.email,
    retry: 1, // অপ্রয়োজনীয় এরর স্প্যাম বন্ধ করবে
    staleTime: 1000 * 60 * 5, // ৫ মিনিট ক্যাশ ধরে রাখবে
    queryFn: async () => {
      if (!user?.email) return 'student';
      try {
        const res = await axiosSecure.get(`/users/${user.email}/role`);
        return res.data?.role || 'student';
      } catch (error) {
        // ব্যাকএন্ড অফ বা আনরিচেবল থাকলে স্বয়ংক্রিয়ভাবে 'student' রিটার্ন করবে
        return 'student';
      }
    },
  });

  return [role, isRoleLoading, refetchRole];
};

export default useRole;