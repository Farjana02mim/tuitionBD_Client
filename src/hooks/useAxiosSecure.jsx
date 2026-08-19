import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export const useAxiosSecure = () => {
  const { user, logOut } = useAuth();

  useEffect(() => {
    // 1. Request Interceptor: Attach Firebase Bearer Token
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor: Catch 401 & 403 Forbidden errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          console.warn(`Unauthorized access detected (${status}).`);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut]);

  return axiosSecure;
};