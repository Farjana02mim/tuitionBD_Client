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
    queryFn: async () => {
      if (!user?.email) return 'student';
      try {
        const res = await axiosSecure.get(`/users/${user.email}/role`);
        return res.data?.role || 'student';
      } catch (error) {
        console.warn('Role fetch error:', error?.message);
        return 'student';
      }
    },
  });

  return [role, isRoleLoading, refetchRole];
};