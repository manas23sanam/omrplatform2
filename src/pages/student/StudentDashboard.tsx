import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLearningStore } from '../../context/LearningStoreContext';
import { DEMO_STUDENT } from '../../config/branding';

import { MOCK_STUDENTS } from '../../data/mockData';
import { WeakTopicAnalysis } from '../../components/shared/WeakTopicAnalysis';
import type { TopicAnalysisItem } from '../../components/shared/WeakTopicAnalysis';

const MOCK_WEAK_TOPICS: TopicAnalysisItem[] = [
  {
    id: 'wt-1',
    topicName: 'Rotational Equilibrium',
    subject: 'Physics',
    missRate: 0.75,
    attempts: 4,
    misses: 3,
    testsAppearedIn: 2,
    testsMissedIn: 2,
    priority: 'High',
    reasoning: '3 of 4 attempts missed this concept across your last 2 tests.',
    isAssigned: true,
  },
  {
    id: 'wt-2',
    topicName: 'Electrophilic Aromatic Substitution',
    subject: 'Chemistry',
    missRate: 0.60,
    attempts: 5,
    misses: 3,
    testsAppearedIn: 3,
    testsMissedIn: 2,
    priority: 'Medium',
    reasoning: 'Missed in 2 out of your last 3 tests (60% miss rate).',
    isAssigned: false,
  },
  {
    id: 'wt-3',
    topicName: 'Human Endocrine System',
    subject: 'Biology',
    missRate: 0.33,
    attempts: 6,
    misses: 2,
    testsAppearedIn: 3,
    testsMissedIn: 1,
    priority: 'Low',
    reasoning: 'Below target accuracy (66% correct), though not consistently missed.',
    isAssigned: false,
  }
];


export const StudentDashboard: React.FC = () => {
  const { currentUser, testPapers, students } = useLearningStore();

  const activeStudent =
    students.find((s) => s.id === currentUser?.id || s.name === currentUser?.name) ||
    MOCK_STUDENTS[0];

  const studentName = currentUser?.name || activeStudent.name || DEMO_STUDENT.name;
  const studentBatch = currentUser?.batch || activeStudent.batch || DEMO_STUDENT.batch;
  const studentXp = currentUser?.xp ?? activeStudent.xp ?? DEMO_STUDENT.xp;
  const studentStreak = currentUser?.streak ?? activeStudent.streak ?? DEMO_STUDENT.streak;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 font-sans">
      {/* Welcome & Overview Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome back, {studentName}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Here's your real-time NEET learning trajectory for {studentBatch}. Keep pushing forward!
        </p>
      </div>



      {/* Snapshot Cards - Minimal Pattern (No Icons) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Latest Score',
            value: '228 / 300',
          },
          {
            label: 'Overall Accuracy',
            value: `${activeStudent.averageAccuracy || 78.5}%`,
          },
          {
            label: 'Cohort Rank',
            value: `#${activeStudent.overallRank || 4}`,
          },
          {
            label: 'Daily Streak',
            value: `${studentStreak} Days`,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-slate-50 rounded-2xl p-5 flex flex-col items-start transition-transform hover:-translate-y-0.5"
          >
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
          </div>
        ))}
      </div>

      <WeakTopicAnalysis
        topics={MOCK_WEAK_TOPICS}
        viewType="student"
        onActionClick={(topicId) => console.log('Action on topic:', topicId)}
      />

      {/* Full Width Sections: Recent Test Reports */}
      <div className="flex flex-col gap-8 items-start">
        {/* Recent Test Diagnostic Reports */}
        <div className="w-full bg-slate-50 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Recent Test Evaluations</h3>
              <p className="text-xs text-slate-500">Quick access to OMR diagnostic reports</p>
            </div>
            <Link
              to="/student/profile"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Full History
            </Link>
          </div>

          <div className="space-y-3">
            {testPapers.slice(0, 4).map((test) => (
              <div
                key={test.id}
                className="group p-4 rounded-2xl bg-white hover:bg-blue-50/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {test.subjectScope}
                    </span>
                    <span className="text-[11px] text-slate-400">{test.dateConducted}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-950 transition-colors">
                    {test.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-xs text-slate-800">
                    {test.highestScore} marks
                  </span>
                  <Link
                    to={`/student/analysis/${test.id}`}
                    className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shadow-xs"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

