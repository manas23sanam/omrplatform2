import React from 'react';
import type { SubjectName } from '../../types/student';

export interface TopicAnalysisItem {
  id: string;
  topicName: string;
  subject: SubjectName;
  missRate: number; // 0.0 to 1.0
  attempts: number;
  misses: number;
  testsAppearedIn: number;
  testsMissedIn: number;
  priority: 'High' | 'Medium' | 'Low';
  reasoning: string;
  isAssigned: boolean;
}

interface WeakTopicAnalysisProps {
  topics: TopicAnalysisItem[];
  viewType: 'student' | 'teacher';
  onActionClick: (topicId: string) => void;
}

const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
  switch (priority) {
    case 'High':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Medium':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const WeakTopicAnalysis: React.FC<WeakTopicAnalysisProps> = ({
  topics,
  viewType,
  onActionClick,
}) => {
  return (
    <div className="w-full bg-slate-50 rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-900">
          {viewType === 'teacher' ? 'Class Weak Topic Analysis' : 'Focus Areas & Practice Assignments'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {viewType === 'teacher'
            ? 'Aggregated concepts missed across recent tests. Select to assign targeted practice.'
            : 'Recent test practice assignments and focus areas.'}
        </p>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`flex flex-col md:flex-row md:items-center justify-between p-5 bg-white rounded-2xl transition-colors gap-4 border ${topic.isAssigned && viewType === 'student' ? 'border-green-400 shadow-sm shadow-green-100' : 'border-slate-100'}`}
          >
            <div className="flex-1 min-w-0 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {topic.subject}
              </span>
              <h4 className="font-extrabold text-base text-slate-900 truncate">
                {topic.topicName}
              </h4>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 md:mt-0">
              {viewType === 'student' ? (
                <>
                  <button
                    type="button"
                    onClick={() => onActionClick(topic.id)}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Read Theory & Mistakes
                  </button>
                  <button
                    type="button"
                    onClick={() => onActionClick(topic.id)}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Start Practice
                  </button>
                  <button
                    type="button"
                    onClick={() => onActionClick(topic.id)}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                  >
                    Start Assigned Drill
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onActionClick(topic.id)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-xs"
                >
                  Assign Practice
                </button>
              )}
            </div>
          </div>
        ))}
        {topics.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm font-medium bg-white rounded-2xl border border-slate-100">
            No weak topics detected. Great job!
          </div>
        )}
      </div>
    </div>
  );
};
