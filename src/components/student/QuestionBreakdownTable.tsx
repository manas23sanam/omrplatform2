import React from 'react';
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import type { OMRQuestionEvaluation } from '../../types/test';

interface QuestionBreakdownTableProps {
  questions: OMRQuestionEvaluation[];
}

export const QuestionBreakdownTable: React.FC<QuestionBreakdownTableProps> = ({ questions }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-3 w-16">Q#</th>
              <th className="py-3 px-4">Topic & Diagnostic Summary</th>
              <th className="py-3 px-3 text-center w-24">Your Ans</th>
              <th className="py-3 px-3 text-center w-24">Key</th>
              <th className="py-3 px-3 text-center w-24">Marks</th>
              <th className="py-3 px-4 text-right w-28">Subject</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {questions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 font-medium text-xs">
                  No questions found in this evaluation.
                </td>
              </tr>
            ) : (
              questions.map((q) => {
                const isSkipped = q.studentOption === 'unattempted';
                return (
                  <tr
                    key={q.questionNumber}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Status Icon Doing Heavy Lifting */}
                    <td className="py-3.5 px-4 text-center">
                      {q.isCorrect ? (
                        <CheckCircle2 size={16} className="text-emerald-600 inline-block" />
                      ) : isSkipped ? (
                        <MinusCircle size={16} className="text-slate-400 inline-block" />
                      ) : (
                        <XCircle size={16} className="text-rose-600 inline-block" />
                      )}
                    </td>

                    {/* Q Number */}
                    <td className="py-3.5 px-3 font-black text-slate-900">
                      Q{q.questionNumber < 10 ? `0${q.questionNumber}` : q.questionNumber}
                    </td>

                    {/* Topic & AI Note */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{q.topic}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{q.aiNote}</p>
                    </td>

                    {/* Student Answer */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                      {isSkipped ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        `(${q.studentOption})`
                      )}
                    </td>

                    {/* Official Key */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                      ({q.correctOption})
                    </td>

                    {/* Marks */}
                    <td className="py-3.5 px-3 text-center font-bold">
                      {q.isCorrect ? (
                        <span className="text-emerald-700">+4</span>
                      ) : isSkipped ? (
                        <span className="text-slate-400">0</span>
                      ) : (
                        <span className="text-rose-600">-1</span>
                      )}
                    </td>

                    {/* Subject Muted Text on Right */}
                    <td className="py-3.5 px-4 text-right text-xs text-slate-400 font-medium">
                      {q.subject}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

