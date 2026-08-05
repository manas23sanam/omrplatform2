import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, Camera, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'complete';

export const Upload = () => {
  const [state, setState] = useState<UploadState>('idle');
  const [analysisStep, setAnalysisStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    'Scanning OMR sheet...',
    'Extracting marked bubbles...',
    'Verifying against Answer Key...',
    'Performing concept gap analysis...',
    'Generating personalized report...'
  ];

  const handleUpload = () => {
    setState('uploading');
    
    // Simulate upload delay
    setTimeout(() => {
      setState('analyzing');
      
      const interval = setInterval(() => {
        setAnalysisStep(prev => prev < steps.length - 1 ? prev + 1 : prev);
      }, 1200);

      // Simulate AI completion
      setTimeout(() => {
        clearInterval(interval);
        setAnalysisStep(steps.length - 1);
        
        setTimeout(() => {
          setState('complete');
          setTimeout(() => {
            navigate('/analysis/mock-test-id');
          }, 1500); // Redirect to analysis
        }, 500);
      }, 6500);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Upload OMR Sheet</h2>
        <p className="text-gray-500 text-lg mt-1">
          Take a clear photo of your filled OMR sheet to get instant AI evaluation.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
        
        {(state === 'idle' || state === 'uploading') && (
          <div className="w-full max-w-2xl space-y-8">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-3xl p-8 md:p-16 text-center bg-gray-50 hover:bg-gray-100/50 hover:border-indigo-300 transition-colors cursor-pointer group"
              onClick={handleUpload}
            >
              <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
                <UploadCloud className="text-indigo-600 w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select file or take a photo</h3>
              <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-8">
                Ensure all 4 corner markers of the OMR are visible and the image is not blurry.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center">
                  <Camera size={20} /> Open Camera
                </button>
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto">
                  {state === 'uploading' ? 'Uploading...' : 'Browse Files'}
                </button>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-3 text-sm uppercase tracking-wider">Tips for a good scan</h4>
              <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                <li>Place the OMR on a flat, well-lit surface.</li>
                <li>Avoid shadows falling directly over the bubbles.</li>
                <li>Ensure the barcode and QR codes are not cut off.</li>
              </ul>
            </div>
          </div>
        )}

        {state === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-12 w-full max-w-md">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 relative z-10">
                <BrainCircuit size={48} className="text-indigo-600 animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">AI is evaluating your OMR...</h3>
            
            <div className="space-y-5 w-full">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    idx < analysisStep 
                      ? 'text-green-600' 
                      : idx === analysisStep 
                        ? 'text-indigo-600 font-bold scale-105 transform origin-left' 
                        : 'text-gray-300'
                  }`}
                >
                  <div className="shrink-0">
                    {idx < analysisStep ? (
                      <CheckCircle2 size={24} className="text-green-500" />
                    ) : idx === analysisStep ? (
                      <Loader2 size={24} className="animate-spin text-indigo-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                    )}
                  </div>
                  <span className="text-base">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state === 'complete' && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-inner">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Complete!</h2>
            <p className="text-gray-500">Redirecting to your personalized analysis report...</p>
          </div>
        )}

      </div>
    </div>
  );
};
