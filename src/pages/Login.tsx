import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
} from 'lucide-react';
import { BRANDING, DEMO_STUDENT, DEMO_TEACHER } from '../config/branding';
import { useLearningStore } from '../context/LearningStoreContext';

interface LoginProps {
  onDemoLogin?: (role?: 'teacher' | 'student') => void;
}

export const Login: React.FC<LoginProps> = ({ onDemoLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, loginAs, loginWithCredentials } = useLearningStore();

  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to active portal
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      if (from && from !== '/login' && from !== '/') {
        navigate(from, { replace: true });
      } else if (currentUser.role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate, location.state]);

  // Pre-fill credentials based on active tab for the demo
  useEffect(() => {
    if (activeTab === 'teacher') {
      setEmail(DEMO_TEACHER.email);
      setPassword('teacher@123');
    } else {
      setEmail(DEMO_STUDENT.email);
      setPassword('student@123');
    }
    setError(null);
  }, [activeTab]);

  // Credential Form Submit Handler
  const handleCredentialAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (loginWithCredentials) {
        const result = await loginWithCredentials(email, password, activeTab);
        if (!result.success) {
          setError(result.error || 'Invalid email or password.');
          setLoading(false);
          return;
        }
      } else {
        loginAs(activeTab);
      }

      setLoading(false);
      if (activeTab === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-200">
            {BRANDING.logoText}
          </div>
          <div>
            <span className="font-black text-xl text-slate-900 tracking-tight block">
              {BRANDING.coachingName}
            </span>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              AI OMR Diagnostic & Remediation Platform
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
            NEET 2026 Ready
          </span>
        </div>
      </header>

      {/* Main Single-Panel Login Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 py-4 md:py-8 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Sign in to continue
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          {/* Role Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap size={16} className={activeTab === 'student' ? 'text-slate-600' : ''} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('teacher')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'teacher'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users size={16} className={activeTab === 'teacher' ? 'text-blue-600' : ''} />
              Teacher
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {/* Credential Form */}
          <form onSubmit={handleCredentialAuth} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                {activeTab === 'teacher' ? 'Faculty Email ID' : 'Student Email / ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'teacher' ? 'skverma@brothersacademy.edu' : 'rohan.sharma@brothersacademy.edu'}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In as {activeTab === 'teacher' ? 'Teacher' : 'Student'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Info Note */}
          <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2 text-center justify-center">
            <ShieldCheck size={14} className="text-blue-600 shrink-0" />
            <span>
              Demo credentials pre-filled.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-8">
        <p>© 2026 {BRANDING.coachingName}. All Rights Reserved. • Support: {BRANDING.supportEmail}</p>
      </footer>
    </div>
  );
};
