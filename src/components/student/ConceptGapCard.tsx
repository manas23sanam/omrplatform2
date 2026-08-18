import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { WeakConceptGap } from '../../types/test';

interface ConceptGapCardProps {
  gap: WeakConceptGap;
  onStartDrill?: (practiceTopicId: string) => void;
}

export const ConceptGapCard: React.FC<ConceptGapCardProps> = ({ gap }) => {
  const getPriorityBadge = (priority: WeakConceptGap['priority']) => {
    switch (priority) {
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            Low Priority
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow space-y-3">
      {/* Header with Title, Subject & Colored Priority Badge */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400">{gap.subject}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-slate-500">
              {gap.mistakesCount} Mistake{gap.mistakesCount > 1 ? 's' : ''}
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{gap.topic}</h4>
        </div>
        <div>{getPriorityBadge(gap.priority)}</div>
      </div>

      {/* Simplified AI Root-Cause Diagnostic: Single Concise Actionable Sentence */}
      <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed">
        <p>
          <span className="font-bold text-slate-800 mr-1">AI Diagnosis:</span>
          {gap.insight}
        </p>
      </div>

      {/* Footer with EXACTLY ONE Action Link / Button */}
      <div className="pt-2 flex items-center justify-end">
        <Link
          to={`/student/practice/${gap.practiceTopicId || 'topic-rotational-friction'}`}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span>Start Practice Drill</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

