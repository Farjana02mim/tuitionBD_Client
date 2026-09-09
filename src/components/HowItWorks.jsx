import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    title: 'Post Tuition Requirement',
    badge: 'Step 1: Student',
    description:
      'Students or parents post their specific subject, curriculum, preferred weekly schedule, class grade, and monthly budget in under two minutes.',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'hover:border-blue-300',
    accentBadge: 'bg-blue-100 text-blue-700',
  },
  {
    step: '02',
    title: 'Review Verified Applicants',
    badge: 'Step 2: Matching',
    description:
      'Background-checked and certified tutors submit applications detailing degrees, teaching records, and salary proposals. Compare profiles transparently.',
    icon: Users,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'hover:border-emerald-300',
    accentBadge: 'bg-emerald-100 text-emerald-700',
  },
  {
    step: '03',
    title: 'Hire with Secure Escrow',
    badge: 'Step 3: Learning',
    description:
      'Confirm the hire through Stripe escrow. Funds are securely locked and only released as sessions progress, ensuring full peace of mind.',
    icon: ShieldCheck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'hover:border-indigo-300',
    accentBadge: 'bg-indigo-100 text-indigo-700',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Transparent 3-Step Workflow</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How TuitionDesk Works
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          From posting your academic requirements to hiring a verified educator with secure payment protection, we make tutoring simple, safe, and reliable.
        </p>
      </motion.div>

      {/* 3-Step Visual Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Subtle connector line on desktop */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-1/3 left-16 right-16 h-0.5 border-t-2 border-dashed border-slate-200 -z-0"
        />

        {STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.45, delay: index * 0.15 }}
              className={`relative z-10 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${item.borderColor}`}
            >
              <div className="space-y-5">
                {/* Top Step Pill & Number */}
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${item.bgColor} ${item.color} flex items-center justify-center shadow-inner`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-black tracking-tighter text-slate-200 select-none">
                    {item.step}
                  </span>
                </div>

                {/* Badge & Title */}
                <div>
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider mb-2.5 ${item.accentBadge}`}>
                    {item.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action link */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold uppercase tracking-wider text-slate-800 group cursor-pointer">
                <span className="group-hover:text-blue-600 transition-colors">
                  {index === 0 ? 'Post a Tuition' : index === 1 ? 'Explore Tutors' : 'Payment Escrow'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center pt-4"
      >
        <div className="inline-flex flex-wrap items-center justify-center gap-4 p-2.5 bg-slate-100/80 rounded-2xl border border-slate-200/80">
          <span className="text-xs text-slate-600 font-medium px-2">
            Ready to find your personal tutor or start teaching?
          </span>
          <Link
            to="/tuitions"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide uppercase transition-colors shadow-sm"
          >
            Get Started Now
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;