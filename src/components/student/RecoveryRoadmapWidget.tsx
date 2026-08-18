import React from 'react';
import { CheckCircle2, Map, ArrowRight, BrainCircuit, Target, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecoveryRoadmapWidgetProps {
  weakGapsCount: number;
  testAccuracy: number;
}

export const RecoveryRoadmapWidget: React.FC<RecoveryRoadmapWidgetProps> = ({
  weakGapsCount,
  testAccuracy,
}) => {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl text-white space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-black">
          <Map size={20} />
        </div>
        <div>
          <h3 className="font-black text-base text-white">Learning GPS: Recovery Roadmap</h3>
          <p className="text-xs text-slate-400">Step-by-step path to 85%+ NEET Advanced mastery</p>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 pb-2">
        {/* Step 1: OMR Scanned & Evaluated */}
        <div className="relative pl-6">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-500 ring-4 ring-slate-900 flex items-center justify-center">
            <CheckCircle2 size={10} className="text-white" />
          </div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
            Step 1 • Completed
          </p>
          <h4 className="font-extrabold text-xs text-slate-200">OMR Sheet Evaluated</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Analyzed with {testAccuracy}% accuracy and full bubble extraction.
          </p>
        </div>

        {/* Step 2: Concept Gap Review */}
        <div className="relative pl-6">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-500 ring-4 ring-slate-900 animate-ping" />
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-500 ring-4 ring-slate-900 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
            Step 2 • Action Required
          </p>
          <h4 className="font-extrabold text-xs text-white">Review Concept Gaps</h4>
          <p className="text-[11px] text-slate-300 mt-0.5">
            {weakGapsCount} weak topic{weakGapsCount > 1 ? 's' : ''} detected from incorrect options.
          </p>
        </div>

        {/* Step 3: Practice Verification Quiz */}
        <div className="relative pl-6 opacity-70">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-700 ring-4 ring-slate-900" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
            Step 3 • Next Step
          </p>
          <h4 className="font-extrabold text-xs text-slate-300">Practice Verification Quiz</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Score ≥ 80% on targeted drill to mark topics as Mastered.
          </p>
        </div>

        {/* Step 4: Next Mock Target */}
        <div className="relative pl-6 opacity-50">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-800 ring-4 ring-slate-900" />
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-0.5">
            Step 4 • Goal
          </p>
          <h4 className="font-extrabold text-xs text-slate-400">Next Grand Mock Ready</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Aiming for 250+ marks and Top 3 Batch Rank.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Link
          to="/student/mock-tests"
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <BrainCircuit size={14} />
          <span>Go to Mock Tests & Practice</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
