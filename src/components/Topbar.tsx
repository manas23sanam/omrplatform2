import { LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Topbar = ({ onDemoLogout }: { onDemoLogout?: () => void }) => {
  const handleSignOut = () => {
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
      if (onDemoLogout) onDemoLogout();
    } else {
      supabase.auth.signOut();
    }
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          G
        </div>
        <span className="font-bold text-xl text-gray-800 tracking-tight">GD Goenka Public School</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img 
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
            alt="User profile" 
            className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-700">Aditya</p>
            <p className="text-xs text-gray-500">Grade 8</p>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border-l border-gray-100 pl-4"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};
