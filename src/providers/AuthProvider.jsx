import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from '../firebase/firebase.config';
import { AuthContext } from './AuthContext';

// ডিফল্ট ব্যাকএন্ড পোর্ট 5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: MongoDB ব্যাকএন্ডে ইউজার সিঙ্ক করা (রোল ও photoURL সুরক্ষিত থাকবে)
  const saveUserToDatabase = async (firebaseUser, customRole = null, customPhone = '', customPhoto = '') => {
    if (!firebaseUser?.email) return null;
    try {
      const token = await firebaseUser.getIdToken();
      const payload = {
        name: firebaseUser.displayName || 'Anonymous User',
        email: firebaseUser.email,
        photoURL: customPhoto || firebaseUser.photoURL || '',
        phone: customPhone || '',
      };

      // শুধুমাত্র রেজিস্ট্রেশনের সময় রোল পাঠানো হবে
      if (customRole) {
        payload.role = customRole;
      }

      const response = await axios.post(`${API_URL}/users`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.warn('MongoDB user sync notice:', error.response?.data?.message || error.message);
      return null;
    }
  };

  // ১. Email/Password রেজিস্ট্রেশন (নাম, রোল, ফোন এবং Photo URL সহ)
  const createUser = async (email, password, displayName = '', role = 'student', phone = '', photoURL = '') => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Firebase প্রোফাইলে নাম ও ছবি সেট করা
      if (displayName || photoURL) {
        await updateProfile(result.user, {
          displayName: displayName || result.user.displayName,
          photoURL: photoURL || '',
        });
      }

      // MongoDB ব্যাকএন্ডে নাম, রোল, ফোন ও ছবি সহ সেভ করা
      await saveUserToDatabase(result.user, role, phone, photoURL);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // ২. Email/Password লগইন
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ৩. Google Sign In
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToDatabase(result.user, null);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // ৪. প্রোফাইল আপডেট
  const updateUserProfile = async (name, photo) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    // প্রোফাইল আপডেটের সাথে সাথে MongoDB-তেও আপডেট সিঙ্ক হবে
    await saveUserToDatabase(auth.currentUser, null, '', photo);
  };

  // ৫. লগআউট
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // ৬. Firebase ID Token নেওয়া
  const getToken = async (forceRefresh = false) => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken(forceRefresh);
  };

  // ৭. Auth State পরিবর্তন ট্র্যাকিং
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        // রোল ওভাররাইট না করে বর্তমান ডাটা সিঙ্ক হবে
        await saveUserToDatabase(currentUser, null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    currentUser: user,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    updateUserProfile,
    logOut,
    getToken,
    saveUserToDatabase,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;