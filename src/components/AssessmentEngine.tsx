import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, Loader2, X, BrainCircuit } from 'lucide-react';

interface AssessmentEngineProps {
  onClose: () => void;
  onComplete?: (data: any) => void;
}

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'complete';

export const AssessmentEngine = ({ onClose, onComplete }: AssessmentEngineProps) => {
  const [state, setState] = useState<UploadState>('idle');
  const [analysisStep, setAnalysisStep] = useState(0);

  const steps = [
    'Running OCR Extraction...',
    'Recognizing Diagrams & Equations...',
    'Performing Semantic Understanding...',
    'Comparing with Ideal Answer...',
    'Mapping Errors to Curriculum Nodes...',
    'Generating Learning Plan...'
  ];

  const handleUpload = async () => {
    setState('uploading');
    
    // Simulate slight delay for "upload" UI
    setTimeout(async () => {
      setState('analyzing');
      
      // Start fake progress bar for analysis steps
      const interval = setInterval(() => {
        setAnalysisStep(prev => prev < steps.length - 1 ? prev + 1 : prev);
      }, 800);

      try {
        // Mock a file upload to our new FastAPI Backend
        const formData = new FormData();
        // create a fake file
        const fakeBlob = new Blob(['test'], { type: 'text/plain' });
        formData.append('file', fakeBlob, 'student_test.jpg');

        const response = await fetch('http://localhost:8000/api/assess', {
          method: 'POST',
          body: formData
        });

        let result = null;
        if (response.ok) {
          result = await response.json();
          console.log("Backend AI Result:", result);
        }

        clearInterval(interval);
        setAnalysisStep(steps.length - 1);
        
        setTimeout(() => {
          setState('complete');
          setTimeout(() => {
            if (onComplete && result) {
              onComplete(result);
            } else {
              onClose();
            }
          }, 1500); // Auto close after showing complete
        }, 500);
      } catch (err) {
        console.error("Failed to connect to backend", err);
        clearInterval(interval);
        onClose();
      }
    }, 500);
  };

  useEffect(() => {
    // The interval is now handled inside handleUpload
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Answer Sheet</h2>
              <p className="text-gray-500 mt-1">Upload your work to find out what to study next.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          
          {(state === 'idle' || state === 'uploading') && (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 md:p-16 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={handleUpload}
            >
              <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="text-primary-500 w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Drag & drop your answer sheet</h3>
              <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md mx-auto">Supports handwritten papers, PDFs, and images.</p>
              <button className="bg-primary-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm w-full sm:w-auto">
                {state === 'uploading' ? 'Uploading...' : 'Browse Files'}
              </button>
            </div>
          )}

          {state === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="text-primary-500 animate-spin mb-8" />
              <div className="space-y-4 w-full max-w-md">
                {steps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-4 transition-all duration-300 ${
                      idx < analysisStep ? 'text-slate-600' : idx === analysisStep ? 'text-primary-600 font-medium scale-105' : 'text-gray-300'
                    }`}
                  >
                    {idx < analysisStep ? <CheckCircle2 size={20} /> : idx === analysisStep ? <Loader2 size={20} className="animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state === 'complete' && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-500">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
              <p className="text-gray-500">Your weak topics have been identified.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
