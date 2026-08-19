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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to sync/save user to MongoDB backend with default role 'student'
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
      console.warn('MongoDB user sync warning:', error.response?.data?.message || error.message);
      return null;
    }
  };

  // 1. Email/Password Registration (Creates Firebase account & default student in MongoDB)
  const createUser = async (email, password, displayName = '', role = 'student', phone = '') => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      // Sync to backend MongoDB with specified or default 'student' role
      await saveUserToDatabase(result.user, role, phone);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // 2. Email/Password Login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 3. Google Sign In (Automatically ensures MongoDB user exists)
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Auto sync user to MongoDB (defaults to student if new)
      await saveUserToDatabase(result.user, 'student');
      return result;
    } finally {
      setLoading(false);
    }
  };

  // 4. Update Profile Display Name & Avatar
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // 5. Sign Out
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // 6. Helper to retrieve fresh Firebase ID token
  const getToken = async (forceRefresh = false) => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken(forceRefresh);
  };

  // 7. Firebase Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        // Sync user info with backend
        await saveUserToDatabase(currentUser);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    currentUser: user, // exposed as requested
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