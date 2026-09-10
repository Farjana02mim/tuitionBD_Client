import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Search,
  GraduationCap,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  CreditCard,
  Star,
} from "lucide-react";
import { safeDateString } from "../utils/formatters";
import { LoadingSpinner } from "../components/Shared/LoadingSpinner";
import { HowItWorks } from "../components/HowItWorks";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Home = () => {
  // 1. Dynamic Latest Approved Tuitions
  const { data: tuitionsData = [], isLoading: isTuitionsLoading } = useQuery({
    queryKey: ["latestTuitions"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/tuitions?limit=6&sort=newest`);
      return res.data?.data || res.data?.tuitions || [];
    },
  });

  // 2. Dynamic Latest Verified Tutors (Real Data from Backend)
  const { data: tutorsData = [], isLoading: isTutorsLoading } = useQuery({
    queryKey: ["latestTutors"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/users?role=tutor&limit=4`);
      return res.data?.data || res.data?.users || [];
    },
  });

  return (
    <div className="space-y-24 pb-20">
      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-base-100 to-base-100 py-20 px-4 md:px-8 border-b border-base-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>The Next-Gen Verified Tuition Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-base-content leading-tight">
              Connect With{" "}
              <span className="text-primary">Certified Tutors</span> for
              Academic Excellence
            </h1>

            <p className="text-base sm:text-lg text-base-content/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Find background-checked private and online tutors across STEM,
              languages, and competitive test prep. Safe Stripe escrow hiring
              and direct scheduling.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/tuitions"
                className="btn btn-primary btn-md md:btn-lg rounded-2xl gap-2 shadow-lg shadow-primary/25 font-bold"
              >
                <Search className="w-5 h-5" />
                Browse Tuitions
              </Link>
              <Link
                to="/tutors"
                className="btn btn-outline btn-md md:btn-lg rounded-2xl gap-2 font-bold hover:bg-base-200"
              >
                <GraduationCap className="w-5 h-5" />
                Find Tutors
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-base-200 text-center lg:text-left">
              <div>
                <div className="text-2xl font-black text-base-content">
                  1,200+
                </div>
                <div className="text-xs text-base-content/60 font-medium">
                  Verified Tutors
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-base-content">
                  3,400+
                </div>
                <div className="text-xs text-base-content/60 font-medium">
                  Tuitions Completed
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-primary">99.4%</div>
                <div className="text-xs text-base-content/60 font-medium">
                  Student Satisfaction
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative flex items-center justify-center cursor-pointer"
          >
            <div className="w-full max-w-md bg-base-100 rounded-3xl p-6 shadow-2xl border border-base-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-base-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                    📐
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-base-content">
                      Advanced Calculus & Linear Algebra
                    </h3>
                    <p className="text-[11px] text-base-content/60">
                      Grade 12 / College Prep
                    </p>
                  </div>
                </div>
                <span className="badge badge-success badge-sm font-semibold">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-base-200/50 p-3 rounded-xl">
                  <span className="text-base-content/60 block text-[10px]">
                    Monthly Budget
                  </span>
                  <span className="font-extrabold text-sm text-primary">
                    $350 / mo
                  </span>
                </div>
                <div className="bg-base-200/50 p-3 rounded-xl">
                  <span className="text-base-content/60 block text-[10px]">
                    Mode
                  </span>
                  <span className="font-bold text-sm text-base-content">
                    Online (Zoom)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-base-content/70">
                  Top Matched Tutor:
                </div>
                <div className="flex items-center gap-3 bg-base-200/40 p-3 rounded-2xl border border-base-200">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                        alt="Tutor"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-base-content truncate">
                      Dr. Sarah Jenkins
                    </h4>
                    <p className="text-[10px] text-base-content/60 truncate">
                      Ph.D. Applied Math • 7 Yrs Exp
                    </p>
                  </div>
                  <span className="badge badge-primary badge-xs uppercase font-bold text-[9px]">
                    Verified
                  </span>
                </div>
              </div>

              <Link
                to="/tuitions"
                className="btn btn-primary btn-block btn-sm rounded-xl font-bold gap-2 text-xs"
              >
                <span>View All Tuitions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. HOW THE PLATFORM WORKS */}
      {/* ============================================================ */}
      <HowItWorks />

      {/* ============================================================ */}
      {/* 3. DYNAMIC LATEST TUITION POSTS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
          <div>
            <div className="badge badge-primary badge-outline text-xs font-bold uppercase mb-1">
              Live Feed
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
              Latest Tuition Posts
            </h2>
          </div>
          <Link
            to="/tuitions"
            className="btn btn-outline btn-sm rounded-xl font-bold text-xs gap-1.5"
          >
            <span>View All Tuitions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isTuitionsLoading ? (
          <LoadingSpinner text="Loading recent tuitions..." />
        ) : tuitionsData.length === 0 ? (
          <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl">
            <p className="text-xs text-base-content/60">
              No tuitions posted yet. Be the first to post!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tuitionsData.map((t, index) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-4 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="badge badge-primary badge-sm font-semibold text-[10px] mb-1.5">
                        Class: {t.class}
                      </span>
                      <h3 className="font-extrabold text-base text-base-content leading-snug">
                        {t.subject}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-base-content/50 block">
                        Budget
                      </span>
                      <span className="font-black text-primary text-base">
                        ${t.budget}/mo
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                    {t.description ||
                      "Student seeking an experienced tutor for comprehensive subject guidance."}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-base-200 text-xs text-base-content/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{t.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{t.schedule || "3 Days/Week"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-base-200 flex items-center justify-between">
                  <span className="text-[11px] text-base-content/50">
                    {safeDateString(t.createdAt, t)}
                  </span>
                  <Link
                    to={`/tuitions/${t._id}`}
                    className="btn btn-primary btn-sm rounded-xl font-bold text-xs gap-1"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 4. DYNAMIC LATEST VERIFIED TUTORS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
          <div>
            <div className="badge badge-secondary badge-outline text-xs font-bold uppercase mb-1">
              Faculty
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
              Featured Verified Tutors
            </h2>
          </div>
          <Link
            to="/tutors"
            className="btn btn-outline btn-sm rounded-xl font-bold text-xs gap-1.5"
          >
            <span>Browse All Tutors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isTutorsLoading ? (
          <LoadingSpinner text="Fetching verified tutors..." />
        ) : tutorsData.length === 0 ? (
          <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl">
            <p className="text-xs text-base-content/60">
              No verified tutors registered yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutorsData.map((tutor, index) => (
              <motion.div
                key={tutor._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="card bg-base-100 border border-base-200 rounded-3xl p-6 text-center space-y-4 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="avatar mx-auto">
                    <div className="w-24 h-24 rounded-full border-2 border-primary/20 shadow-sm overflow-hidden">
                      <img
                        src={
                          tutor.photoURL ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            tutor.name || "Tutor",
                          )}&background=0284c7&color=fff`
                        }
                        alt={tutor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-base-content">
                      {tutor.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 text-[11px] text-primary font-bold mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Educator</span>
                    </div>
                  </div>

                  <p className="text-xs text-base-content/70 line-clamp-2">
                    {tutor.qualifications ||
                      tutor.experience ||
                      "Master of Science in Education & Specialization"}
                  </p>

                  <div className="flex items-center justify-center gap-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-base-content/60 font-semibold ml-1">
                      5.0
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-base-200">
                  <Link
                    to={`/tutors/${tutor._id}`}
                    className="btn btn-primary btn-outline btn-block btn-sm rounded-xl font-bold text-xs"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 5. WHY CHOOSE US SECTION */}
      {/* ============================================================ */}
      <section className="py-16 px-4 md:px-8 border-y border-base-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-extrabold text-base-content tracking-tight">
              Why Choose TuitionDesk?
            </h2>
            <p className="text-xs text-base-content/60">
              Built on academic integrity, security, and proven tutoring
              results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-3 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-base-content">
                100% Background Vetted
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Tutor educational degrees, certifications, and teaching
                identities are manually reviewed before profile approval.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-3 hover:border-secondary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-base-content">
                Encrypted Stripe Escrow
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Students only pay when a tutor is hired. Funds are safeguarded
                until schedule and lesson milestones commence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-3 hover:border-accent/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-base-content">
                Role-Dedicated Dashboards
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Custom dashboard workspaces for students, tutors, and admins to
                manage applications, track revenue, and monitor progress.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
