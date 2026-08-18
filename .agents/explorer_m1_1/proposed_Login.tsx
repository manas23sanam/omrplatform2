import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BrainCircuit, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { useLearningStore } from '../context/LearningStoreContext';
import { BRANDING } from '../config/branding';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs } = useLearningStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleTeacherDemo = () => {
    loginAs('teacher');
    navigate('/teacher/dashboard');
  };

  const handleStudentDemo = () => {
    loginAs('student');
    navigate('/student/dashboard');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    setTimeout(() => {
      setLoading(false);
      // Auto-detect role or default to student
      if (email.toLowerCase().includes('teacher') || email.toLowerCase().includes('faculty')) {
        loginAs('teacher');
        navigate('/teacher/dashboard');
      } else {
        loginAs('student');
        navigate('/student/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-3xl shadow-xl shadow-indigo-500/20 mb-4 border border-indigo-400/30">
          {BRANDING.logoText}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {BRANDING.coachingName}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 font-medium">
          AI-Powered OMR Diagnostic & Adaptive Learning Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {/* Dual Role 1-Click Fast Gateway Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Sparkles size={14} /> 1-Click Demo Portals
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Select Your Role to Enter
            </h2>
            <p className="text-xs text-slate-400">
              Instant login with fully populated JEE/NEET analytics and interactive diagnostic workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Teacher Fast Gateway Card */}
            <button
              onClick={handleTeacherDemo}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 hover:from-indigo-950/60 hover:to-slate-800 border border-slate-700 hover:border-indigo-500/80 transition-all text-left flex flex-col justify-between shadow-md hover:shadow-indigo-500/10 cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <GraduationCap size={24} />
                </div>
                <div className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 mb-1.5">
                  Educator Portal
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                  Teacher Login
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Dr. Vikram Malhotra • Class Analytics, Student Deep Dive & MCQ Test Assignment.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                <span>Enter Teacher Dashboard</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Student Fast Gateway Card */}
            <button
              onClick={handleStudentDemo}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 hover:from-emerald-950/60 hover:to-slate-800 border border-slate-700 hover:border-emerald-500/80 transition-all text-left flex flex-col justify-between shadow-md hover:shadow-emerald-500/10 cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Users size={24} />
                </div>
                <div className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 mb-1.5">
                  Learner Portal
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                  Student Login
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Rohan Sharma • OMR Multi-Section Upload, Gamified XP, Leaderboards & Weak Topics.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>Enter Student Dashboard</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-3 bg-slate-900 text-slate-500 font-bold">Or sign in with credentials</span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {msg && (
              <div className="p-3 rounded-xl text-xs font-medium bg-emerald-950/60 border border-emerald-800/80 text-emerald-300">
                {msg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@brothersacademy.edu or student@brothersacademy.edu"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Authenticating...
                </>
              ) : isSignUp ? (
                'Create Account & Enter'
              ) : (
                'Sign In with Email'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-slate-400 hover:text-indigo-400 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        </div>

        {/* Security & White-label Footer Note */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-indigo-400" />
          <span>Secured with AI Learning GPS Diagnostic Engine • {BRANDING.coachingName}</span>
        </div>
      </div>
    </div>
  );
};
