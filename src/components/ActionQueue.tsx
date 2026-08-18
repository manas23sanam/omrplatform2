import React from 'react';
import { PlayCircle, PenTool, CheckSquare } from 'lucide-react';

export const ActionQueue = () => {
  const actions = [
    {
      id: 1,
      type: 'review',
      title: 'Review Fractions (Prerequisite)',
      time: '8 min',
      icon: <PlayCircle size={18} />,
      color: 'bg-primary-50 text-primary-600',
    },
    {
      id: 2,
      type: 'practice',
      title: 'Practice Linear Equations',
      time: '15 min',
      icon: <PenTool size={18} />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 3,
      type: 'verify',
      title: 'Pass Mastery Check: Decimals',
      time: '5 min',
      icon: <CheckSquare size={18} />,
      color: 'bg-slate-50 text-slate-600',
    }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Today's Learning Plan</h2>
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">3 Tasks</span>
      </div>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <div key={action.id} className="relative group">
            {index !== actions.length - 1 && (
              <div className="absolute top-8 left-6 w-px h-8 bg-gray-200"></div>
            )}
            <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 text-left">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${action.color}`}>
                {action.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm mb-1">{action.title}</div>
                <div className="text-xs text-gray-500 font-medium">{action.time}</div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
