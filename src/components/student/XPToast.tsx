import React, { useEffect, useState } from 'react';
import { Zap, Sparkles, CheckCircle2, X } from 'lucide-react';
import { formatXp } from '../../lib/gamification';

interface XPToastProps {
  amount: number;
  reason?: string;
  onClose?: () => void;
  autoCloseMs?: number;
}

export const XPToast: React.FC<XPToastProps> = ({
  amount,
  reason = 'Task Completed',
  onClose,
  autoCloseMs = 4000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, autoCloseMs);

    return () => clearTimeout(timer);
  }, [autoCloseMs, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white px-5 py-4 rounded-3xl shadow-2xl border border-slate-400/40 flex items-center gap-4 max-w-sm backdrop-blur-md">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg animate-bounce">
          <Zap size={22} className="fill-slate-950" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-black uppercase tracking-wider">
            <Sparkles size={13} />
            <span>+{formatXp(amount)} XP Earned!</span>
          </div>
          <p className="text-xs text-slate-300 font-medium truncate mt-0.5">{reason}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
