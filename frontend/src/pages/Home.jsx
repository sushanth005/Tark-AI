import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Target, FileText, MessageSquare, History } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <main className="flex-1 relative overflow-hidden animate-fade-in">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none transition-colors duration-1000"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000"></div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            The Next Generation ATS Optimizer
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900 dark:text-slate-50">
            Master the ATS with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Precision AI</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Tark AI analyzes your resume against target job descriptions with uncompromising accuracy. Generate powerful, perfectly tailored cover letters in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition flex items-center justify-center gap-2">
              Start Free Scan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" onClick={(e) => {
              e.preventDefault();
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }} className="px-8 py-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center">
              Explore Features
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200 dark:border-slate-800/50">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm shadow-sm dark:shadow-none hover:border-indigo-200 dark:hover:border-slate-700 transition animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-3">Hyper-Targeted Matching</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Matches hard skills with explicit precision. Don't leave your application up to chance.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm shadow-sm dark:shadow-none hover:border-purple-200 dark:hover:border-slate-700 transition animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-3">Actionable Improvements</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Get explicit feedback pointing exactly to where you need to improve your resume phrasing.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm shadow-sm dark:shadow-none hover:border-pink-200 dark:hover:border-slate-700 transition animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-3">Instant Cover Letters</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Generate highly persuasive, custom-tailored cover letters based on your analysis in seconds.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm shadow-sm dark:shadow-none hover:border-emerald-200 dark:hover:border-slate-700 transition animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-3">AI Mock Interviews</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Practice your interview skills with our intelligent AI interviewer and get real-time feedback.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm shadow-sm dark:shadow-none hover:border-blue-200 dark:hover:border-slate-700 transition animate-slide-up" style={{ animationDelay: '500ms' }}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <History size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-3">Analysis History</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Keep track of all your previous resume analyses, cover letters, and monitor your progress over time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
