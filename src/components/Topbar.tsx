import React from 'react';
import { LogOut } from 'lucide-react';
import { BRANDING, DEMO_STUDENT } from '../config/branding';
import { useLearningStore } from '../context/LearningStoreContext';

export const Topbar = ({ onDemoLogout }: { onDemoLogout?: () => void }) => {
  const { currentUser, logout } = useLearningStore();

  const handleSignOut = () => {
    if (onDemoLogout) {
      onDemoLogout();
    } else {
      logout();
    }
  };

  const student = {
    name: currentUser?.name || DEMO_STUDENT.name,
    batch: currentUser?.batch || DEMO_STUDENT.batch,
    avatarUrl: currentUser?.avatarUrl || DEMO_STUDENT.avatarUrl,
  };

  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-100 sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-xs">
          {BRANDING.logoText}
        </div>
        <span className="font-extrabold text-base text-slate-900 tracking-tight">{BRANDING.coachingName}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img 
            src={student.avatarUrl} 
            alt="User profile" 
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
          />
          <div className="hidden md:block">
            <p className="text-xs font-black text-slate-900 leading-tight">{student.name}</p>
            <p className="text-[10px] text-slate-500">{student.batch}</p>
          </div>
        </div>

        <button 
          type="button"
          onClick={handleSignOut}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

