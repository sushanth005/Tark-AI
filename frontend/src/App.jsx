import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/History';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route Guard to protect private pages
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

// Separate the routing logic into its own component inside the Provider wrapper
function MainAppRoutes() {
  const { token, loading } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-indigo-500/30 flex flex-col relative overflow-hidden">
        <Navbar />
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <div className="animate-spin w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full mb-4"></div>
            <p className="text-slate-400 font-medium">Loading Application Data...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <PrivateRoute>
                  <HistoryPage />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
        
        <Footer />
      </div>
    </Router>
  );
}

// Ensure the AuthProvider is at the very root of your component tree
export default function App() {
  return (
    <AuthProvider>
      <MainAppRoutes />
    </AuthProvider>
  );
}