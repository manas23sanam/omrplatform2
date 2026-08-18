import React from 'react';
import { Flame, Zap, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { getLevelInfo, getStreakMultiplier, formatXp } from '../../lib/gamification';

interface XPWidgetProps {
  xp: number;
  streak: number;
  showCalendar?: boolean;
  className?: string;
}

export const XPWidget: React.FC<XPWidgetProps> = ({
  xp,
  streak,
  showCalendar = true,
  className = '',
}) => {
  const levelInfo = getLevelInfo(xp);
  const multiplier = getStreakMultiplier(streak);

  // 7-day calendar data (last 7 days ending today)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Simulate active status: all 7 days active if streak >= 7, else active on recent days
  const activeDays = [true, true, true, true, true, true, true];

  return (
    <div className={`bg-slate-50 rounded-3xl p-6 md:p-8 space-y-6 ${className}`}>
      {/* Level & XP Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
            L{levelInfo.level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-white px-2.5 py-0.5 rounded-full shadow-2xs">
                Level {levelInfo.level}
              </span>
              <span className="text-xs font-bold text-slate-300">•</span>
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                <Sparkles size={12} className="text-blue-500" />
                {levelInfo.title}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
              {formatXp(xp)}
              <span className="text-sm font-bold text-slate-400">Total XP</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-2xs">
            <Flame size={18} className="text-amber-500 fill-amber-400" />
            <div>
              <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Daily Streak</p>
              <p className="text-sm font-black text-slate-900">{streak} Days Active</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl px-3.5 py-2.5 hidden md:flex items-center gap-2 shadow-2xs">
            <Zap size={16} className="text-blue-600 fill-blue-500" />
            <div>
              <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Multiplier</p>
              <p className="text-xs font-black text-slate-900">{Math.round((multiplier - 1) * 100)}% Bonus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar towards Next Level */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
            <Trophy size={13} className="text-blue-600" />
            {levelInfo.isMaxLevel ? 'Grandmaster Status Achieved' : `Progress to Level ${levelInfo.level + 1}`}
          </span>
          <span className="font-bold text-slate-500">
            {levelInfo.isMaxLevel
              ? 'Max Tier'
              : `${levelInfo.currentLevelXp} / ${levelInfo.maxXp - levelInfo.minXp} XP (${levelInfo.progressPercentage}%)`}
          </span>
        </div>

        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${levelInfo.progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>{levelInfo.minXp} XP</span>
          {!levelInfo.isMaxLevel && (
            <span className="text-blue-600 font-bold">
              {levelInfo.xpNeededForNext} XP to Level {levelInfo.level + 1}
            </span>
          )}
          <span>{levelInfo.maxXp} XP</span>
        </div>
      </div>

      {/* 7-Day Streak Calendar */}
      {showCalendar && (
        <div className="pt-4 border-t border-slate-200/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">7-Day Study Calendar</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                <ShieldCheck size={12} />
                Streak Shield Active
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              +{streak * 10} XP Streak Bonus
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === 6;
              const isActive = activeDays[idx];
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center py-2.5 px-1 rounded-2xl transition-all text-center ${
                    isToday
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isActive
                      ? 'bg-white text-slate-700 shadow-2xs'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase ${isToday ? 'text-blue-100' : 'text-slate-400'}`}>
                    {day}
                  </span>
                  <div className="my-1">
                    {isActive ? (
                      <Flame
                        size={15}
                        className={isToday ? 'text-blue-200 fill-blue-200' : 'text-amber-500 fill-amber-400'}
                      />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 my-0.5" />
                    )}
                  </div>
                  <span className={`text-[10px] font-extrabold ${isToday ? 'text-white' : 'text-slate-600'}`}>
                    {isToday ? 'Today' : `+${10 + idx * 5}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

