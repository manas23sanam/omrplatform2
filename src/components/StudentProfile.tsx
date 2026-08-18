import React from 'react';
import { Award, Zap, BookOpen, BrainCircuit, Target, CheckCircle2, TrendingUp, Flame, CalendarDays, Calculator } from 'lucide-react';
import { useLearningStore } from '../context/LearningStoreContext';
import { BRANDING, DEMO_STUDENT } from '../config/branding';

export const StudentProfile = () => {
  const { currentUser } = useLearningStore();

  const student = {
    name: currentUser?.name || DEMO_STUDENT.name,
    batch: currentUser?.batch || DEMO_STUDENT.batch,
    grade: currentUser?.grade || DEMO_STUDENT.grade,
    avatarUrl: currentUser?.avatarUrl || DEMO_STUDENT.avatarUrl,
    xp: currentUser?.xp ?? DEMO_STUDENT.xp,
    streak: currentUser?.streak ?? DEMO_STUDENT.streak,
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Hero Banner */}
      <div className="relative mb-16">
        <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden relative shadow-md">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl translate-y-1/3"></div>
        </div>
        
        {/* Profile Info Overlay */}
        <div className="absolute -bottom-12 left-8 md:left-12 flex items-end gap-6 w-full">
          <div className="relative">
            <img 
              src={student.avatarUrl} 
              alt={student.name} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-8 border-slate-50 shadow-xl bg-white"
            />
            <div className="absolute bottom-2 right-2 bg-slate-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
          </div>
          
          <div className="pb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{student.name}</h2>
            <p className="text-slate-500 font-medium text-lg mt-1 flex items-center gap-2">
              <BookOpen size={16} /> {student.batch} • {BRANDING.coachingName}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Subjects */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Core Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame size={48} className="text-slate-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                <Flame size={20} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Streak</p>
              <h3 className="text-3xl font-black text-slate-900">{student.streak} <span className="text-sm text-slate-400 font-semibold">Days</span></h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={48} className="text-blue-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total XP</p>
              <h3 className="text-3xl font-black text-slate-900">{student.xp.toLocaleString()}</h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit size={48} className="text-blue-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <BrainCircuit size={20} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Mastered</p>
              <h3 className="text-3xl font-black text-slate-900">18 <span className="text-sm text-slate-400 font-semibold">Topics</span></h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={48} className="text-slate-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                <Target size={20} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Accuracy</p>
              <h3 className="text-3xl font-black text-slate-900">78.5<span className="text-sm text-slate-400 font-semibold">%</span></h3>
            </div>
          </div>

          {/* Subject Mastery Progress */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Subject Mastery</h3>
              <span className="text-blue-600 font-semibold text-xs">NEET Advanced Target: 80%+</span>
            </div>
            
            <div className="space-y-6">
              {[
                { name: 'Physics (Mechanics, Electromagnetism)', progress: 82, color: 'bg-blue-600', bg: 'bg-blue-100' },
                { name: 'Chemistry (Organic, Physical, Inorganic)', progress: 74, color: 'bg-slate-600', bg: 'bg-slate-100' },
                { name: 'Biology (Calculus, Coordinate Geometry)', progress: 79, color: 'bg-slate-500', bg: 'bg-slate-100' },
              ].map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-xs text-slate-700">{subject.name}</span>
                    <span className="font-bold text-xs text-slate-900">{subject.progress}%</span>
                  </div>
                  <div className={`h-3 w-full rounded-full ${subject.bg} overflow-hidden`}>
                    <div 
                      className={`h-full ${subject.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Badges & Activity */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Recent Badges */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Award className="text-slate-500" /> Recent Badges
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xs transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-xl shadow-inner">
                  ⚡
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Rotational Master</h4>
                  <p className="text-[11px] text-slate-700 font-medium mt-0.5">Scored 90%+ in Mechanics</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xs transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-xl shadow-inner">
                  🔥
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">15-Day Study Streak</h4>
                  <p className="text-[11px] text-slate-700 font-medium mt-0.5">Unlocked 3 days ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-xs transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-xl shadow-inner">
                  ∫
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Calculus Conqueror</h4>
                  <p className="text-[11px] text-blue-700 font-medium mt-0.5">100+ Integration MCQs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-600" /> Recent Activity
            </h3>
            
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-500 ring-4 ring-white"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Today</p>
                <h4 className="font-bold text-slate-900 text-xs">Evaluated NEET Mock #4 OMR</h4>
                <p className="text-xs text-slate-500 mt-1">Achieved 228/300 marks (76%).</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">2 Days Ago</p>
                <h4 className="font-bold text-slate-900 text-xs">Remediated Lenz Law Concept</h4>
                <p className="text-xs text-slate-500 mt-1">Cleared 5-question verification test (+150 XP).</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">5 Days Ago</p>
                <h4 className="font-bold text-slate-900 text-xs">Completed Weekly Physics Test</h4>
                <p className="text-xs text-slate-500 mt-1">Scored 84 marks on Rotational Dynamics.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
