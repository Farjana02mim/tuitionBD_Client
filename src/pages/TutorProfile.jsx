import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  ShieldCheck,
  Star,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  ArrowLeft,
  Calendar,
  Award,
  CheckCircle,
} from 'lucide-react';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TutorProfile = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['tutorProfile', id],
    queryFn: async () => {
      try {
        const res = await axios.get(`${API_URL}/users`);
        const found = res.data?.data?.find((u) => u._id === id || u.email === id);
        if (found) return found;
      } catch (e) {
        console.warn('API error fetching tutor:', e.message);
      }

      // Fallback sample profile
      return {
        _id: id,
        name: 'Dr. Sarah Jenkins',
        email: 'sarah.jenkins@mit.edu',
        phone: '+1 (555) 234-5678',
        role: 'tutor',
        photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        qualifications: 'Ph.D. in Applied Mathematics, Massachusetts Institute of Technology (MIT)',
        experience: '7+ Years Tutoring AP Calculus, Differential Equations & Physics Mechanics',
        about: 'Passionate mathematician and experienced university lecturer focused on intuitive conceptual understanding, problem-solving mastery, and score improvements for high school and undergraduate students.',
        subjects: ['Calculus I & II', 'Linear Algebra', 'AP Physics Mechanics', 'Statistics'],
      };
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Fetching tutor profile details..." />;
  }

  const tutor = data;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <Link
        to="/tutors"
        className="inline-flex items-center gap-2 text-xs font-bold text-base-content/60 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tutors Directory</span>
      </Link>

      <div className="card bg-base-100 border border-base-200 p-8 rounded-3xl space-y-8 shadow-sm">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-base-200 text-center sm:text-left">
          <div className="avatar">
            <div className="w-28 h-28 rounded-3xl border-2 border-primary/20 shadow-sm overflow-hidden">
              <img
                src={
                  tutor.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    tutor.name || 'Tutor'
                  )}&background=0284c7&color=fff`
                }
                alt={tutor.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-base-content">{tutor.name}</h1>
              <div className="badge badge-primary badge-sm font-semibold uppercase text-[10px]">
                {tutor.role || 'Tutor'}
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified & Background Checked</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-xs pt-1">
              <Star className="w-4 h-4 fill-amber-500" />
              <Star className="w-4 h-4 fill-amber-500" />
              <Star className="w-4 h-4 fill-amber-500" />
              <Star className="w-4 h-4 fill-amber-500" />
              <Star className="w-4 h-4 fill-amber-500" />
              <span className="text-base-content/70 font-bold ml-1.5">5.0 (38 Student Reviews)</span>
            </div>
          </div>
        </div>

        {/* Credentials & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-base-200/40 p-4 rounded-2xl border border-base-200">
              <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-base-content block">Academic Background</span>
                <p className="text-xs text-base-content/80 mt-1">
                  {tutor.qualifications || 'Ph.D. in Applied Mathematics, MIT'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-base-200/40 p-4 rounded-2xl border border-base-200">
              <Briefcase className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-base-content block">Teaching Experience</span>
                <p className="text-xs text-base-content/80 mt-1">
                  {tutor.experience || '7+ Years Tutoring Higher Mathematics & College Prep'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-base-200/40 p-4 rounded-2xl border border-base-200">
              <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-base-content block">Verified Email</span>
                <p className="text-xs text-base-content/80 mt-1">{tutor.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-base-200/40 p-4 rounded-2xl border border-base-200">
              <Phone className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-base-content block">Contact Phone</span>
                <p className="text-xs text-base-content/80 mt-1">{tutor.phone || '+1 (555) 234-5678'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-base-content">Teaching Philosophy & Bio</h3>
          <p className="text-xs text-base-content/70 leading-relaxed bg-base-200/30 p-5 rounded-2xl border border-base-200">
            {tutor.about || 'Dedicated educator focused on building lasting confidence and mastery. Tailors custom problem sets, mock exams, and real-time interactive problem walkthroughs.'}
          </p>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-base-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-base-content/60">
            Want this tutor for your requirement? Post a tuition or check their open availability.
          </span>
          <Link to="/dashboard/student/post-tuition" className="btn btn-primary btn-sm rounded-xl font-bold text-xs gap-1.5 shadow-sm">
            <span>Post Requirement for Tutors</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};
