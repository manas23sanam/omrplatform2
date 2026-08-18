import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  BrainCircuit,
  User as UserIcon,
  LogOut,
  ArrowLeftRight,
  Zap,
  Flame,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { BRANDING, DEMO_STUDENT } from '../config/branding';
import { useLearningStore } from '../context/LearningStoreContext';

interface StudentLayoutProps {
  onSignOut?: () => void;
  onSwitchRole?: (role: 'teacher' | 'student') => void;
  studentData?: {
    name: string;
    batch: string;
    avatarUrl: string;
    xp: number;
    streak: number;
  };
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  onSignOut,
  onSwitchRole,
  studentData,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, loginAs } = useLearningStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use store student or passed props or fallback to standard demo student
  const student = {
    name: currentUser?.name || studentData?.name || DEMO_STUDENT.name,
    batch: currentUser?.batch || studentData?.batch || DEMO_STUDENT.batch,
    avatarUrl: currentUser?.avatarUrl || studentData?.avatarUrl || DEMO_STUDENT.avatarUrl,
    xp: currentUser?.xp ?? studentData?.xp ?? DEMO_STUDENT.xp,
    streak: currentUser?.streak ?? studentData?.streak ?? DEMO_STUDENT.streak,
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      path: '/student',
      exact: true,
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/student/mock-tests',
      exact: false,
      label: 'Mock Tests & Improvement',
      icon: <BrainCircuit size={20} />,
      badge: 'Targeted',
    },
    {
      path: '/student/profile',
      exact: false,
      label: 'My Profile',
      icon: <UserIcon size={20} />,
    },
  ];

  const handleRoleSwitch = () => {
    if (onSwitchRole) {
      onSwitchRole('teacher');
    } else {
      loginAs('teacher');
      navigate('/teacher');
    }
  };

  const handleLogout = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      logout();
      navigate('/login');
    }
  };

  const isNavActive = (path: string, exact: boolean) => {
    if (exact) {
      return (
        location.pathname === '/student' ||
        location.pathname === '/student/' ||
        location.pathname === '/student/dashboard'
      );
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/student/upload')) return 'OMR Sheet Scanner & AI Evaluation';
    if (location.pathname.startsWith('/student/mock-tests')) return 'AI Mock Tests & Targeted Remediation';
    if (location.pathname.startsWith('/student/profile')) return 'Student Performance & Achievement Profile';
    if (location.pathname.startsWith('/student/analysis')) return 'Test Diagnostic & Root-Cause Roadmap';
    if (location.pathname.startsWith('/student/practice')) return 'Interactive Concept Verification Quiz';
    if (location.pathname.startsWith('/student/history')) return 'Past Test History & Topic Heatmap';
    return 'Student Learning Overview';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* ============================================================ */}
      {/* Desktop Sidebar Navigation                                    */}
      {/* ============================================================ */}
      <aside className="w-64 bg-white border-r border-slate-100 shadow-sm hidden md:flex flex-col sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-100">
              {BRANDING.logoText}
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-base text-slate-900 tracking-tight block truncate">
                {BRANDING.coachingName}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                <Sparkles size={10} /> Student Portal
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Learning Navigation
          </p>
          {navItems.map((item) => {
            const active = isNavActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                  active
                    ? 'bg-blue-50 text-blue-700 shadow-xs border-r-4 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Role Switch & Sign Out) */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <button
            type="button"
            onClick={handleRoleSwitch}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-2xs cursor-pointer"
            title="Switch to Teacher Portal view"
          >
            <span className="flex items-center gap-2">
              <ArrowLeftRight size={14} className="text-blue-600" />
              Switch to Teacher
            </span>
            <span className="text-[10px] text-slate-400">Demo</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* Main Content Area                                             */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              {BRANDING.logoText}
            </div>
            <span className="font-extrabold text-sm text-slate-900 truncate">
              {BRANDING.coachingName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-black">
              <Zap size={12} className="text-slate-500 fill-slate-400" />
              <span>{student.xp.toLocaleString()}</span>
            </div>
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col">
            <div className="bg-white w-4/5 max-w-xs h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    {BRANDING.logoText}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{BRANDING.coachingName}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase">Student Portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Student Summary in Mobile Drawer */}
              <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-900">{student.name}</p>
                <p className="text-[10px] text-slate-500">{student.batch}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <Zap size={12} className="text-slate-500 fill-slate-400" />
                    <span>{student.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                    <Flame size={12} className="text-slate-500 fill-slate-400" />
                    <span>{student.streak} Days</span>
                  </div>
                </div>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const active = isNavActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm ${
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleRoleSwitch}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl"
                >
                  <ArrowLeftRight size={14} /> Switch to Teacher Portal
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Topbar */}
        <header className="hidden md:flex bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Student Profile Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-tight">{student.name}</p>
                <p className="text-[11px] text-slate-500 font-semibold">{student.batch}</p>
              </div>
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-9 h-9 rounded-full border border-slate-200 object-cover shadow-2xs"
              />
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden bg-white border-t border-slate-100 flex items-center justify-around sticky bottom-0 z-30 pb-safe shadow-lg">
          {navItems.map((item) => {
            const active = isNavActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-3 flex-1 transition-colors ${
                  active ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
