import { Link } from 'react-router-dom';
import { BookOpen, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300 text-base-content pt-14 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Brand & About platform */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-primary">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>TuitionDesk</span>
          </Link>
          <p className="text-xs text-base-content/70 leading-relaxed">
            TuitionDesk is a dedicated tuition management platform empowering students to connect with verified tutors, schedule tailored learning, and safely hire with Stripe escrow protection.
          </p>

          {/* Social Media Icons with modern X */}
          <div className="flex items-center gap-3 pt-2">
            {/* Modern X (Twitter) Icon */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/70 hover:text-primary hover:border-primary transition-all"
              aria-label="X (formerly Twitter)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/70 hover:text-primary hover:border-primary transition-all"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.5a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/70 hover:text-primary hover:border-primary transition-all"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/70 hover:text-primary hover:border-primary transition-all"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/90 mb-4">Explore</h3>
          <ul className="space-y-2.5 text-xs text-base-content/70">
            <li><Link to="/" className="hover:text-primary transition-colors">Home Feed</Link></li>
            <li><Link to="/tuitions" className="hover:text-primary transition-colors">Browse Tuitions</Link></li>
            <li><Link to="/tutors" className="hover:text-primary transition-colors">Find Verified Tutors</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Our Platform</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Portals & Accounts */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/90 mb-4">Portals</h3>
          <ul className="space-y-2.5 text-xs text-base-content/70">
            <li><Link to="/login" className="hover:text-primary transition-colors">Student Sign In</Link></li>
            <li><Link to="/register" className="hover:text-primary transition-colors">Apply as Tutor</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">User Dashboard</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">Verification Standards</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/90 mb-4">Contact Information</h3>
          <ul className="space-y-3 text-xs text-base-content/70">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>support@tuitiondesk.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>+1 (800) 555-0199</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>500 Howard Street, San Francisco, CA</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-base-300 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-4">
        <p>© {new Date().getFullYear()} Tuition Management System. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-error fill-error" /> for students and educators.
        </p>
      </div>
    </footer>
  );
};
