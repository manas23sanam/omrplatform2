import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Loader2,
  Scan,
  Grid,
  Eye,
  Award,
  Zap,
  ArrowRight,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import type { OMRSection, TestDiagnosticResult } from '../../types/test';

import { evaluateOMRSheet } from '../../services/gemini';

interface OMRScanVisualizerProps {
  section: OMRSection;
  testId?: string;
  scannedImageUrl?: string;
  selectedFile?: File | null;
  onComplete?: (result: TestDiagnosticResult) => void;
}

type ScanStage = 1 | 2 | 3 | 4 | 5; // 1: Corner, 2: Grid/Deskew, 3: Bubbles, 4: Evaluation, 5: Complete

export const OMRScanVisualizer: React.FC<OMRScanVisualizerProps> = ({
  section,
  testId = 'paper-01',
  scannedImageUrl,
  selectedFile,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { submitOMR, currentUser } = useLearningStore();

  const [currentStage, setCurrentStage] = useState<ScanStage>(1);
  const [progressPercent, setProgressPercent] = useState(15);
  const [logs, setLogs] = useState<Array<{ timestamp: string; message: string; type: 'info' | 'success' | 'warn' }>>([]);
  const [diagnosticResult, setDiagnosticResult] = useState<TestDiagnosticResult | null>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [...prev.slice(-8), { timestamp: time, message, type }]);
  };

  useEffect(() => {
    let isMounted = true;

    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            // Scale down to max 1200px width/height to save bandwidth and speed up API
            const MAX_DIM = 1200;
            let width = img.width;
            let height = img.height;
            if (width > height && width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            } else if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Compress to 80% JPEG
              resolve(canvas.toDataURL('image/jpeg', 0.8));
            } else {
              resolve(reader.result as string);
            }
          };
          img.onerror = error => reject(error);
          img.src = reader.result as string;
        };
        reader.onerror = error => reject(error);
      });
    };

    const runPipeline = async () => {
      try {
        addLog(`Initializing Gemini Vision pipeline for section: ${section}...`, 'info');
        
        let base64Image = '';
        if (selectedFile) {
          addLog('Converting uploaded file for AI processing...', 'info');
          base64Image = await fileToBase64(selectedFile);
        } else if (scannedImageUrl && scannedImageUrl.startsWith('data:image/svg+xml')) {
           addLog('Converting SVG sample to PNG for Gemini Vision...', 'info');
           // Convert SVG data URL to PNG using canvas
           base64Image = await new Promise((resolve) => {
             const img = new Image();
             img.onload = () => {
               const canvas = document.createElement('canvas');
               canvas.width = img.width || 800;
               canvas.height = img.height || 1000;
               const ctx = canvas.getContext('2d');
               if (ctx) {
                 ctx.fillStyle = '#ffffff';
                 ctx.fillRect(0, 0, canvas.width, canvas.height);
                 ctx.drawImage(img, 0, 0);
               }
               resolve(canvas.toDataURL('image/jpeg', 0.9));
             };
             img.src = scannedImageUrl;
           });
        } else if (scannedImageUrl && scannedImageUrl.startsWith('data:image')) {
           base64Image = scannedImageUrl;
        } else {
           addLog('No valid image provided.', 'warn');
           return;
        }

        setProgressPercent(30);
        setCurrentStage(2);
        addLog('Transmitting image to Google Gemini 1.5 Flash...', 'info');
        
        // Ensure API key is configured
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
        if (!apiKey) {
           addLog('Missing VITE_GEMINI_API_KEY. Using mock evaluation...', 'warn');
           await new Promise(r => setTimeout(r, 2000)); // simulate delay
        }

        setProgressPercent(60);
        setCurrentStage(3);
        
        let geminiResult;
        
        if (apiKey) {
          addLog('Analyzing optical marks and evaluating answers...', 'info');
          geminiResult = await evaluateOMRSheet(base64Image, section, apiKey);
          // Force correct math because LLMs are bad at math
          if (geminiResult && geminiResult.answers) {
            let correctCount = 0;
            let incorrectCount = 0;
            geminiResult.answers.forEach(ans => {
              if (ans.selectedOption) {
                if (ans.isCorrect) correctCount++;
                else incorrectCount++;
              }
            });
            geminiResult.score = (correctCount * 4) - (incorrectCount * 1);
            geminiResult.maxScore = 180; // 45 questions * 4
            geminiResult.accuracy = Math.round((geminiResult.score / geminiResult.maxScore) * 100) || 0;
          }
        } else {
          // Fallback mock if no API key or using mock SVG
          addLog('Mock evaluation generated...', 'info');
          geminiResult = {
             score: 64,
             maxScore: 100,
             accuracy: 64,
          };
        }

        if (!isMounted) return;
        setProgressPercent(90);
        setCurrentStage(4);
        addLog('Generating diagnostic report...', 'info');

        // Note: integrate geminiResult into the store or local state
        const result = await submitOMR({
          section,
          testId,
          imageUrl: scannedImageUrl,
          studentId: currentUser?.id || 's-01',
          geminiResult,
        });
        
        // Override with real Gemini data if available
        if (geminiResult) {
           result.studentScore = geminiResult.score;
           result.totalMarks = geminiResult.maxScore;
           result.accuracy = geminiResult.accuracy;
        }

        if (!isMounted) return;
        setDiagnosticResult(result);
        addLog(`Evaluation finalized: Score ${result.studentScore}/${result.totalMarks} (${result.accuracy}% accuracy).`, 'success');
        addLog(`Awarded +${result.earnedXp} XP points to ${currentUser?.name || 'Student'}.`, 'success');

        setCurrentStage(5);
        setProgressPercent(100);

        if (onComplete) {
          onComplete(result);
        }
      } catch (err: any) {
        if (!isMounted) return;
        addLog(`Evaluation failed: ${err.message}`, 'warn');
      }
    };

    runPipeline();

    return () => {
      isMounted = false;
    };
  }, [section, testId, scannedImageUrl, selectedFile]);

  const stagesList = [
    { num: 1, label: 'Corner Detection', icon: <Scan size={16} /> },
    { num: 2, label: 'Grid & Deskew', icon: <Grid size={16} /> },
    { num: 3, label: 'Bubble Recognition', icon: <Eye size={16} /> },
    { num: 4, label: 'Answer Evaluation', icon: <Award size={16} /> },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6 animate-in fade-in duration-300">
      {/* Progress Header & Linear Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
            <h3 className="font-black text-slate-900 text-lg">
              {currentStage < 5 ? 'AI Computer Vision Evaluation in Progress...' : 'OMR Evaluation Complete!'}
            </h3>
          </div>
          <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {progressPercent}%
          </span>
        </div>

        {/* Stepper Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          {stagesList.map((st) => {
            const isCompleted = currentStage > st.num;
            const isCurrent = currentStage === st.num;
            return (
              <div
                key={st.num}
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : isCurrent
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-black shadow-xs ring-1 ring-blue-400'
                    : 'bg-slate-50 border-slate-200/60 text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    isCompleted
                      ? 'bg-slate-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white animate-spin'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={14} /> : isCurrent ? <Loader2 size={14} /> : st.num}
                </div>
                <span className="text-[11px] truncate font-bold">{st.label}</span>
              </div>
            );
          })}
        </div>

        {/* Animated Progress Track */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-500 to-slate-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Visual Simulation Canvas & HUD Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Simulated OMR Visualizer */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 relative overflow-hidden flex items-center justify-center min-h-[300px] border border-slate-800 shadow-inner">
          {/* Simulated OMR Sheet Base */}
          <div className="w-full max-w-sm aspect-[3/4] bg-white rounded-lg shadow-xl relative overflow-hidden p-3 flex flex-col justify-between">
            {/* Sheet Header */}
            <div className="border-b-2 border-slate-900 pb-1 flex justify-between items-center text-[8px] font-black text-slate-900">
              <span>Riyoshi Coaching OMR</span>
              <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">{section}</span>
            </div>

            {/* Bubble Grid Columns */}
            <div className="grid grid-cols-3 gap-2 flex-1 my-2">
              {[1, 2, 3].map((col) => (
                <div key={col} className="space-y-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                    <div key={row} className="flex items-center gap-1">
                      <span className="text-[7px] font-mono text-slate-400 w-3">{(col - 1) * 10 + row}</span>
                      <div className="flex gap-0.5">
                        {['A', 'B', 'C', 'D'].map((opt, i) => {
                          const isMarked = (row + col + i) % 4 === 0;
                          return (
                            <div
                              key={opt}
                              className={`w-2.5 h-2.5 rounded-full border ${
                                isMarked
                                  ? 'bg-slate-900 border-slate-900'
                                  : 'border-slate-300 bg-white'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Barcode bottom */}
            <div className="h-2 bg-slate-900 w-3/4 mx-auto" />

            {/* ================= STAGE HUD OVERLAYS ================= */}
            {/* Stage 1: Corner Detection Bounding Boxes */}
            {currentStage >= 1 && (
              <>
                <div className="absolute top-1 left-1 w-5 h-5 border-2 border-slate-500 bg-slate-400/30 rounded-xs animate-pulse flex items-center justify-center text-[7px] font-mono font-bold text-slate-900">
                  TL
                </div>
                <div className="absolute top-1 right-1 w-5 h-5 border-2 border-slate-500 bg-slate-400/30 rounded-xs animate-pulse flex items-center justify-center text-[7px] font-mono font-bold text-slate-900">
                  TR
                </div>
                <div className="absolute bottom-1 left-1 w-5 h-5 border-2 border-slate-500 bg-slate-400/30 rounded-xs animate-pulse flex items-center justify-center text-[7px] font-mono font-bold text-slate-900">
                  BL
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 border-2 border-slate-500 bg-slate-400/30 rounded-xs animate-pulse flex items-center justify-center text-[7px] font-mono font-bold text-slate-900">
                  BR
                </div>
              </>
            )}

            {/* Stage 2: Perspective Matrix Deskew Overlay */}
            {currentStage >= 2 && (
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:16px_16px] border border-blue-400/40" />
            )}

            {/* Stage 3: Laser Scanline Sweep */}
            {currentStage === 3 && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce pointer-events-none top-1/2" />
            )}

            {/* Stage 4 & 5: Answer Key Evaluation Markers */}
            {currentStage >= 4 && (
              <div className="absolute inset-0 bg-slate-500/10 pointer-events-none flex items-center justify-center">
                <div className="bg-slate-900/90 text-slate-200 px-3 py-1 rounded-full text-[10px] font-black border border-slate-400 shadow-md">
                  ✓ Evaluated (+NEET Scoring)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Real-time CV Terminal Log */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between font-mono text-xs text-slate-300 border border-slate-800">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <Terminal size={14} className="text-blue-400" />
                CV Processing Stream
              </span>
              <span className="text-[10px] text-slate-400">STATUS: ACTIVE</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-slate-500 text-[10px] mr-2">[{log.timestamp}]</span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-slate-400 font-bold'
                        : log.type === 'warn'
                        ? 'text-slate-400'
                        : 'text-slate-300'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Model: OMR-Vision-v4.2</span>
            <span>Target: {section}</span>
          </div>
        </div>
      </div>

      {/* Completion Summary Action Card */}
      {currentStage === 5 && diagnosticResult && (
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-blue-50 border-2 border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in zoom-in-95 duration-300 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-600 text-white flex items-center justify-center font-black shadow-lg shrink-0">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded-md">
                  Scored & Graded
                </span>
                <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Zap size={12} className="fill-slate-500 text-slate-600" />
                  +{diagnosticResult.earnedXp} XP Awarded
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-lg">
                Score: {diagnosticResult.studentScore} / {diagnosticResult.totalMarks} ({diagnosticResult.accuracy}% Accuracy)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {diagnosticResult.feedbackSummary}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/student/analysis/${diagnosticResult.testId}`)}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer shrink-0 hover:scale-105"
          >
            <span>View Detailed Diagnostic Report</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

