import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Award,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Flame,
  Zap,
  Target,
  Sparkles,
  Send,
  LayoutGrid,
  List,
  Brain,
  X,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useLearningStore } from '../../context/LearningStoreContext';
import type { StudentRecord, SubjectName } from '../../types/student';

export const StudentDeepDive: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, selectedBatch, classAnalytics, assignMCQTest } = useLearningStore();

  // Selection & Search State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    id || students[0]?.id || 's-01'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuartile, setSelectedQuartile] = useState<'all' | 'q1' | 'q2' | 'q4'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'accuracy' | 'streak' | 'name'>('rank');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Mistakes Log Filters
  const [mistakeSubjectFilter, setMistakeSubjectFilter] = useState<'all' | SubjectName>('all');
  const [mistakeErrorTypeFilter, setMistakeErrorTypeFilter] = useState<string>('all');
  const [mistakeSearchQuery, setMistakeSearchQuery] = useState('');

  // Trajectory Chart Subject Toggle
  const [trajectorySubject, setTrajectorySubject] = useState<'total' | 'Physics' | 'Chemistry' | 'Biology'>('total');

  // Direct Assign Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetTopic, setAssignTargetTopic] = useState('');
  const [assignTargetSubject, setAssignTargetSubject] = useState<SubjectName>('Physics');
  const [assignSuccessMsg, setAssignSuccessMsg] = useState<string | null>(null);

  // Sync selected student with URL param if it changes
  useEffect(() => {
    if (id && id !== selectedStudentId) {
      setSelectedStudentId(id);
    }
  }, [id, selectedStudentId]);

  // Handle student selection change
  const handleSelectStudent = (stId: string) => {
    setSelectedStudentId(stId);
    navigate(`/teacher/students/${stId}`);
  };

  // Filtered & Sorted Student Roster
  const filteredStudents = useMemo(() => {
    return students
      .filter((st) => {
        const matchesSearch =
          st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          st.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          st.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedQuartile === 'q1') return st.averageScore >= 240; // >80%
        if (selectedQuartile === 'q2') return st.averageScore >= 200 && st.averageScore < 240; // 67-80%
        if (selectedQuartile === 'q4') return st.averageScore < 200; // <67%
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rank') return a.overallRank - b.overallRank;
        if (sortBy === 'score') return b.averageScore - a.averageScore;
        if (sortBy === 'accuracy') return b.averageAccuracy - a.averageAccuracy;
        if (sortBy === 'streak') return b.streak - a.streak;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [students, searchQuery, selectedQuartile, sortBy]);

  // Active Selected Student
  const activeStudent: StudentRecord = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0] || {
      id: 's-01',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@brothersacademy.edu',
      rollNumber: 'BA-2026-0842',
      batch: 'Batch A1 - NEET 2026',
      grade: 'Class 11 (Advanced)',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      overallRank: 4,
      totalTests: 18,
      averageScore: 218,
      averageAccuracy: 78.5,
      xp: 1240,
      streak: 15,
      subjectMastery: [],
      scoreHistory: [],
      mistakes: [],
      badges: [],
    };
  }, [students, selectedStudentId]);

  // Synthetic Score History Fallback (ensures every student has rich chart data)
  const chartTrajectoryData = useMemo(() => {
    if (activeStudent.scoreHistory && activeStudent.scoreHistory.length > 0) {
      return activeStudent.scoreHistory.map((sh, idx) => {
        const classAvg = classAnalytics.performanceTrends[idx]?.classAverage || (170 + idx * 5);
        let studentVal = sh.score;
        if (trajectorySubject === 'Physics') studentVal = sh.physicsScore;
        if (trajectorySubject === 'Chemistry') studentVal = sh.chemistryScore;
        if (trajectorySubject === 'Biology') studentVal = sh.biologyScore;

        return {
          testNumber: sh.testNumber || `Mock #${idx + 1}`,
          testTitle: sh.testTitle,
          date: sh.date,
          studentScore: studentVal,
          classAverage: trajectorySubject === 'total' ? classAvg : Math.round(classAvg / 3),
          targetBenchmark: trajectorySubject === 'total' ? 180 : 60,
          rankInTest: sh.rank,
        };
      });
    }

    // Generated 5-point realistic trajectory based on student's baseline score
    const base = activeStudent.averageScore || 200;
    return [
      { testNumber: 'Mock #1', testTitle: 'Vectors & Kinematics', date: '2026-06-10', studentScore: Math.round(base * 0.82), classAverage: 155, targetBenchmark: 180, rankInTest: activeStudent.overallRank + 2 },
      { testNumber: 'Mock #2', testTitle: 'Newton Laws & Stoichiometry', date: '2026-06-24', studentScore: Math.round(base * 0.88), classAverage: 162, targetBenchmark: 180, rankInTest: activeStudent.overallRank + 1 },
      { testNumber: 'Mock #3', testTitle: 'Work Power & Bonding', date: '2026-07-08', studentScore: Math.round(base * 0.94), classAverage: 174, targetBenchmark: 180, rankInTest: activeStudent.overallRank },
      { testNumber: 'Mock #4', testTitle: 'Grand Mock #4', date: '2026-07-22', studentScore: base, classAverage: 184, targetBenchmark: 180, rankInTest: activeStudent.overallRank },
      { testNumber: 'Mock #5', testTitle: 'Electromagnetism & Calculus', date: '2026-08-05', studentScore: Math.round(base * 1.06), classAverage: 188, targetBenchmark: 180, rankInTest: Math.max(1, activeStudent.overallRank - 1) },
    ];
  }, [activeStudent, classAnalytics, trajectorySubject]);

  // Filtered Student Mistakes
  const filteredMistakes = useMemo(() => {
    const mistakesList = (activeStudent.mistakes && activeStudent.mistakes.length > 0)
      ? activeStudent.mistakes
      : [
          {
            id: `m-demo-${activeStudent.id}-1`,
            testId: 'test-04',
            testTitle: 'NEET Advanced Grand Mock #4',
            questionNumber: 14,
            subject: 'Physics' as SubjectName,
            topic: 'Rotational Dynamics',
            subtopic: 'Rolling Without Slipping on Incline',
            questionText: 'A solid cylinder of mass M and radius R rolls without slipping down an incline of angle θ. What is its linear acceleration down the plane?',
            studentOption: 'B' as const,
            correctOption: 'C' as const,
            errorType: 'Conceptual' as const,
            aiExplanation: 'Friction torque direction sign confusion relative to center of mass translational acceleration equations.',
            remediationAction: 'Analyze contact point torque constraint equations with zero slip condition.',
            dateLogged: '2026-07-22',
          },
          {
            id: `m-demo-${activeStudent.id}-2`,
            testId: 'test-04',
            testTitle: 'NEET Advanced Grand Mock #4',
            questionNumber: 23,
            subject: 'Chemistry' as SubjectName,
            topic: 'Chemical Equilibrium',
            subtopic: 'Le Chatelier Pressure Shift',
            questionText: 'For the reaction N2(g) + 3H2(g) <=> 2NH3(g), what is the effect of adding an inert gas like Argon at constant volume?',
            studentOption: 'A' as const,
            correctOption: 'D' as const,
            errorType: 'Careless' as const,
            aiExplanation: 'Adding inert gas at constant volume leaves partial pressures and equilibrium state unaltered.',
            remediationAction: 'Memorize: Inert gas at constant V -> No shift.',
            dateLogged: '2026-07-22',
          },
        ];

    return mistakesList.filter((m) => {
      const matchSubject = mistakeSubjectFilter === 'all' || m.subject === mistakeSubjectFilter;
      const matchErrorType = mistakeErrorTypeFilter === 'all' || m.errorType === mistakeErrorTypeFilter;
      const matchSearch =
        m.topic.toLowerCase().includes(mistakeSearchQuery.toLowerCase()) ||
        m.questionText.toLowerCase().includes(mistakeSearchQuery.toLowerCase()) ||
        (m.subtopic && m.subtopic.toLowerCase().includes(mistakeSearchQuery.toLowerCase()));

      return matchSubject && matchErrorType && matchSearch;
    });
  }, [activeStudent, mistakeSubjectFilter, mistakeErrorTypeFilter, mistakeSearchQuery]);

  // Open Direct MCQ Assignment prefilled with topic
  const handleOpenAssignModal = (topic: string, subject: SubjectName) => {
    setAssignTargetTopic(topic);
    setAssignTargetSubject(subject);
    setIsAssignModalOpen(true);
  };

  // Submit MCQ Assignment
  const handleDispatchMCQ = (e: React.FormEvent) => {
    e.preventDefault();
    assignMCQTest({
      title: `${assignTargetSubject}: ${assignTargetTopic} Targeted Drill`,
      subject: assignTargetSubject,
      targetTopic: assignTargetTopic,
      difficulty: 'Medium',
      questionCount: 10,
      assignedToBatch: activeStudent.batch,
      assignedToStudentId: activeStudent.id,
      dueDate: '2026-08-20',
      xpReward: 120,
      description: `Personalized remediation drill on ${assignTargetTopic} configured for ${activeStudent.name}.`,
    });

    setAssignSuccessMsg(`Targeted MCQ drill dispatched to ${activeStudent.name}!`);
    setIsAssignModalOpen(false);
    setTimeout(() => setAssignSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* ============================================================ */}
      {/* 1. Header Banner & Global Context                            */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 1. Header Banner & Global Context                            */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Quick Search */}
        <div className="flex items-center gap-3 w-full">
          <div className="relative w-full sm:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student name, roll#, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs transition-all"
            />
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {assignSuccessMsg && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-slate-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 size={18} className="text-slate-600 shrink-0" />
          <span>{assignSuccessMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. Main Two-Column Layout (Directory Roster + Deep Dive)     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ---------------------------------------------------------- */}
        {/* Left Column: Navigable Student Directory (F09)             */}
        {/* ---------------------------------------------------------- */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-4 max-h-[850px] overflow-y-auto">
          {/* Filter Pills & View Mode */}
          <div className="space-y-3 pb-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Roster ({filteredStudents.length} Students)
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'cards' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="List Roster View"
                >
                  <List size={14} />
                </button>
              </div>
            </div>

            {/* Quartile Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedQuartile('all')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  selectedQuartile === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({students.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedQuartile('q1')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  selectedQuartile === 'q1'
                    ? 'bg-slate-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Top 80%+
              </button>
              <button
                type="button"
                onClick={() => setSelectedQuartile('q2')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  selectedQuartile === 'q2'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                67-80%
              </button>
              <button
                type="button"
                onClick={() => setSelectedQuartile('q4')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  selectedQuartile === 'q4'
                    ? 'bg-slate-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Remediation (&lt;67%)
              </button>
            </div>
          </div>

          {/* Student Cards / List Roster */}
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Users size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-700">No students matched</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try clearing filters or search terms.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((st) => {
                const isSelected = st.id === activeStudent.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => handleSelectStudent(st.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-2 border-blue-500 shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-black truncate ${
                              isSelected ? 'text-blue-950' : 'text-slate-900'
                            }`}
                          >
                            {st.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {st.rollNumber}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-slate-900 block">
                          {st.averageScore} <span className="text-[10px] font-medium text-slate-400">/300</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 block mt-0.5">
                          #{st.overallRank} Rank
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Right Column: Deep Dive Profile & Mistakes Log (F10, F11)  */}
        {/* ---------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-6">
          {/* ======================================================== */}
          {/* Profile Card Header (F10)                                */}
          {/* ======================================================== */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={activeStudent.avatarUrl}
                    alt={activeStudent.name}
                    className="w-18 h-18 rounded-2xl border-2 border-blue-200 object-cover shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-slate-500 text-white rounded-lg shadow-xs">
                    <Award size={14} />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {activeStudent.name}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-full border border-slate-200">
                      {activeStudent.batch}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Roll: <b className="text-slate-700">{activeStudent.rollNumber}</b> • {activeStudent.grade} • {activeStudent.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAssignModal('Rotational Dynamics & Torque', 'Physics')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Assign Practice MCQ</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Average Score
                </span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {activeStudent.averageScore}{' '}
                  <span className="text-xs font-semibold text-slate-400">/ 300</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Test Accuracy
                </span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {activeStudent.averageAccuracy}%
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Total XP Earned
                </span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {activeStudent.xp}{' '}
                  <span className="text-xs font-semibold text-slate-400">XP</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Active Daily Streak
                </span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {activeStudent.streak}{' '}
                  <span className="text-xs font-semibold text-slate-400">Days</span>
                </p>
              </div>
            </div>

            {/* Subject Mastery Progress Bars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900">Subject Mastery & Question Volume</h4>
                <span className="text-xs font-bold text-slate-400">Benchmark: 75%+</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(activeStudent.subjectMastery && activeStudent.subjectMastery.length > 0
                  ? activeStudent.subjectMastery
                  : [
                      { subject: 'Physics' as SubjectName, masteryPercentage: 82, color: '#2563eb', bgLight: '#eff6ff', weakTopicsCount: 2, totalQuestionsAttempted: 320, accuracy: 81.2 },
                      { subject: 'Chemistry' as SubjectName, masteryPercentage: 74, color: '#2563eb', bgLight: '#eff6ff', weakTopicsCount: 3, totalQuestionsAttempted: 290, accuracy: 75.0 },
                      { subject: 'Biology' as SubjectName, masteryPercentage: 79, color: '#2563eb', bgLight: '#eff6ff', weakTopicsCount: 2, totalQuestionsAttempted: 310, accuracy: 79.4 },
                    ]
                ).map((sub) => (
                  <div key={sub.subject} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-slate-800">{sub.subject}</span>
                      <span className="text-blue-600">{sub.masteryPercentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${sub.masteryPercentage}%`, backgroundColor: sub.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>{sub.totalQuestionsAttempted} Questions</span>
                      <span className="font-bold text-slate-600">{sub.accuracy}% acc</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Historical Score Trajectory vs Class Benchmark (F10)      */}
          {/* ======================================================== */}
          {/* ======================================================== */}
          {/* Historical Score Trajectory vs Class Benchmark (F10)      */}
          {/* ======================================================== */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  Historical Score Trajectory vs Class Benchmark
                </h4>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['total', 'Physics', 'Chemistry', 'Biology'] as const).map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setTrajectorySubject(sub)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                      trajectorySubject === sub
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {sub === 'total' ? 'Total (300M)' : sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTrajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="testNumber" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} labelStyle={{ fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" name={`${activeStudent.name}'s Score`} dataKey="studentScore" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#studentGradient)" />
                  <Line type="monotone" name="Class Average" dataKey="classAverage" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#10b981' }} />
                  <Line type="monotone" name="Target Benchmark" dataKey="targetBenchmark" stroke="#f59e0b" strokeWidth={2} strokeDasharray="2 2" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Specific Mistakes Log Table & Cards (F11) - FULL PAGE      */}
      {/* ======================================================== */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-slate-600" />
            <h4 className="font-extrabold text-base text-slate-900">
              Mistake & Reminder Log
            </h4>
          </div>
        </div>

        {filteredMistakes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 size={32} className="mx-auto text-slate-500 mb-2" />
            <p className="text-xs font-bold text-slate-800">No active mistake records</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMistakes.map((m) => (
              <div key={m.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 hover:bg-slate-50 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-extrabold text-[10px] rounded-md uppercase">
                      Q{m.questionNumber}
                    </span>
                    <span className="text-xs font-black text-slate-900">{m.topic}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs font-medium text-slate-800 leading-relaxed">
                  {m.questionText}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 font-bold">
                    <X size={14} className="text-slate-600" />
                    <span>Picked: <b>Option {m.studentOption}</b></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 font-bold">
                    <Check size={14} className="text-slate-600" />
                    <span>Correct: <b>Option {m.correctOption}</b></span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <Target size={14} className="text-slate-600 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-700">
                        Better Solution: <span className="text-slate-600 font-normal">{m.remediationAction}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. Direct MCQ Assignment Modal (F13 Bridge)                   */}
      {/* ============================================================ */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Send size={18} />
                </div>
                <h3 className="font-black text-lg text-slate-900">
                  Assign Targeted Drill to {activeStudent.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDispatchMCQ} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Concept / Topic
                </label>
                <input
                  type="text"
                  required
                  value={assignTargetTopic}
                  onChange={(e) => setAssignTargetTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={assignTargetSubject}
                    onChange={(e) => setAssignTargetSubject(e.target.value as SubjectName)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Questions Count
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900">
                This test will be customized specifically to address {activeStudent.name}'s detected gap in <b>{assignTargetTopic}</b>.
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-100 cursor-pointer"
                >
                  Dispatch to Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
