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

  // Helper: MongoDB ব্যাকএন্ডে ইউজার সিঙ্ক করা (সার্ভার অফ থাকলেও ক্র্যাশ করবে না)
  const saveUserToDatabase = async (firebaseUser, customRole = 'student', customPhone = '') => {
    if (!firebaseUser?.email) return null;
    try {
      const token = await firebaseUser.getIdToken();
      const payload = {
        name: firebaseUser.displayName || 'Anonymous User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || '',
        role: customRole || 'student',
        phone: customPhone || '',
      };

      const response = await axios.post(`${API_URL}/users`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // ব্যাকএন্ড অফ থাকলেও ফ্রন্টএন্ড যাতে আটকে না যায়
      return null;
    }
  };

  // ১. Email/Password রেজিস্ট্রেশন
  const createUser = async (email, password, displayName = '', role = 'student', phone = '') => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      // MongoDB ব্যাকএন্ডে রোল ও ফোন সহ সেভ
      await saveUserToDatabase(result.user, role, phone);
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
      await saveUserToDatabase(result.user, 'student');
      return result;
    } finally {
      setLoading(false);
    }
  };

  // ৪. প্রোফাইল আপডেট
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
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
        await saveUserToDatabase(currentUser);
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