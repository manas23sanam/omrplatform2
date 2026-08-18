import React, { useState } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import type { SubjectName } from '../../types/student';
import type { MissedQuestionStat, NewAssignmentInput } from '../../types/test';

interface AssignRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignment: NewAssignmentInput) => void;
  initialQuestion?: MissedQuestionStat | null;
  activeBatch: string;
}

export const AssignRemediationModal: React.FC<AssignRemediationModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  initialQuestion,
  activeBatch,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(
    initialQuestion
      ? `${initialQuestion.topic} Targeted Remediation Drill`
      : 'Rotational Dynamics AI Practice Pack'
  );
  const [subject, setSubject] = useState<SubjectName>(initialQuestion?.subject || 'Physics');
  const [targetTopic, setTargetTopic] = useState(initialQuestion?.topic || 'Rotational Dynamics');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Hard');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [dueDate, setDueDate] = useState<string>('2026-08-20');
  const [xpReward, setXpReward] = useState<number>(150);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign({
      title,
      subject,
      targetTopic,
      difficulty,
      questionCount,
      assignedToBatch: activeBatch,
      dueDate,
      xpReward,
      description: `Targeted MCQ practice drill focusing on ${targetTopic}. Designed to remediate high error rate concept gaps.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send size={18} />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">Assign Targeted Remediation</h3>
              <p className="text-[11px] text-slate-500 font-medium">Dispatches targeted MCQ practice to {activeBatch}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="Easy">Easy (Foundation)</option>
                <option value="Medium">Medium (NEET Main)</option>
                <option value="Hard">Hard (NEET Advanced)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Target Concept / Gap
            </label>
            <input
              type="text"
              required
              value={targetTopic}
              onChange={(e) => setTargetTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Questions
              </label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Reward XP
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Dispatch Drill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
