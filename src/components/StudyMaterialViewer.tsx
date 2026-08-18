import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, PlayCircle, BookOpen, BrainCircuit } from 'lucide-react';

interface StudyMaterialViewerProps {
  topicName: string;
  onClose: () => void;
  onComplete: () => void;
}

export const StudyMaterialViewer = ({ topicName, onClose, onComplete }: StudyMaterialViewerProps) => {
  const [step, setStep] = useState(0);

  const content = [
    {
      title: "What is a Percentage?",
      type: "concept",
      body: "A percentage is simply a fraction out of 100. The word 'per cent' literally means 'for every 100'. So, 50% means 50 out of 100, which is the same as 1/2.",
      interactive: (
        <div className="bg-blue-50 p-6 rounded-2xl flex items-center justify-center gap-8 mt-6">
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600">50%</div>
            <div className="text-blue-400 font-bold mt-2">Percentage</div>
          </div>
          <div className="text-4xl text-blue-300">=</div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600">50 / 100</div>
            <div className="text-blue-400 font-bold mt-2">Fraction</div>
          </div>
        </div>
      )
    },
    {
      title: "Visualizing Percentages",
      type: "video",
      body: "Watch this quick 2-minute visualization to see how percentages map to real-world objects like pizza slices and batteries.",
      interactive: (
        <div className="bg-gray-900 rounded-2xl aspect-video mt-6 relative flex items-center justify-center group cursor-pointer overflow-hidden shadow-lg border-4 border-gray-100">
          <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" alt="Video thumbnail" />
          <PlayCircle size={64} className="text-white relative z-10 opacity-90 group-hover:scale-110 transition-transform" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white text-sm font-medium z-10">
            <span>Visualizing Percentages.mp4</span>
            <span>02:15</span>
          </div>
        </div>
      )
    },
    {
      title: "Interactive Practice: Conversion",
      type: "interactive",
      body: "To convert a fraction to a percentage, multiply by 100. Let's try it with 3/4.",
      interactive: (
        <div className="bg-slate-50 p-6 md:p-8 rounded-2xl mt-6 border border-slate-100">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xl md:text-2xl font-bold text-gray-800">
            <span className="bg-white px-4 py-2 rounded-xl shadow-sm">3 / 4</span>
            <span className="text-slate-400">×</span>
            <span className="bg-white px-4 py-2 rounded-xl shadow-sm">100</span>
            <span className="text-slate-400">=</span>
            <span className="bg-slate-500 text-white px-4 md:px-6 py-2 rounded-xl shadow-md animate-pulse">75%</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Study Session</h2>
              <p className="text-gray-500 text-sm font-medium">{topicName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / content.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500" key={step}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
              <BrainCircuit size={14} />
              Part {step + 1} of {content.length}
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{content[step].title}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {content[step].body}
            </p>
            
            {content[step].interactive}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
          <button 
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold transition-colors ${step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            disabled={step === 0}
          >
            <ChevronLeft size={20} /> <span className="hidden sm:inline">Back</span>
          </button>
          
          {step < content.length - 1 ? (
            <button 
              onClick={() => setStep(prev => Math.min(content.length - 1, prev + 1))}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm flex-1 sm:flex-none"
            >
              Next <span className="hidden sm:inline">Concept</span> <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={onComplete}
              className="flex items-center justify-center gap-2 bg-slate-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold hover:bg-slate-600 transition-colors shadow-md animate-in slide-in-from-bottom-2 flex-1 sm:flex-none text-sm sm:text-base"
            >
              <CheckCircle2 size={20} className="shrink-0" /> <span className="truncate">Finish & Mark Ready</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
