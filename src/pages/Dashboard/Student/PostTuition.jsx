import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { BookOpen, MapPin, DollarSign, Calendar, FileText, Send } from 'lucide-react';

export const PostTuition = () => {
  const { user } = useAuth();
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
    if (!subject.trim() || !studentClass.trim() || !location.trim() || !budget) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Required Fields',
        text: 'Please fill in Subject, Class, Location, and Budget.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // নিশ্চিতভাবে ফ্রেশ টোকেন নেওয়া
      const token = await user?.getIdToken();

      const payload = {
        subject: subject.trim(),
        class: studentClass.trim(),
        location: location.trim(),
        budget: Number(budget),
        schedule: (schedule || 'Flexible').trim(),
        description: (description || '').trim(),
      };

      const res = await axiosSecure.post('/tuitions', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data?.success || res.status === 201 || res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Tuition Posted!',
          text: 'Your tuition requirement was successfully saved to the database.',
          timer: 2000,
          showConfirmButton: false,
        });

        navigate('/dashboard/student/my-tuitions');
      }
    } catch (error) {
      console.error('Post tuition error:', error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Failed to save tuition to database.';

      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: errorMsg,
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
                  placeholder="e.g. Online (Zoom) / Dhanmondi, Dhaka"
                  className="input input-bordered input-sm w-full pl-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs">Monthly Budget (BDT / USD) *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 5000"
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
                placeholder="e.g. 3 Days/Week (Sun, Tue, Thu after 6 PM)"
                className="input input-bordered input-sm w-full pl-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span className='pr-6'>Description</span>
              </span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter tuition description (e.g. Needs help with calculus and mechanics; student prepares for exams; requires female/male tutor with experience)..."
              className="textarea textarea-bordered text-xs rounded-2xl focus:textarea-primary"
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
              <span>{isSubmitting ? 'Posting to Database...' : 'Submit Tuition Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostTuition;
