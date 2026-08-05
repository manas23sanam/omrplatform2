import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, History, User, LogOut, FileText } from 'lucide-react';
import { BRANDING, DEMO_STUDENT } from '../config/branding';

export const StudentLayout = ({ onSignOut }: { onSignOut: () => void }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/upload', label: 'Upload OMR', icon: <UploadCloud size={20} /> },
    { path: '/history', label: 'Past Tests', icon: <History size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-sm hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            {BRANDING.logoText}
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight leading-tight">
            {BRANDING.coachingName}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              {BRANDING.logoText}
            </div>
            <span className="font-bold text-gray-900 truncate max-w-[150px]">{BRANDING.coachingName}</span>
          </div>
          <img src={DEMO_STUDENT.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
        </header>

        {/* Desktop Topbar */}
        <header className="hidden md:flex bg-white border-b border-gray-100 px-8 py-4 items-center justify-between sticky top-0 z-20">
          <h1 className="text-xl font-bold text-gray-800">
            {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Overview'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{DEMO_STUDENT.name}</p>
              <p className="text-xs text-gray-500">{DEMO_STUDENT.batch}</p>
            </div>
            <img src={DEMO_STUDENT.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" />
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-white border-t border-gray-100 flex items-center justify-around sticky bottom-0 z-30 pb-safe">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-3 flex-1 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
