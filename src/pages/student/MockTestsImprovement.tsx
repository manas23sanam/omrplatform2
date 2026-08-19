import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Filter,
  User,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import type { WeakTopicItem, MockAssignment } from '../../types/test';
import type { SubjectName } from '../../types/student';
import { formatXp } from '../../lib/gamification';
import { WeakTopicAnalysis } from '../../components/shared/WeakTopicAnalysis';

type TypeFilter = 'all' | 'ai' | 'teacher';
type SubjectFilter = 'all' | SubjectName;
type DifficultyFilter = 'all' | 'Easy' | 'Medium' | 'Hard';
type MasteryStatusFilter = 'all' | 'needs_attention' | 'mastered';

export const MockTestsImprovement: React.FC = () => {
  const navigate = useNavigate();
  const { assignedTests, weakTopics, updateWeakTopicStatus, completePracticeQuiz, selectedBatch } =
    useLearningStore();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [masteryFilter, setMasteryFilter] = useState<MasteryStatusFilter>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(weakTopics[0]?.id || null);

  // Filtered mock assignments
  const filteredMocks = useMemo(() => {
    return assignedTests.filter((mock) => {
      // Type filter
      if (typeFilter === 'ai' && !mock.assignedBy.toLowerCase().includes('ai')) return false;
      if (typeFilter === 'teacher' && mock.assignedBy.toLowerCase().includes('ai')) return false;

      // Subject filter
      if (subjectFilter !== 'all' && mock.subject !== subjectFilter) return false;

      // Difficulty filter
      if (difficultyFilter !== 'all' && mock.difficulty !== difficultyFilter) return false;

      return true;
    });
  }, [assignedTests, typeFilter, subjectFilter, difficultyFilter]);

  // Filtered weak topics
  const filteredWeakTopics = useMemo(() => {
    return weakTopics.filter((topic) => {
      // Subject filter
      if (subjectFilter !== 'all' && topic.subject !== subjectFilter) return false;

      // Mastery filter
      if (masteryFilter === 'mastered' && topic.status !== 'mastered') return false;
      if (masteryFilter === 'needs_attention' && topic.status === 'mastered') return false;

      return true;
    });
  }, [weakTopics, subjectFilter, masteryFilter]);

  const masteredCount = weakTopics.filter((t) => t.status === 'mastered').length;

  const getStatusBadge = (status: WeakTopicItem['status']) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
            Mastered
          </span>
        );
      case 'ready':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            Ready to Test
          </span>
        );
      case 'studying':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
            Studying
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            Not Started
          </span>
        );
    }
  };

  const handleTopicAction = (topicId: string, actionType?: 'theory' | 'practice' | 'drill') => {
    navigate(`/student/practice/${topicId}?mode=${actionType || 'practice'}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-blue-200 border border-white/10">
                AI Learning GPS & Teacher Remediation Engine
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Targeted Weak-Area Practice & AI Mock Tests
            </h2>
            <p className="text-blue-200 text-xs md:text-sm leading-relaxed">
              Eliminate test mistakes with pinpoint micro-remediation drills assigned directly based on your weak concepts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <span className="block text-2xl font-black">{masteredCount}/{weakTopics.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Topics Mastered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Source / Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Practice Packs
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('ai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'ai'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            AI-Generated Mocks
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('teacher')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'teacher'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Teacher Assigned
          </button>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-1.5">
          {(['all', 'Physics', 'Chemistry', 'Biology'] as const).map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSubjectFilter(subj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                subjectFilter === subj
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {subj === 'all' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Targeted Mock Tests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-blue-600" size={20} />
            <h3 className="text-lg font-black text-slate-900">Targeted Mock Tests</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {filteredMocks.length} Tests Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMocks.map((mock) => (
            <div
              key={mock.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                      mock.subject === 'Physics'
                        ? 'bg-blue-50 text-blue-700'
                        : mock.subject === 'Chemistry'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    {mock.subject}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {mock.difficulty}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                  {mock.title}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {mock.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <Zap size={14} className="fill-slate-500 text-slate-600" />
                  <span>+{mock.xpReward} XP</span>
                </div>

                <Link
                  to={`/student/practice/${mock.targetTopic || 'wt-1'}?mode=practice`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Start Test</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}

          {filteredMocks.length === 0 && (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-100 text-slate-500 text-sm">
              No mock tests match the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Weak-Topic Study Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-blue-600" size={20} />
            <h3 className="text-lg font-black text-slate-900">Weak-Topic Study Checklist</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {filteredWeakTopics.length} Focus Areas
          </span>
        </div>

        <div className="space-y-3">
          {filteredWeakTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {topic.subject}
                  </span>
                  {getStatusBadge(topic.status)}
                  <span className="text-xs font-bold text-slate-400">
                    • {topic.mistakesCount} mistakes logged
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {topic.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {topic.conceptExplanation}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/student/practice/${topic.id}?mode=theory`}
                  className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Review Theory
                </Link>
                <Link
                  to={`/student/practice/${topic.id}?mode=practice`}
                  className="px-4 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>Launch Practice Quiz</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Weak Topic Analysis */}
      <WeakTopicAnalysis
        topics={[
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
        ]}
        viewType="student"
        onActionClick={handleTopicAction}
      />
    </div>
  );
};
