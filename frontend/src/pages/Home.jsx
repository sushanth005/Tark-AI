import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Target, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-indigo-500/30 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            The Next Generation ATS Optimizer
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Master the ATS with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Precision AI</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Tark AI analyzes your resume against target job descriptions with uncompromising accuracy. Generate powerful, perfectly tailored cover letters in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition flex items-center justify-center gap-2">
              Start Free Scan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-2xl hover:bg-slate-800 hover:text-white transition flex items-center justify-center">
              Explore Features
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-800/50">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 border border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-3">Hyper-Targeted Matching</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Matches hard skills with explicit precision. Don't leave your application up to chance.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-3">Actionable Improvements</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Get explicit feedback pointing exactly to where you need to improve your resume phrasing.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-2xl flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-3">Instant Cover Letters</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Generate highly persuasive, custom-tailored cover letters based on your analysis in seconds.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
