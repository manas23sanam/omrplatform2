import React from 'react';
import { BookOpen, Send } from 'lucide-react';
import type { MissedQuestionStat } from '../../types/test';

interface FrequentlyMissedQuestionsTableProps {
  questions: MissedQuestionStat[];
  onAssignRemediation: (question: MissedQuestionStat) => void;
}

export const FrequentlyMissedQuestionsTable: React.FC<FrequentlyMissedQuestionsTableProps> = ({
  questions,
  onAssignRemediation,
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <BookOpen size={16} />
        </div>
        <div>
          <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
            Important Topics to Teach
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Topics requiring immediate faculty attention based on class performance
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <th className="py-3.5 px-4">Subject</th>
              <th className="py-3.5 px-4">Important Topic</th>
              <th className="py-3.5 px-4">Class Miss Rate</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {questions.map((q, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold border bg-slate-50 text-slate-700 border-slate-200">
                    {q.subject}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-extrabold text-slate-900 text-sm">{q.topic}</p>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-black text-slate-700">{q.missedPercentage}%</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onAssignRemediation(q)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-extrabold transition-all cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Assign Drill</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
