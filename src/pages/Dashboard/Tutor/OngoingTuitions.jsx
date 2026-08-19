import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import {
  BookOpen,
  UserCheck,
  MapPin,
  Calendar,
  DollarSign,
  Mail,
  CheckCircle2,
  Phone,
  GraduationCap,
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/Shared/LoadingSpinner';

export const OngoingTuitions = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['tutorOngoingTuitions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/my-ongoing-tuitions');
      return res.data?.data || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Fetching your ongoing active tuitions..." />;
  }

  const ongoingList = data || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-base-200 pb-4">
        <h1 className="text-2xl font-black text-base-content tracking-tight">Ongoing Active Tuitions</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Tuitions where your application was accepted by the student and confirmed via Stripe escrow.
        </p>
      </div>

      {ongoingList.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-base-content">No Active Cohorts Yet</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            When students accept your applications and complete Stripe payment, your assigned tuitions will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ongoingList.map((t) => (
            <div
              key={t._id}
              className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="badge badge-primary badge-sm font-semibold text-[10px] mb-1.5">
                    Class: {t.class || 'Standard'}
                  </span>
                  <h3 className="font-extrabold text-base text-base-content">{t.subject}</h3>
                </div>
                <span className="badge badge-success badge-sm font-bold uppercase text-[10px] gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Assigned</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-base-200/40 p-3 rounded-2xl">
                <div>
                  <span className="text-[10px] text-base-content/50 block">Monthly Rate</span>
                  <span className="font-black text-primary text-sm">${t.budget || t.expectedSalary || '300'}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-base-content/50 block">Location</span>
                  <span className="font-semibold text-base-content text-xs truncate block">{t.location}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-base-content/80 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">Student: <strong className="text-base-content">{t.studentEmail || t.userEmail}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>Schedule: {t.schedule || '3 Days/Week (Agreed)'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-base-200 flex items-center justify-between text-xs">
                <span className="text-success font-semibold flex items-center gap-1 text-[11px]">
                  <span>●</span> Escrow Active
                </span>
                <span className="text-base-content/50 text-[10px]">
                  Assigned: {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
