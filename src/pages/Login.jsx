import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";
import { LogIn, Mail, Lock, BookOpen } from "lucide-react";

export const Login = () => {
  const { signIn, signInWithGoogle, setLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "You have signed in successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Sign In Failed",
        text: error.message || "Invalid email or password.",
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
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google Sign In error:", error);
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
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200 p-8 rounded-3xl">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-base-content">
            Sign In to TuitionDesk
          </h2>
          <p className="text-sm text-base-content/60">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-xs">
                Email Address
              </span>
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
                placeholder="name@example.com"
                className="input input-bordered w-full pl-10 text-sm rounded-xl"
              />
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
                placeholder="••••••••"
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
              <LogIn className="w-4 h-4" />
            )}
            <span>Sign In</span>
          </button>
        </form>

        <div className="divider text-xs text-base-content/40 my-6">
          OR CONTINUE WITH
        </div>

        {/* GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-300 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5"
          />
          Continue with Google
        </button>

        <p className="text-center text-xs text-base-content/60 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-primary hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
