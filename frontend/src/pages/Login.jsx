import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-indigo-500/30 flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white mb-6">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-400">Optimize your resume against ATS matching algorithms</p>
        </div>

        <div className="mt-8 sm:mx-auto w-full max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-xl border border-slate-800/50 sm:rounded-3xl sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-300">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-200 placeholder-slate-500 transition" placeholder="Enter your mail address here" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-200 placeholder-slate-500 transition" placeholder="Enter your password here" />
              </div>

              <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/25 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/40 transition">
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              New to the portal?{' '}
              <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}