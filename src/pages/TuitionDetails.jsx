import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { useAxiosSecure } from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  MapPin,
  Calendar,
  DollarSign,
  User,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TuitionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [role] = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [qualifications, setQualifications] = useState('');
  const [experience, setExperience] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Fetch tuition details
  const { data, isLoading } = useQuery({
    queryKey: ['tuitionDetails', id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/tuitions/${id}`);
      return res.data;
    },
  });

  const tuition = data?.tuition;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (role !== 'tutor' && role !== 'admin') {
      Swal.fire({
        icon: 'warning',
        title: 'Tutor Account Required',
        text: 'Only registered tutors can apply to tuition requirements.',
      });
      return;
    }

    setIsApplying(true);
    try {
      await axiosSecure.post('/applications', {
        tuitionId: id,
        qualifications,
        experience,
        expectedSalary: Number(expectedSalary) || Number(tuition.budget),
      });

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'The student will review your qualifications and contact you.',
      });

      // Clear form
      setQualifications('');
      setExperience('');
      setExpectedSalary('');
    } catch (error) {
      console.error('Application error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Application Failed',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading tuition requirement..." />;
  }

  if (!tuition) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Tuition Post Not Found</h2>
        <Link to="/tuitions" className="btn btn-primary btn-sm">
          Return to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <Link to="/tuitions" className="inline-flex items-center gap-2 text-xs font-bold text-base-content/60 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tuitions</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 border border-base-200 p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge badge-primary badge-sm font-semibold text-xs mb-2">
                  Class: {tuition.class}
                </span>
                <h1 className="text-3xl font-black text-base-content">{tuition.subject}</h1>
              </div>
              <span className="badge badge-success badge-outline font-semibold uppercase text-xs">
                {tuition.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-base-200/50 p-4 rounded-2xl">
                <span className="text-base-content/60 block mb-1">Monthly Budget</span>
                <span className="font-extrabold text-lg text-primary">${tuition.budget}/mo</span>
              </div>
              <div className="bg-base-200/50 p-4 rounded-2xl">
                <span className="text-base-content/60 block mb-1">Location</span>
                <span className="font-extrabold text-sm text-base-content">{tuition.location}</span>
              </div>
              <div className="bg-base-200/50 p-4 rounded-2xl">
                <span className="text-base-content/60 block mb-1">Schedule</span>
                <span className="font-extrabold text-sm text-base-content">{tuition.schedule || 'Flexible'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-sm text-base-content">Requirement Description</h3>
              <p className="text-sm text-base-content/80 leading-relaxed bg-base-200/30 p-4 rounded-2xl border border-base-200">
                {tuition.description || 'Student is looking for an experienced teacher to provide structured weekly lessons.'}
              </p>
            </div>
          </div>
        </div>

        {/* Application Form Sidebar for Tutors */}
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-base-content">Apply for this Tuition</h3>
            <p className="text-xs text-base-content/60">
              Submit your teaching background to apply as the assigned tutor for this student.
            </p>

            {user ? (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-xs">Your Name (Auto)</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.displayName || user.email}
                    className="input input-bordered input-sm rounded-xl text-xs bg-base-200/50"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-xs">Your Email (Auto)</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.email}
                    className="input input-bordered input-sm rounded-xl text-xs bg-base-200/50"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-xs">Qualifications / Degree</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="e.g. B.Sc in Mathematics, MIT"
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-xs">Teaching Experience</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 4+ years tutoring High School"
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-xs">Expected Monthly Salary ($)</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder={String(tuition.budget || 200)}
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isApplying}
                  className="btn btn-primary btn-block btn-sm rounded-xl font-bold gap-2 mt-2"
                >
                  {isApplying ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Application</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-base-content/70">
                  You must be logged in as a registered tutor to apply.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm btn-block rounded-xl">
                  Sign In to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
