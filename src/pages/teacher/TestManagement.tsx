import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Send,
  FileCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  X,
  Shuffle,
  Eye,
} from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import type { SubjectName } from '../../types/student';
import type { OMRSection, TestPaper } from '../../types/test';

export const TestManagement: React.FC = () => {
  const {
    testPapers,
    assignedTests,
    selectedBatch,
    students,
    uploadTestPaper,
    assignMCQTest,
  } = useLearningStore();

  // Modal Dialog States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [viewingPaper, setViewingPaper] = useState<TestPaper | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter States
  const [paperFilterSubject, setPaperFilterSubject] = useState<'all' | OMRSection>('all');
  const [assignmentFilterStatus, setAssignmentFilterStatus] = useState<'all' | 'assigned' | 'in_progress' | 'completed'>('all');

  // New Test Paper Form State (F12)
  const [testNumber, setTestNumber] = useState(`TEST-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [testTitle, setTestTitle] = useState('');
  const [subjectScope, setSubjectScope] = useState<OMRSection>('Full Paper');
  const [totalMarks, setTotalMarks] = useState<number>(300);
  const [questionCount, setQuestionCount] = useState<number>(30);
  const [answerKey, setAnswerKey] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>(() => {
    const initial: Record<number, 'A' | 'B' | 'C' | 'D'> = {};
    for (let i = 1; i <= 30; i++) {
      initial[i] = (['A', 'B', 'C', 'D'][(i - 1) % 4] as 'A' | 'B' | 'C' | 'D');
    }
    return initial;
  });

  // New MCQ Assignment Form State (F13)
  const [assignTitle, setAssignTitle] = useState('');
  const [assignSubject, setAssignSubject] = useState<SubjectName>('Physics');
  const [assignTopic, setAssignTopic] = useState('Rotational Dynamics & Torque');
  const [assignDifficulty, setAssignDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Hard');
  const [assignRecipientType, setAssignRecipientType] = useState<'batch' | 'student'>('batch');
  const [assignStudentId, setAssignStudentId] = useState<string>(students[0]?.id || 's-01');
  const [assignCount, setAssignCount] = useState<number>(15);
  const [assignDueDate, setAssignDueDate] = useState('2026-08-25');
  const [assignXp, setAssignXp] = useState<number>(150);

  // Synchronize question count changes with answer key grid size
  const handleQuestionCountChange = (newCount: number) => {
    const safeCount = Math.max(1, Math.min(newCount, 90));
    setQuestionCount(safeCount);
    setAnswerKey((prev) => {
      const updated: Record<number, 'A' | 'B' | 'C' | 'D'> = { ...prev };
      for (let i = 1; i <= safeCount; i++) {
        if (!updated[i]) {
          updated[i] = (['A', 'B', 'C', 'D'][(i - 1) % 4] as 'A' | 'B' | 'C' | 'D');
        }
      }
      return updated;
    });
  };

  // Answer Key Bubble Selector Handler
  const handleAnswerOptionSelect = (qNum: number, opt: 'A' | 'B' | 'C' | 'D') => {
    setAnswerKey((prev) => ({
      ...prev,
      [qNum]: opt,
    }));
  };

  // Bulk Quick Tools for Answer Key Grid
  const handleBulkFillAlternating = () => {
    const updated: Record<number, 'A' | 'B' | 'C' | 'D'> = {};
    const opts: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    for (let i = 1; i <= questionCount; i++) {
      updated[i] = opts[(i - 1) % 4];
    }
    setAnswerKey(updated);
  };

  const handleBulkRandomize = () => {
    const updated: Record<number, 'A' | 'B' | 'C' | 'D'> = {};
    const opts: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    for (let i = 1; i <= questionCount; i++) {
      updated[i] = opts[Math.floor(Math.random() * 4)];
    }
    setAnswerKey(updated);
  };

  const handleBulkSetAll = (opt: 'A' | 'B' | 'C' | 'D') => {
    const updated: Record<number, 'A' | 'B' | 'C' | 'D'> = {};
    for (let i = 1; i <= questionCount; i++) {
      updated[i] = opt;
    }
    setAnswerKey(updated);
  };

  // Publish New Test Paper Action
  const handleCreateTestPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim()) return;

    uploadTestPaper({
      testNumber,
      title: testTitle,
      batch: selectedBatch,
      subjectScope,
      totalMarks,
      questionCount,
      answerKey,
    });

    setSuccessMessage(`Test Paper "${testTitle}" configured & published with ${questionCount} MCQs!`);
    setIsUploadModalOpen(false);
    setTestTitle('');
    setTestNumber(`TEST-2026-${Math.floor(100 + Math.random() * 900)}`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Dispatch MCQ Remediation Test Action
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    const targetStudent = students.find((s) => s.id === assignStudentId);
    const assignedLabel = assignRecipientType === 'batch' ? selectedBatch : targetStudent?.name || 'Student';

    assignMCQTest({
      title: assignTitle,
      subject: assignSubject,
      targetTopic: assignTopic,
      difficulty: assignDifficulty,
      questionCount: assignCount,
      assignedToBatch: selectedBatch,
      assignedToStudentId: assignRecipientType === 'student' ? assignStudentId : undefined,
      dueDate: assignDueDate,
      xpReward: assignXp,
      description: `Targeted practice on ${assignTopic} (${assignDifficulty} level). Assigned to ${assignedLabel}.`,
    });

    setSuccessMessage(`Assignment "${assignTitle}" dispatched to ${assignedLabel}!`);
    setIsAssignModalOpen(false);
    setAssignTitle('');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Filtered Test Papers
  const filteredPapers = useMemo(() => {
    return testPapers.filter((p) => {
      if (paperFilterSubject === 'all') return true;
      return p.subjectScope === paperFilterSubject;
    });
  }, [testPapers, paperFilterSubject]);

  // Filtered Assigned Drills
  const filteredAssignments = useMemo(() => {
    return assignedTests.filter((a) => {
      if (assignmentFilterStatus === 'all') return true;
      return a.status === assignmentFilterStatus;
    });
  }, [assignedTests, assignmentFilterStatus]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* ============================================================ */}
      {/* 1. Header Banner & Action Triggers                           */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Manage Tests
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100 cursor-pointer"
          >
            <Plus size={16} />
            <span>Upload New Test Paper</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-transparent border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Send size={16} />
            <span>Assign MCQ Drill</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-slate-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 size={18} className="text-slate-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. Main Two-Column Grid: Test Papers vs Practice Drills      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ---------------------------------------------------------- */}
        {/* Left Column: Conducted Test Papers Catalog (F12)           */}
        {/* ---------------------------------------------------------- */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-blue-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Conducted Test Papers ({filteredPapers.length})
              </h3>
            </div>

            {/* Subject Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
              {(['all', 'Full Paper', 'Physics', 'Chemistry', 'Biology'] as const).map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => setPaperFilterSubject(sc)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                    paperFilterSubject === sc
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sc === 'all' ? 'All' : sc}
                </button>
              ))}
            </div>
          </div>

          {/* Test Paper Cards */}
          <div className="space-y-3">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-extrabold text-[10px] rounded-md uppercase">
                      {paper.testNumber} • {paper.subjectScope}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> {paper.dateConducted}
                  </span>
                </div>
                
                <h4 className="font-black text-sm text-slate-900">{paper.title}</h4>

                <div className="flex items-center gap-4 text-xs py-1">
                  <span className="text-slate-600 font-bold">{paper.questionCount} MCQs ({paper.totalMarks}M)</span>
                  <span className="text-slate-400 font-medium">•</span>
                  <span className="text-slate-600 font-medium">Avg: <span className="font-bold">{paper.classAverage}</span></span>
                  <span className="text-slate-400 font-medium">•</span>
                  <span className="text-slate-600 font-medium">High: <span className="font-bold">{paper.highestScore}</span></span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Answer Key: {Object.keys(paper.answerKey || {}).length} Questions Configured
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewingPaper(paper)}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View Answer Key Grid</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Right Column: Dispatched Remediation Practice (F13)        */}
        {/* ---------------------------------------------------------- */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-slate-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Assigned Drills ({filteredAssignments.length})
              </h3>
            </div>

            {/* Status Filter */}
            <select
              value={assignmentFilterStatus}
              onChange={(e) => setAssignmentFilterStatus(e.target.value as any)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="assigned">Active (Assigned)</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredAssignments.map((drill) => (
              <div
                key={drill.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md uppercase">
                      {drill.subject} • {drill.difficulty}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">{drill.title}</h4>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {drill.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-medium">
                  <span>Due: <b className="text-slate-600">{drill.dueDate}</b></span>
                  <span className="font-bold text-slate-700">{drill.questionCount} Questions</span>
                  <span className="font-bold text-slate-500">+{drill.xpReward} XP</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 text-[10px]">
                  <span className="text-slate-500 font-medium">
                    Assigned by: <b>{drill.assignedBy}</b>
                  </span>
                  <span
                    className={`font-extrabold px-2 py-0.5 rounded-md uppercase ${
                      drill.status === 'completed'
                        ? 'bg-slate-100 text-slate-800'
                        : drill.status === 'in_progress'
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {drill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. Modal: Upload & Configure Test Paper (F12)                */}
      {/* ============================================================ */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileCheck size={18} />
                </div>
                <h3 className="font-black text-lg text-slate-900">
                  Upload & Configure Question Paper
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTestPaper} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Test Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEET Advanced Full Mock Test #5"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Test Code
                  </label>
                  <input
                    type="text"
                    required
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject Scope
                  </label>
                  <select
                    value={subjectScope}
                    onChange={(e) => setSubjectScope(e.target.value as OMRSection)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  >
                    <option value="Full Paper">Full Paper (PCM)</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Cohort
                  </label>
                  <select
                    value={selectedBatch}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    disabled
                  >
                    <option value={selectedBatch}>{selectedBatch}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Question Count
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={90}
                    value={questionCount}
                    onChange={(e) => handleQuestionCountChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* ==================================================== */}
              {/* Dynamic Interactive Answer Key Bubble Selector Grid  */}
              {/* ==================================================== */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      Interactive Answer Key Grid ({questionCount} MCQs)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Click the correct option bubble for each question
                    </p>
                  </div>

                  {/* Bulk Quick Fill Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleBulkFillAlternating}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
                      title="Pattern: A, B, C, D alternating"
                    >
                      Alternating (ABCD)
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkRandomize}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Shuffle size={10} /> Random
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkSetAll('A')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
                    >
                      All A
                    </button>
                  </div>
                </div>

                {/* Bubble Grid Container */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-h-56 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {Array.from({ length: questionCount }, (_, idx) => {
                      const qNum = idx + 1;
                      const selectedOpt = answerKey[qNum] || 'A';
                      return (
                        <div
                          key={qNum}
                          className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col items-center gap-1"
                        >
                          <span className="text-[10px] font-black text-slate-700">Q{qNum}</span>
                          <div className="flex items-center gap-1">
                            {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                              const isPicked = selectedOpt === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleAnswerOptionSelect(qNum, opt)}
                                  className={`w-6 h-6 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                    isPicked
                                      ? 'bg-blue-600 text-white shadow-xs scale-105'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-100 cursor-pointer"
                >
                  Publish Paper & Answer Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. Modal: Assign Targeted MCQ Remediation Drill (F13)        */}
      {/* ============================================================ */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                  <Send size={18} />
                </div>
                <h3 className="font-black text-lg text-slate-900">
                  Assign Targeted MCQ Remediation Drill
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

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotational Torque Sign Remediation Pack"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all"
                />
              </div>

              {/* Target Recipient Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Recipient
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignRecipientType('batch')}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      assignRecipientType === 'batch'
                        ? 'bg-slate-50 border-slate-500 text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Entire Batch ({selectedBatch})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignRecipientType('student')}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      assignRecipientType === 'student'
                        ? 'bg-slate-50 border-slate-500 text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Individual Student
                  </button>
                </div>

                {assignRecipientType === 'student' && (
                  <select
                    value={assignStudentId}
                    onChange={(e) => setAssignStudentId(e.target.value)}
                    className="w-full mt-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.rollNumber})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={assignSubject}
                    onChange={(e) => setAssignSubject(e.target.value as SubjectName)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={assignDifficulty}
                    onChange={(e) => setAssignDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="Easy">Easy (Foundation)</option>
                    <option value="Medium">Medium (NEET Main)</option>
                    <option value="Hard">Hard (NEET Advanced)</option>
                  </select>
                </div>
              </div>

              {/* Target Concept / Mistake Topic with Quick Pickers */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Concept / Mistake Topic
                </label>
                <input
                  type="text"
                  required
                  value={assignTopic}
                  onChange={(e) => setAssignTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 py-0.5">Quick Pick:</span>
                  {[
                    'Rolling on Incline & Friction',
                    'Le Chatelier Inert Gas',
                    "King's Rule Symmetry Integral",
                    "Lenz's Law Flux Oppose",
                  ].map((topicSuggestion) => (
                    <button
                      key={topicSuggestion}
                      type="button"
                      onClick={() => setAssignTopic(topicSuggestion)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-50 hover:text-slate-700 text-slate-600 rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      {topicSuggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Questions
                  </label>
                  <input
                    type="number"
                    value={assignCount}
                    onChange={(e) => setAssignCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={assignXp}
                    onChange={(e) => setAssignXp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
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
                  className="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-100 cursor-pointer"
                >
                  Dispatch Drill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. Modal: View Answer Key Grid for Conducted Paper           */}
      {/* ============================================================ */}
      {viewingPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-extrabold text-[10px] rounded-md uppercase">
                  {viewingPaper.testNumber}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">{viewingPaper.title}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {viewingPaper.questionCount} Questions • {viewingPaper.totalMarks} Total Marks
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingPaper(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Answer Key Grid View */}
            <div className="grid grid-cols-5 gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              {Array.from({ length: viewingPaper.questionCount }, (_, idx) => {
                const qNum = idx + 1;
                const correct = viewingPaper.answerKey[qNum] || 'A';
                return (
                  <div
                    key={qNum}
                    className="p-2 bg-white rounded-xl border border-slate-200/80 text-center shadow-2xs"
                  >
                    <span className="text-[10px] font-bold text-slate-400 block">Q{qNum}</span>
                    <span className="text-sm font-black text-blue-700 block mt-0.5">
                      Option {correct}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingPaper(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
