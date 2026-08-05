import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ChevronRight, Calculator, FlaskConical, Book, Globe, Milestone } from 'lucide-react';
import { AssessmentEngine } from './AssessmentEngine';

interface SubjectCardProps {
  subject: string;
  masteryStatus: string;
  icon: 'math' | 'science' | 'english' | 'history' | 'geography';
}

export const SubjectCard = ({ subject, masteryStatus, icon }: SubjectCardProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const getIcon = () => {
    switch (icon) {
      case 'math': return <Calculator size={24} className="text-blue-500" />;
      case 'science': return <FlaskConical size={24} className="text-green-500" />;
      case 'english': return <Book size={24} className="text-purple-500" />;
      case 'history': return <Milestone size={24} className="text-amber-500" />;
      case 'geography': return <Globe size={24} className="text-teal-500" />;
    }
  };

  const getBgColor = () => {
    switch (icon) {
      case 'math': return 'bg-blue-50';
      case 'science': return 'bg-green-50';
      case 'english': return 'bg-purple-50';
      case 'history': return 'bg-amber-50';
      case 'geography': return 'bg-teal-50';
    }
  };

  const handleAssessmentComplete = (data: any) => {
    setIsUploadOpen(false);
    setAssessmentResult(data);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        
        {/* Card Header */}
        <div className="p-6 pb-4 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getBgColor()}`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800">{subject}</h3>
              <p className="text-sm font-medium text-gray-500">{assessmentResult ? assessmentResult.mastery_status : masteryStatus}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
          >
            <UploadCloud size={18} />
            Upload Paper
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-gray-50/50 flex-1 flex flex-col justify-center">
          {!assessmentResult ? (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <p className="text-gray-400 text-sm">No recent paper uploaded.</p>
              <p className="text-gray-400 text-sm mt-1">Upload your latest test to see what to study next.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnostic Result</h4>
              
              <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm flex flex-col gap-3 group cursor-pointer hover:border-red-400 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-bold text-gray-900 text-lg">{assessmentResult.root_cause.concept_node}</span>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {assessmentResult.root_cause.message}
                </p>

                <div className="mt-2 flex items-center gap-1 text-primary-600 font-bold text-sm group-hover:translate-x-1 transition-transform self-end bg-primary-50 px-4 py-2 rounded-lg">
                  Study this concept <ChevronRight size={16} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isUploadOpen && <AssessmentEngine onClose={() => setIsUploadOpen(false)} onComplete={handleAssessmentComplete} />}
    </>
  );
};
