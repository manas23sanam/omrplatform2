import React from 'react';
import { Trophy, Medal, Star, Flame, Crown, Zap } from 'lucide-react';
import { useLearningStore } from '../context/LearningStoreContext';

export const Leaderboard = () => {
  const { leaderboard, selectedBatch } = useLearningStore();

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-slate-300" size={32} />
            <h2 className="text-3xl font-black">{selectedBatch} Cohort League</h2>
          </div>
          <p className="text-blue-100 text-lg opacity-90">Live cohort rankings based on test performance & learning XP!</p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none scale-150 translate-x-1/4 -translate-y-1/4">
          <Crown size={240} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xs border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">Current Rankings</h3>
          <span className="text-xs font-bold text-slate-400">Dynamic XP Leaderboard</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {leaderboard.map((student) => (
            <div 
              key={student.studentId} 
              className={`flex items-center justify-between p-6 transition-colors ${
                student.isCurrentStudent ? 'bg-blue-50/60 border-l-4 border-blue-600' : 'hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className="w-8 text-center font-black text-slate-400 text-lg">
                  {student.rank === 1 ? <Medal size={28} className="text-slate-500 mx-auto" /> : 
                   student.rank === 2 ? <Medal size={28} className="text-slate-400 mx-auto" /> :
                   student.rank === 3 ? <Medal size={28} className="text-slate-600 mx-auto" /> :
                   `#${student.rank}`}
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className={`w-12 h-12 rounded-full object-cover shadow-2xs border ${
                      student.isCurrentStudent ? 'border-2 border-blue-500' : 'border-slate-200'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-extrabold text-base ${student.isCurrentStudent ? 'text-blue-900' : 'text-slate-900'}`}>
                        {student.name}
                      </h4>
                      {student.isCurrentStudent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 text-slate-600 font-bold">
                        <Flame size={14} className="text-slate-500 fill-slate-400" />
                        {student.streak} Days
                      </span>
                      <span>•</span>
                      <span>Score: {student.score}/300</span>
                      <span>•</span>
                      <span>{student.accuracy}% Acc</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
                <Zap size={16} className="text-slate-500 fill-slate-400" />
                <span className="font-black text-base text-slate-900">{student.totalXp.toLocaleString()} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
