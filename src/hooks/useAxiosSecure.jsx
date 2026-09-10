import axios from "axios";
import { auth } from "../firebase/firebase.config";

// সরাসরি এক্সিওস ইন্সট্যান্স তৈরি
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// ইন্টারসেপ্টর সরাসরি ইন্সট্যান্সে রেজিস্টার করা (যাতে কোনো পেজে টোকেন মিস না হয়)
axiosSecure.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken(false);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error("Error attaching auth token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// রেসপন্স ইন্টারসেপ্টর: 401 বা 403 এরর লগ করা
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      console.warn(`[AxiosSecure] Unauthorized / Forbidden: ${status}`, error.response?.data);
    }
    return Promise.reject(error);
  }
);

export const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;