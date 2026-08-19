import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Award, Users, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export const About = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-primary/10 via-base-100 to-base-100 py-16 px-4 md:px-8 border-b border-base-200 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="badge badge-primary badge-outline text-xs font-bold uppercase">
            About Our Mission
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-base-content tracking-tight">
            Democratizing Quality Education with Verified Tutoring
          </h1>
          <p className="text-base text-base-content/70 leading-relaxed">
            TuitionDesk was built to bridge the gap between ambitious students seeking academic mentorship and verified educators who love to teach.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-base-content tracking-tight">Our Core Principles</h2>
          <p className="text-xs text-base-content/60">
            Every feature on TuitionDesk is engineered around student safety, academic rigor, and educator respect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-100 border border-base-200 p-8 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-base-content">Academic Integrity</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              We vet degrees, certifications, and teaching credentials. No anonymous unverified accounts can teach or access student postings.
            </p>
          </div>

          <div className="card bg-base-100 border border-base-200 p-8 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-base-content">Transparent Escrow</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Stripe checkout escrow protects student tuition fees and guarantees prompt payout disbursements to tutors upon confirmed milestones.
            </p>
          </div>

          <div className="card bg-base-100 border border-base-200 p-8 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-base-content">Community Impact</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Supporting flexible home tutoring and global online learning across primary, secondary, university, and competitive standardized exams.
            </p>
          </div>
        </div>
      </section>

      {/* Team / Stats */}
      <section className="bg-base-200/50 py-16 px-4 md:px-8 border-y border-base-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-primary">1,200+</div>
            <div className="text-xs text-base-content/60 font-semibold">Verified Tutors</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-secondary">3,400+</div>
            <div className="text-xs text-base-content/60 font-semibold">Tuitions Matched</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-accent">50+</div>
            <div className="text-xs text-base-content/60 font-semibold">Subject Disciplines</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-success">99.4%</div>
            <div className="text-xs text-base-content/60 font-semibold">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-black text-base-content">Ready to Start Learning or Teaching?</h2>
        <p className="text-xs text-base-content/70 max-w-lg mx-auto">
          Join thousands of students and tutors today on TuitionDesk. It takes less than 2 minutes to create your account.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn btn-primary btn-sm rounded-xl font-bold gap-2">
            <span>Create Free Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/tuitions" className="btn btn-outline btn-sm rounded-xl font-bold">
            Browse Tuitions
          </Link>
        </div>
      </section>
    </div>
  );
};
