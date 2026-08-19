import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { PlusCircle, BookOpen, MapPin, DollarSign, Calendar, FileText, Send } from 'lucide-react';

export const PostTuition = () => {
  const [subject, setSubject] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [schedule, setSchedule] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !studentClass || !location || !budget) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Required Fields',
        text: 'Please fill in all mandatory fields.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosSecure.post('/tuitions', {
        subject,
        class: studentClass,
        location,
        budget: Number(budget),
        schedule,
        description,
      });

      Swal.fire({
        icon: 'success',
        title: 'Tuition Posted!',
        text: 'Your requirement was submitted and is pending admin approval.',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/dashboard/student/my-tuitions');
    } catch (error) {
      console.error('Post tuition error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-base-200 pb-4">
        <h1 className="text-2xl font-black text-base-content tracking-tight">Post New Tuition Requirement</h1>
        <p className="text-xs text-base-content/60 mt-1">
          Provide complete details about the subject, grade level, and schedule so verified tutors can apply.
        </p>
      </div>

      <div className="card bg-base-100 border border-base-200 p-6 md:p-8 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs">Subject / Topic *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <BookOpen className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Higher Mathematics, Physics"
                  className="input input-bordered input-sm w-full pl-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs">Class / Grade Level *</span>
              </label>
              <input
                type="text"
                required
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="e.g. Grade 10 / O-Level / College"
                className="input input-bordered input-sm w-full text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs">Location / Mode *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Online (Zoom) / Downtown San Francisco"
                  className="input input-bordered input-sm w-full pl-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs">Monthly Budget ($ USD) *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 300"
                  className="input input-bordered input-sm w-full pl-10 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Preferred Schedule / Days</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. 3 Days/Week (Mon, Wed, Fri after 5 PM)"
                className="input input-bordered input-sm w-full pl-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs">Detailed Requirements / Goals</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe learning goals, specific textbooks, exam targets, or tutor preferences..."
              className="textarea textarea-bordered text-xs rounded-2xl"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block rounded-xl font-bold text-sm gap-2 shadow-md shadow-primary/20"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Submit Tuition Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
