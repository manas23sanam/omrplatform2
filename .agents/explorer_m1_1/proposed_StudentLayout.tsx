import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  User, 
  LogOut, 
  BookOpenCheck, 
  Flame, 
  Zap, 
  Trophy 
} from 'lucide-react';
import { useLearningStore } from '../context/LearningStoreContext';
import { BRANDING } from '../config/branding';

export const StudentLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useLearningStore();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/student/dashboard', alias: '/student', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/student/upload', label: 'Upload OMR', icon: <UploadCloud size={20} /> },
    { path: '/student/mock-tests', alias: '/history', label: 'Mock Tests & Improvement', icon: <BookOpenCheck size={20} /> },
    { path: '/student/profile', label: 'Student Profile', icon: <User size={20} /> },
  ];

  const currentXp = currentUser?.xp ?? 1240;
  const currentStreak = currentUser?.streak ?? 15;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-xs hidden md:flex flex-col sticky top-0 h-screen z-30">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            {BRANDING.logoText}
          </div>
          <div>
            <span className="font-bold text-base text-gray-900 tracking-tight leading-tight block">
              {BRANDING.coachingName}
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600">
              Student GPS
            </span>
          </div>
        </div>

        {/* Gamified Stat Pill in Sidebar */}
        <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Zap size={15} className="text-amber-500 fill-amber-400" />
              <span>{currentXp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
              <Flame size={14} className="fill-orange-500 text-orange-500" />
              <span>{currentStreak}d Streak</span>
            </div>
          </div>
          <div className="w-full bg-indigo-100/80 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '68%' }}></div>
          </div>
          <p className="text-[10px] text-gray-500 font-semibold mt-1.5 text-center">Top 10% in {currentUser?.batch || 'Batch A1'}</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.alias && location.pathname === item.alias) ||
              (item.path === '/student/dashboard' && location.pathname === '/student') ||
              (location.pathname.startsWith(item.path) && item.path !== '/student');

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-semibold text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              {BRANDING.logoText}
            </div>
            <span className="font-bold text-gray-900 truncate max-w-[130px]">{BRANDING.coachingName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
              <Zap size={14} className="text-amber-500 fill-amber-400" />
              <span>{currentXp}</span>
            </div>
            <button onClick={handleSignOut} className="p-1 text-gray-400 hover:text-red-500">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Desktop Topbar */}
        <header className="hidden md:flex bg-white border-b border-gray-100 px-8 py-4 items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              {navItems.find(i => location.pathname === i.path || location.pathname === i.alias || (i.path === '/student/dashboard' && location.pathname === '/student'))?.label || 'Student Overview'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Personalized Learning Dashboard • {currentUser?.batch || 'Batch A1 (JEE Advanced 2026)'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Gamification Pills */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-xs">
              <Zap size={16} className="text-amber-500 fill-amber-500" />
              <span>{currentXp.toLocaleString()} XP Earned</span>
            </div>

            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-xs">
              <Flame size={16} className="text-orange-500 fill-orange-500" />
              <span>{currentStreak} Day Streak</span>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{currentUser?.name || 'Rohan Sharma'}</p>
                <p className="text-xs text-gray-500">Roll: BA-2026-101</p>
              </div>
              <img 
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop'} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border border-gray-200 object-cover" 
              />
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-white border-t border-gray-100 flex items-center justify-around sticky bottom-0 z-30 pb-safe shadow-lg">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.alias && location.pathname === item.alias) ||
              (item.path === '/student/dashboard' && location.pathname === '/student') ||
              (location.pathname.startsWith(item.path) && item.path !== '/student');

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-3 flex-1 transition-colors ${
                  isActive ? 'text-indigo-600 font-bold' : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 truncate max-w-[64px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
