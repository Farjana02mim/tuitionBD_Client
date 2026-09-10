import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  BookOpen,
  GraduationCap,
  Upload,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const imageHostKey = import.meta.env.VITE_image_host;
const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

export const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, setLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // ইমেজ ফাইল সিলেক্ট হ্যান্ডলার ও প্রিভিউ
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
      let photoURL = "";

      // ১. যদি ইমেজ সিলেক্ট করা থাকে, তবে ImgBB-তে আপলোড করা
      if (imageFile) {
        if (!imageHostKey) {
          console.warn("⚠️ VITE_image_host key not found in .env.local");
        } else {
          const formData = new FormData();
          formData.append("image", imageFile);

          const imgRes = await axios.post(imageUploadUrl, formData);
          if (imgRes.data?.success) {
            photoURL = imgRes.data.data.display_url;
          }
        }
      }

      // ২. Firebase Auth User তৈরি (রোল, ফোন ও ImgBB photoURL সহ)
      const userCredential = await createUser(email, password, name, role, phone, photoURL);
      const firebaseUser = userCredential.user;

      // ৩. Profile নাম ও photoURL আপডেট
      if (name || photoURL) {
        await updateUserProfile(name, photoURL);
      }

      // ৪. MongoDB-তে ইউজার তথ্য সিঙ্ক
      try {
        const token = await firebaseUser.getIdToken();
        await axios.post(
          `${API_URL}/users`,
          { name, email, phone, role, photoURL },
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
          <p className="text-sm text-base-content/60">
            Join TuitionDesk as a student or certified tutor
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Role Selection */}
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

          {/* Full Name */}
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

          {/* Email & Phone */}
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

          {/* Profile Picture File Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-xs">Profile Picture</span>
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="avatar">
                  <div className="w-14 h-14 rounded-2xl ring-2 ring-primary ring-offset-2 overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-base-200 border-2 border-dashed border-base-300 flex items-center justify-center text-base-content/40">
                  <Upload className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary w-full text-xs rounded-xl"
                />
                <p className="text-[11px] text-base-content/50 mt-1">
                  JPG, PNG or WEBP (Automatically hosted on ImgBB)
                </p>
              </div>
            </div>
          </div>

          {/* Password */}
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
            <span>{isSubmitting ? "Uploading & Registering..." : "Create Account"}</span>
          </button>
        </form>

        <div className="divider text-xs text-base-content/40 my-6">OR REGISTER WITH</div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition text-sm font-semibold"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
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