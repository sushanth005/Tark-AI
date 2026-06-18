import { Target, ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 py-12 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center justify-center md:justify-start gap-2">
            <Target size={18} className="text-indigo-600 dark:text-indigo-400" /> Tark AI
          </h3>
          <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
            Empowering job seekers with precision ATS analysis and automated, highly-tailored cover letter generation.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" /> Privacy & Security
          </h3>
          <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed">
            Your resumes and personal data are strictly confidential and only processed for your own optimization insights.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center justify-center md:justify-start gap-2">
            <Mail size={18} className="text-pink-600 dark:text-pink-400" /> Contact
          </h3>
          <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed">
            Need support or have feedback?<br />
            Reach out to us at <a href="mailto:support@tarkai.com" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">support@tarkai.com</a>
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/50 text-center text-slate-500 dark:text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} Tark AI. All rights reserved. Developed by Sushanth Bandari</p>
      </div>
    </footer>
  );
}
