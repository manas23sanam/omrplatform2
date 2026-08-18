import React from 'react';
import { Atom, FlaskConical, Calculator, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SubjectMastery } from '../../types/student';

interface SubjectMasteryBreakdownProps {
  masteries: SubjectMastery[];
}

export const SubjectMasteryBreakdown: React.FC<SubjectMasteryBreakdownProps> = ({ masteries }) => {
  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Physics':
        return <Atom size={20} className="text-blue-600" />;
      case 'Chemistry':
        return <FlaskConical size={20} className="text-slate-600" />;
      default:
        return <Calculator size={20} className="text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-900 text-lg">Subject Mastery Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated proficiency across all completed NEET test papers
          </p>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Target: 80%+
        </span>
      </div>

      <div className="space-y-6">
        {masteries.map((m) => {
          return (
            <div key={m.subject} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${m.bgLight} flex items-center justify-center font-black`}>
                    {getSubjectIcon(m.subject)}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{m.subject}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {m.totalQuestionsAttempted} Questions Attempted • {m.accuracy}% Accuracy
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-xl text-slate-900">{m.masteryPercentage}%</span>
                  <span className="text-[11px] text-slate-400 block">
                    {m.weakTopicsCount} weak topic{m.weakTopicsCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Dual-layered Progress Bar with Benchmark */}
              <div className="relative">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div
                    className={`h-full ${m.color} rounded-full transition-all duration-1000 ease-out shadow-xs`}
                    style={{ width: `${m.masteryPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">
                  {m.masteryPercentage >= 80 ? (
                    <span className="text-slate-600 font-bold">✓ NEET Target Benchmark Met</span>
                  ) : (
                    <span className="text-slate-600 font-bold">
                      {80 - m.masteryPercentage}% to reach NEET Advanced Benchmark
                    </span>
                  )}
                </span>

                <Link
                  to="/student/mock-tests"
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Practice {m.subject}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
