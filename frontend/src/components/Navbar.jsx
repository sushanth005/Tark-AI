import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, History, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <nav className="border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Tark AI Logo" className="w-9 h-9 object-contain drop-shadow-lg" />
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400">
              Tark AI
            </h1>
          </Link>
          
          {token && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className={`flex items-center gap-2 text-sm font-medium transition ${location.pathname === '/dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/history" className={`flex items-center gap-2 text-sm font-medium transition ${location.pathname === '/history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                <History size={16} /> History
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex gap-4 items-center">
          {!token ? (
            <>
              <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">
                Log in
              </Link>
              <Link to="/register" className="px-5 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 rounded-xl dark:hover:bg-slate-200 transition shadow-sm">
                Sign up
              </Link>
            </>
          ) : (
            <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition">
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sign Out</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition border border-red-500/20 hover:border-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
