import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 font-sans">
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Targeted Weak-Area Practice
            </h2>
            <p className="text-blue-200 text-xs md:text-sm leading-relaxed">
              Eliminate test mistakes with pinpoint micro-remediation drills assigned directly based on your weak concepts.
            </p>
          </div>
        </div>
      </div>

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
        onActionClick={(id) => console.log('Practice', id)}
      />
    </div>
  );
};
