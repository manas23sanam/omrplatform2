import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Zap,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Award,
} from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import type { LeaderboardEntry } from '../../types/student';
import { formatXp } from '../../lib/gamification';

type TimeframeOption = 'Weekly' | 'Monthly' | 'All-Time';
type SubjectDomain = 'All' | 'Physics' | 'Chemistry' | 'Biology';

export const BatchLeaderboard: React.FC = () => {
  const { leaderboard, selectedBatch, currentUser } = useLearningStore();
  const [timeframe, setTimeframe] = useState<TimeframeOption>('All-Time');
  const [subjectDomain, setSubjectDomain] = useState<SubjectDomain>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Compute movement and adjustments based on timeframe & domain
  const processedLeaderboard = useMemo(() => {
    return leaderboard.map((entry, index) => {
      // Deterministic simulated movement indicators
      let movement: { type: 'up' | 'down' | 'same'; delta: number } = { type: 'same', delta: 0 };
      if (index === 0) movement = { type: 'same', delta: 0 };
      else if (index === 1) movement = { type: 'up', delta: 2 };
      else if (index === 2) movement = { type: 'down', delta: 1 };
      else if (index === 3) movement = { type: 'up', delta: 1 };
      else if (index % 2 === 0) movement = { type: 'up', delta: 1 };
      else movement = { type: 'same', delta: 0 };

      // Calculate timeframe multiplier
      let adjustedXp = entry.totalXp;
      if (timeframe === 'Weekly') {
        adjustedXp = Math.round(entry.totalXp * 0.28);
      } else if (timeframe === 'Monthly') {
        adjustedXp = Math.round(entry.totalXp * 0.65);
      }

      // Calculate subject domain adjustments
      if (subjectDomain === 'Physics') {
        adjustedXp = Math.round(adjustedXp * 0.36);
      } else if (subjectDomain === 'Chemistry') {
        adjustedXp = Math.round(adjustedXp * 0.32);
      } else if (subjectDomain === 'Biology') {
        adjustedXp = Math.round(adjustedXp * 0.32);
      }

      const isCurrent =
        entry.isCurrentStudent ||
        entry.studentId === currentUser?.id ||
        entry.name.toLowerCase().includes('rohan');

      return {
        ...entry,
        isCurrentStudent: isCurrent,
        displayXp: adjustedXp,
        movement,
      };
    });
  }, [leaderboard, timeframe, subjectDomain, currentUser]);

  // Filter by search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return processedLeaderboard;
    return processedLeaderboard.filter((entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [processedLeaderboard, searchQuery]);

  const top3 = processedLeaderboard.slice(0, 3);
  const rank1 = top3[0];
  const rank2 = top3[1];
  const rank3 = top3[2];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-xs border border-blue-400/30">
              <Trophy size={14} className="text-slate-400" />
              {selectedBatch || 'Batch A1 - NEET 2026'} Leaderboard
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Cohort League Standings</h2>
            <p className="text-blue-200 text-xs md:text-sm mt-1 max-w-xl">
              Compete with your peers through test performance, OMR scans, and continuous practice quiz mastery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {(['Weekly', 'Monthly', 'All-Time'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-slate-400 text-slate-950 shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
          <Crown size={220} />
        </div>
      </div>

      {/* Top 3 Podium Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
        {/* 2nd Place (Silver) */}
        {rank2 && (
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-100 to-white rounded-3xl p-5 border-2 border-slate-200 shadow-2xs flex flex-col items-center text-center relative hover:-translate-y-1 transition-transform">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-white font-black text-xs flex items-center justify-center shadow-md ring-4 ring-white">
              #2
            </div>
            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-slate-400 to-slate-200 shadow-md my-2">
              <img
                src={rank2.avatarUrl}
                alt={rank2.name}
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
            <h4 className="font-black text-sm text-slate-900 mt-1">{rank2.name}</h4>
            <p className="text-[11px] text-slate-500 font-medium">{rank2.accuracy}% Accuracy</p>
            <div className="mt-3 bg-slate-100 px-3 py-1 rounded-xl flex items-center gap-1.5 text-xs font-black text-slate-700">
              <Zap size={13} className="text-slate-500 fill-slate-400" />
              <span>{formatXp(rank2.displayXp)} XP</span>
            </div>
          </div>
        )}

        {/* 1st Place (Gold Crown) */}
        {rank1 && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 border-2 border-slate-300 shadow-lg flex flex-col items-center text-center relative hover:-translate-y-1 transition-transform md:-mt-4">
            <div className="absolute -top-6 w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg ring-4 ring-white animate-bounce">
              <Crown size={20} className="fill-slate-950" />
            </div>
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-slate-400 via-slate-300 to-slate-400 shadow-lg my-2">
              <img
                src={rank1.avatarUrl}
                alt={rank1.name}
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 bg-slate-100/80 px-2.5 py-0.5 rounded-full mb-1">
              Cohort Champion
            </span>
            <h4 className="font-black text-base text-slate-900">{rank1.name}</h4>
            <p className="text-xs text-slate-500 font-medium">{rank1.accuracy}% Accuracy • {rank1.streak}d Streak</p>
            <div className="mt-3 bg-gradient-to-r from-slate-400 to-slate-400 text-slate-950 px-4 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-black shadow-xs">
              <Zap size={15} className="fill-slate-950" />
              <span>{formatXp(rank1.displayXp)} XP</span>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {rank3 && (
          <div className="order-3 md:order-3 bg-gradient-to-b from-slate-50 to-white rounded-3xl p-5 border-2 border-slate-200 shadow-2xs flex flex-col items-center text-center relative hover:-translate-y-1 transition-transform">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white font-black text-xs flex items-center justify-center shadow-md ring-4 ring-white">
              #3
            </div>
            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-slate-600 to-slate-300 shadow-md my-2">
              <img
                src={rank3.avatarUrl}
                alt={rank3.name}
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
            <h4 className="font-black text-sm text-slate-900 mt-1">{rank3.name}</h4>
            <p className="text-[11px] text-slate-500 font-medium">{rank3.accuracy}% Accuracy</p>
            <div className="mt-3 bg-slate-50 px-3 py-1 rounded-xl flex items-center gap-1.5 text-xs font-black text-slate-800 border border-slate-200">
              <Zap size={13} className="text-slate-600 fill-slate-500" />
              <span>{formatXp(rank3.displayXp)} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls: Domain Switcher & Search Bar */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Physics', 'Chemistry', 'Biology'] as SubjectDomain[]).map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSubjectDomain(subj)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors whitespace-nowrap cursor-pointer ${
                  subjectDomain === subj
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                {subj === 'All' ? 'All Subjects' : subj}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table / List View */}
        <div className="divide-y divide-slate-100 rounded-2xl overflow-hidden border border-slate-100">
          {filteredEntries.map((entry) => {
            const isRank1 = entry.rank === 1;
            const isRank2 = entry.rank === 2;
            const isRank3 = entry.rank === 3;

            return (
              <div
                key={entry.studentId}
                className={`flex items-center justify-between p-4 md:p-5 transition-all ${
                  entry.isCurrentStudent
                    ? 'bg-blue-50/70 border-l-4 border-blue-600 shadow-inner'
                    : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                }`}
              >
                {/* Left: Rank, Avatar & Info */}
                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                  {/* Rank Badge */}
                  <div className="w-8 text-center shrink-0">
                    {isRank1 ? (
                      <Medal size={24} className="text-slate-500 mx-auto" />
                    ) : isRank2 ? (
                      <Medal size={24} className="text-slate-400 mx-auto" />
                    ) : isRank3 ? (
                      <Medal size={24} className="text-slate-700 mx-auto" />
                    ) : (
                      <span className="font-black text-sm text-slate-500">#{entry.rank}</span>
                    )}
                  </div>

                  {/* Movement Pill */}
                  <div className="shrink-0 hidden sm:block">
                    {entry.movement.type === 'up' ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200">
                        <ArrowUpRight size={11} /> +{entry.movement.delta}
                      </span>
                    ) : entry.movement.type === 'down' ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200">
                        <ArrowDownRight size={11} /> -{entry.movement.delta}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                        <Minus size={11} />
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={entry.avatarUrl}
                      alt={entry.name}
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-full object-cover bg-white shadow-2xs border ${
                        entry.isCurrentStudent ? 'border-2 border-blue-500' : 'border-slate-200'
                      }`}
                    />
                    {entry.tier === 'Diamond' && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black shadow-xs">
                        ◆
                      </span>
                    )}
                  </div>

                  {/* Name & Subtext */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-black text-xs md:text-sm truncate ${
                          entry.isCurrentStudent ? 'text-blue-950 font-black' : 'text-slate-900'
                        }`}
                      >
                        {entry.name}
                      </h4>
                      {entry.isCurrentStudent && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-600 text-white shadow-xs">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-slate-600 font-bold">
                        <Flame size={12} className="text-slate-500 fill-slate-400" />
                        {entry.streak}d
                      </span>
                      <span>•</span>
                      <span>{entry.accuracy}% Acc</span>
                    </div>
                  </div>
                </div>

                {/* Right: XP Score */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shrink-0">
                  <Zap size={14} className="text-slate-500 fill-slate-400" />
                  <span className="font-black text-xs md:text-sm text-slate-950">
                    {formatXp(entry.displayXp)} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
