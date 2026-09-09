import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import { UserPlus, Mail, Lock, User, Phone, BookOpen, GraduationCap } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, setLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Firebase Auth user তৈরি (নাম ও রোল সহ)
      const userCredential = await createUser(email, password, name, role, phone);
      const firebaseUser = userCredential.user;

      // 2. Profile নাম আপডেট
      if (name) {
        await updateUserProfile(name, "");
      }

      // 3. MongoDB-তে ইউজার তথ্য সিঙ্ক
      try {
        const token = await firebaseUser.getIdToken();
        await axios.post(
          `${API_URL}/users`,
          { name, email, phone, role, photoURL: "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (dbErr) {
        console.warn("MongoDB sync notice:", dbErr.message);
      }

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: `Welcome to TuitionDesk as a ${role}.`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === "auth/email-already-in-use") {
        Swal.fire({
          icon: "warning",
          title: "Email Already In Use",
          text: "এই ইমেইলটি দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে। দয়া করে লগইন করুন।",
          showCancelButton: true,
          confirmButtonText: "Go to Login",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#2563eb",
        }).then((res) => {
          if (res.isConfirmed) navigate("/login");
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Registration could not be completed.",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: "success",
        title: "Google Sign In Successful",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign In Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-base-200/40">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-200 p-8 rounded-3xl">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-base-content">Create an Account</h2>
          <p className="text-sm text-base-content/60">Join TuitionDesk as a student or certified tutor</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-xs">Select Your Role</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  role === "student"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-base-200 hover:bg-base-200 text-base-content/70"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Student / Parent</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("tutor")}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  role === "tutor"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-base-200 hover:bg-base-200 text-base-content/70"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Tutor / Teacher</span>
              </button>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-xs">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="input input-bordered w-full pl-10 text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-xs">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="input input-bordered w-full pl-10 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-xs">Phone Number</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 0199"
                  className="input input-bordered w-full pl-10 text-sm rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-xs">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="input input-bordered w-full pl-10 text-sm rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-block rounded-xl gap-2 mt-4 font-bold shadow-md shadow-primary/20"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span>Create Account</span>
          </button>
        </form>

        <div className="divider text-xs text-base-content/40 my-6">OR REGISTER WITH</div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition text-sm font-semibold"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-xs text-base-content/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;