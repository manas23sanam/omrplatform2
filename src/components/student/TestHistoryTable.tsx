import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import type { StudentScoreHistory } from '../../types/student';

interface TestHistoryTableProps {
  scoreHistory: StudentScoreHistory[];
}

export const TestHistoryTable: React.FC<TestHistoryTableProps> = ({ scoreHistory }) => {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-900 text-lg">Evaluation & Test History Log</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete record of your scanned OMR sheets and mock exam evaluations
          </p>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {scoreHistory.length} Completed Tests
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Test Name & Number</th>
              <th className="py-3.5 px-4">Date Evaluated</th>
              <th className="py-3.5 px-4 text-center">Score / Marks</th>
              <th className="py-3.5 px-4 text-center">Batch Rank</th>
              <th className="py-3.5 px-4 text-center">Subject Breakdown</th>
              <th className="py-3.5 px-4 text-right">Diagnostic Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scoreHistory.map((test) => (
              <tr key={test.testId} className="hover:bg-slate-50/80 transition-colors">
                {/* Test Title & Number */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {test.testNumber}
                      </span>
                      <h5 className="font-extrabold text-xs text-slate-900 mt-1">{test.testTitle}</h5>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-4 text-slate-500 font-medium">
                  {test.date}
                </td>

                {/* Score */}
                <td className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="font-black text-xs text-slate-900">
                      {test.score} / {test.totalMarks}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">
                      {test.percentage}% ({test.accuracy}% Acc)
                    </span>
                  </div>
                </td>

                {/* Rank */}
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-black text-xs text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                    <Award size={12} className="text-slate-500" />
                    #{test.rank} in Batch
                  </span>
                </td>

                {/* Subject Scores */}
                <td className="py-4 px-4 text-center">
                  <div className="inline-flex items-center gap-1.5 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                      P: {test.physicsScore}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-700 font-bold">
                      C: {test.chemistryScore}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-700 font-bold">
                      M: {test.biologyScore}
                    </span>
                  </div>
                </td>

                {/* Action Link */}
                <td className="py-4 px-4 text-right">
                  <Link
                    to={`/student/analysis/${test.testId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>View Analysis</span>
                    <ArrowRight size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
