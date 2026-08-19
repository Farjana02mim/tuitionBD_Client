import { useState } from 'react';
import Swal from 'sweetalert2';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle } from 'lucide-react';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      Swal.fire({
        icon: 'success',
        title: 'Message Received!',
        text: 'Thank you for reaching out. Our support team will get back to you within 24 hours.',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="badge badge-primary badge-outline text-xs font-bold uppercase">
          Support & Inquiries
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
          Get in Touch with Our Team
        </h1>
        <p className="text-xs text-base-content/60">
          Have questions about tuition posting, tutor verification, or Stripe payments? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & Help Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-base-content">Contact Channels</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3 bg-base-200/40 rounded-2xl">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-base-content block">Email Support</span>
                  <span className="text-base-content/70">support@tuitiondesk.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-base-200/40 rounded-2xl">
                <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-base-content block">Telephone Help Desk</span>
                  <span className="text-base-content/70">+1 (800) 555-0199 (Mon - Fri)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-base-200/40 rounded-2xl">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-base-content block">Headquarters</span>
                  <span className="text-base-content/70">500 Howard Street, San Francisco, CA 94105</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ summary */}
          <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-base-content">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Frequently Asked Questions</span>
            </div>
            <div className="text-xs text-base-content/70 space-y-2">
              <p><strong className="text-base-content">How are tutors verified?</strong> Tutors must upload educational transcripts and pass manual screening.</p>
              <p><strong className="text-base-content">When is payment charged?</strong> Payment occurs through Stripe only after a student accepts an applicant.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="card bg-base-100 border border-base-200 p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-base-content">Send Us a Direct Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-xs">Your Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-xs">Your Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="input input-bordered input-sm rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-xs">Subject *</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding tutor application approval"
                  className="input input-bordered input-sm rounded-xl text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-xs">Message / Details *</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="textarea textarea-bordered text-xs rounded-2xl"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs shadow-sm"
              >
                {isSending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
