import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Home,
  ArrowLeft,
  Search,
  Users,
  PlusCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

const SUGGESTED_DESTINATIONS = [
  {
    to: '/',
    label: 'Home Portal',
    desc: 'Return to our homepage and explore platform highlights.',
    icon: Home,
    tag: 'Main',
  },
  {
    to: '/tuitions',
    label: 'Browse Tuitions',
    desc: 'Find open student tuition posts across all subjects and grades.',
    icon: Search,
    tag: 'Popular',
  },
  {
    to: '/tutors',
    label: 'Find Tutors',
    desc: 'Discover verified and qualified subject-matter experts.',
    icon: Users,
    tag: 'Verified',
  },
  {
    to: '/dashboard/student/post-tuition',
    label: 'Post Tuition',
    desc: 'Need a tutor? Create a tuition requirement in minutes.',
    icon: PlusCircle,
    tag: 'Students',
  },
  {
    to: '/contact',
    label: 'Help & Support',
    desc: 'Get in touch with our tuition advisory & customer care team.',
    icon: HelpCircle,
    tag: '24/7',
  },
];

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* HERO SECTION */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-24 md:py-36 px-6">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(55% 55% at 20% 25%, rgba(59,130,246,0.35), transparent 65%), radial-gradient(50% 50% at 80% 75%, rgba(99,102,241,0.25), transparent 60%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs tracking-wider uppercase font-semibold"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Error 404 · Page Not Found</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-8xl sm:text-9xl md:text-[180px] font-black tracking-tight leading-none bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent select-none"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto"
          >
            Oops! The tuition or page you are looking for does not exist.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            The link may be expired, the tuition post might have been fulfilled or removed,
            or the URL might have a typo. Let&apos;s guide you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide uppercase border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 transition-all flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>

            <Link
              to="/"
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide uppercase bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>

            <Link
              to="/tuitions"
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide uppercase border border-blue-400/40 text-blue-300 hover:bg-blue-950/60 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Tuitions</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">
              Continue Learning
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Popular Tuition Destinations
            </h3>
          </div>
          <p className="text-sm text-slate-500">
            Quick links to help you navigate our educational platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUGGESTED_DESTINATIONS.map((dest, i) => {
            const Icon = dest.icon;
            return (
              <motion.div
                key={dest.to}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={dest.to}
                  className="group flex flex-col justify-between h-full bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600">
                        {dest.tag}
                      </span>
                    </div>

                    <h4 className="mt-4 font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                      {dest.label}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {dest.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Visit page</span>
                    <span className="ml-1">→</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* SUPPORT BANNER */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Need Personal Assistance?</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black tracking-tight">
              Looking for a specific subject or private tutor?
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Our tuition coordinators are available to help match students with the most suitable verified tutors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-md"
            >
              Contact Support
            </Link>
            <Link
              to="/tutors"
              className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs sm:text-sm font-bold tracking-wide uppercase transition-all"
            >
              Browse All Tutors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;