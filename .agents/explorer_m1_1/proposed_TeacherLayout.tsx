import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileSpreadsheet, 
  LogOut, 
  GraduationCap, 
  ChevronDown, 
  BookOpen, 
  UserCheck 
} from 'lucide-react';
import { useLearningStore } from '../context/LearningStoreContext';
import { BRANDING } from '../config/branding';

export const TeacherLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, batches, selectedBatch, setSelectedBatch } = useLearningStore();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { 
      path: '/teacher/dashboard', 
      alias: '/teacher', 
      label: 'Class Analytics', 
      icon: <BarChart3 size={20} />,
      badge: 'Live'
    },
    { 
      path: '/teacher/students', 
      label: 'Student Deep Dive', 
      icon: <Users size={20} />,
      badge: '48 Students'
    },
    { 
      path: '/teacher/tests', 
      label: 'Test & MCQ Engine', 
      icon: <FileSpreadsheet size={20} />,
      badge: '7 Tests'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900/5 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-100 hidden md:flex flex-col sticky top-0 h-screen shadow-xl z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {BRANDING.logoText}
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight leading-tight block">
              {BRANDING.coachingName}
            </span>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-400">
              Teacher Portal
            </span>
          </div>
        </div>

        {/* Batch Status Pill */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/40">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Active Batch
          </label>
          <div className="relative">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs font-semibold rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-400 appearance-none pr-8 cursor-pointer"
            >
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.alias && location.pathname === item.alias) ||
              (item.path === '/teacher/dashboard' && location.pathname === '/teacher') ||
              (location.pathname.startsWith(item.path) && item.path !== '/teacher');

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Sign Out */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-3 bg-slate-800/60 rounded-xl">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
              alt="Educator avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">{currentUser?.name || 'Dr. Vikram Malhotra'}</p>
              <p className="text-[10px] text-indigo-400 truncate">{currentUser?.subjectSpecialization || 'Senior Faculty'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 px-4 py-2.5 w-full text-center rounded-xl font-semibold text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-rose-500/20"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
              {BRANDING.logoText}
            </div>
            <span className="font-bold text-sm truncate max-w-[140px]">{BRANDING.coachingName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-1 rounded-md font-bold">Teacher</span>
            <button onClick={handleSignOut} className="text-slate-400 hover:text-white">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Desktop Header Topbar */}
        <header className="hidden md:flex bg-white border-b border-gray-100 px-8 py-4 items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              {navItems.find(i => location.pathname === i.path || location.pathname === i.alias || (i.path === '/teacher/dashboard' && location.pathname === '/teacher'))?.label || 'Teacher Workspace'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Viewing insights for <strong className="text-indigo-600 font-bold">{selectedBatch}</strong> • Academic Term 2025-2026
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200/60 text-xs font-bold">
              <UserCheck size={14} />
              <span>48 Students Enrolled</span>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{currentUser?.name || 'Dr. Vikram Malhotra'}</p>
                <p className="text-xs text-gray-500">Academic Head • Physics</p>
              </div>
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
