import React from 'react';
import {
  BookOpen,
  Award,
  Zap,
  BrainCircuit,
  Target,
  Flame,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import { BRANDING, DEMO_STUDENT } from '../../config/branding';
import { MOCK_STUDENTS, MOCK_BADGES } from '../../data/mockData';
import { XPWidget } from '../../components/student/XPWidget';
import { ScoreTrajectoryChart } from '../../components/student/ScoreTrajectoryChart';
import { SubjectMasteryBreakdown } from '../../components/student/SubjectMasteryBreakdown';
import { TestHistoryTable } from '../../components/student/TestHistoryTable';
import { BadgeGallery } from '../../components/student/BadgeGallery';
import { getLevelInfo, formatXp } from '../../lib/gamification';

export const StudentProfile: React.FC = () => {
  const { currentUser, students } = useLearningStore();

  // Find active student record
  const activeStudent =
    students.find((s) => s.id === currentUser?.id || s.name === currentUser?.name) ||
    MOCK_STUDENTS[0];

  const studentName = currentUser?.name || activeStudent.name || DEMO_STUDENT.name;
  const studentBatch = currentUser?.batch || activeStudent.batch || DEMO_STUDENT.batch;
  const studentAvatar = currentUser?.avatarUrl || activeStudent.avatarUrl || DEMO_STUDENT.avatarUrl;
  const studentXp = currentUser?.xp ?? activeStudent.xp ?? DEMO_STUDENT.xp;
  const studentStreak = currentUser?.streak ?? activeStudent.streak ?? DEMO_STUDENT.streak;
  const levelInfo = getLevelInfo(studentXp);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 font-sans">
      {/* 1. Hero Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 relative" />
        
        <div className="px-6 sm:px-10 pb-6 relative flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
          <div className="-mt-16 relative shrink-0">
            <img
              src={studentAvatar}
              alt={studentName}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
            />
          </div>

          <div className="pb-2 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-200 px-2.5 py-0.5 rounded-full">
                Level {levelInfo.level}
              </span>
              <span className="text-xs font-bold text-slate-600">
                Roll #{activeStudent.rollNumber || '2026-NEET-04'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {studentName}
            </h2>

            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 flex items-center gap-2">
              <BookOpen size={14} className="text-blue-600" />
              {studentBatch} • {BRANDING.coachingName}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Core KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
            <Flame size={20} className="fill-slate-500" />
          </div>
          <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Study Streak</p>
          <h3 className="text-2xl font-black text-slate-900">{studentStreak} Days</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
            <Zap size={20} className="fill-slate-500" />
          </div>
          <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Total XP Points</p>
          <h3 className="text-2xl font-black text-slate-900">{formatXp(studentXp)}</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
            <Award size={20} />
          </div>
          <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Cohort Rank</p>
          <h3 className="text-2xl font-black text-slate-900">#{activeStudent.overallRank || 4} in Batch</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
            <Target size={20} />
          </div>
          <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Average Accuracy</p>
          <h3 className="text-2xl font-black text-slate-900">{activeStudent.averageAccuracy || 78.5}%</h3>
        </div>
      </div>

      {/* 3. XP Level Progress & 7-Day Study Calendar Widget */}
      <XPWidget xp={studentXp} streak={studentStreak} />

      {/* 4. Historical Score Improvement Trajectory vs Class Benchmark */}
      <ScoreTrajectoryChart scoreHistory={activeStudent.scoreHistory} />

      {/* 5. Subject Mastery Breakdown Bars */}
      <SubjectMasteryBreakdown masteries={activeStudent.subjectMastery} />

      {/* 6. Test History Log Table */}
      <TestHistoryTable scoreHistory={activeStudent.scoreHistory} />

      {/* 7. Achievement Badges Gallery */}
      <BadgeGallery badges={activeStudent.badges || MOCK_BADGES} />
    </div>
  );
};
