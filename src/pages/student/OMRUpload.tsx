import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  FileCheck,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import type { OMRSection } from '../../types/test';
import { OMRCategoryTabs } from '../../components/student/OMRCategoryTabs';
import { SampleOMRPicker, type SampleOMRSheet, PRESET_SAMPLE_OMRS } from '../../components/student/SampleOMRPicker';
import { CameraSimulatorModal } from '../../components/student/CameraSimulatorModal';
import { OMRScanVisualizer } from '../../components/student/OMRScanVisualizer';
import { useLearningStore } from '../../context/LearningStoreContext';

export const OMRUpload: React.FC = () => {
  const { selectedBatch } = useLearningStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<OMRSection>('Full Paper');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleOMRSheet | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleSelectCategory = (category: OMRSection) => {
    setSelectedCategory(category);
  };

  const handleSelectSample = (sample: SampleOMRSheet) => {
    setSelectedSample(sample);
    setSelectedCategory(sample.section);
    setSelectedFile(null);
    setPreviewUrl(
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="60" fill="%23312e81" rx="8"/><text x="40" y="55" fill="white" font-family="sans-serif" font-weight="bold" font-size="14">Riyoshi Coaching - OMR</text><text x="40" y="70" fill="%23a5b4fc" font-family="sans-serif" font-size="10">' +
        encodeURIComponent(sample.title) +
        '</text><circle cx="60" cy="140" r="8" fill="%231e293b"/><circle cx="100" cy="140" r="8" fill="white" stroke="%2394a3b8"/><circle cx="140" cy="140" r="8" fill="white" stroke="%2394a3b8"/><circle cx="180" cy="140" r="8" fill="white" stroke="%2394a3b8"/><text x="40" y="144" fill="%23475569" font-family="sans-serif" font-size="10">Q1</text><circle cx="60" cy="180" r="8" fill="white" stroke="%2394a3b8"/><circle cx="100" cy="180" r="8" fill="%231e293b"/><circle cx="140" cy="180" r="8" fill="white" stroke="%2394a3b8"/><circle cx="180" cy="180" r="8" fill="white" stroke="%2394a3b8"/><text x="40" y="184" fill="%23475569" font-family="sans-serif" font-size="10">Q2</text></svg>'
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedSample(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setSelectedSample(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCameraCapture = (capturedDataUrl: string) => {
    setPreviewUrl(capturedDataUrl);
    setSelectedSample(null);
    setSelectedFile(null);
  };

  const handleStartScan = () => {
    if (!previewUrl) {
      // If no file loaded, auto-load default sample 1
      handleSelectSample(PRESET_SAMPLE_OMRS[0]);
    }
    setIsScanning(true);
  };

  const handleReset = () => {
    setIsScanning(false);
    setSelectedFile(null);
    setSelectedSample(null);
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 font-sans">
      {/* Header Banner */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-1">
            Upload OMR Sheet
          </h2>
          <p className="text-slate-500 text-sm">
            Select a subject and upload your completed test sheet for analysis.
          </p>
        </div>
      </div>
      
      {/* API Key Input for Local Host */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-amber-900 block mb-1">Google Gemini API Key (Required for Actual Scanning)</label>
          <input 
            type="password" 
            placeholder="AIzaSy..." 
            className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            defaultValue={localStorage.getItem('GEMINI_API_KEY') || ''}
            onChange={(e) => {
              if (e.target.value) {
                localStorage.setItem('GEMINI_API_KEY', e.target.value);
              } else {
                localStorage.removeItem('GEMINI_API_KEY');
              }
            }}
          />
        </div>
        <div className="text-[10px] text-amber-700 max-w-[200px]">
          Since this is a client-side demo, your key is stored locally in your browser and used directly.
        </div>
      </div>

      {isScanning ? (
        /* Multi-Stage Scan Simulation Visualizer */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              Upload Different Sheet
            </button>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Target Category: {selectedCategory}
            </span>
          </div>

          <OMRScanVisualizer
            section={selectedCategory}
            testId={selectedSample?.testId || 'paper-01'}
            scannedImageUrl={previewUrl || undefined}
            selectedFile={selectedFile}
          />
        </div>
      ) : (
        /* Upload Configuration Form */
        <div className="space-y-8">
          {/* Step 1: Category Selection Tabs (F14) */}
          <OMRCategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />

          {/* Step 2: Drag & Drop Zone / Camera Simulator Trigger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Step 2: Upload or Capture OMR Sheet
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-bold text-slate-600 hover:text-slate-700 underline"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!previewUrl ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all flex flex-col items-center justify-center bg-white ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50 shadow-2xs'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
                  <UploadCloud size={32} />
                </div>

                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  Drag & drop your OMR sheet image here
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mb-6">
                  Supports JPG, PNG, WEBP, and PDF. Ensure all 4 corner registration marks are clearly visible.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Camera size={16} />
                    Open Camera Scanner
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <UploadCloud size={16} />
                    Browse Files
                  </button>
                </div>
              </div>
            ) : (
              /* Loaded Preview Container */
              <div className="bg-white rounded-3xl p-6 border-2 border-blue-500/40 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black shrink-0">
                      <FileCheck size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {selectedCategory}
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {selectedSample?.title || selectedFile?.name || 'Camera Captured OMR Sheet'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Ready for AI optical analysis • All 4 fiducials calibrated
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Retake Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Change File
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-ping" />
                    Target Answer Key Loaded (+4 / -1 NEET Marking)
                  </div>

                  <button
                    type="button"
                    onClick={handleStartScan}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-sm transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Sparkles size={16} className="text-slate-400" />
                    <span>Start AI Evaluation</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Sample OMR Sheets Preset Picker (F14) */}
          <SampleOMRPicker
            selectedSampleId={selectedSample?.id}
            onSelectSample={handleSelectSample}
          />

          {/* Quick Guidelines Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Info size={20} />
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Riyoshi Coaching OMR Scanning Standards
              </h4>
              <p>
                • Use dark HB pencil or black/blue ballpoint pen to fill bubbles completely.
              </p>
              <p>
                • Keep camera parallel to paper to avoid perspective distortion exceeding ±5°.
              </p>
              <p>
                • Negative marking (-1) is automatically applied for incorrect answers in accordance with NEET Advanced standards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Camera Simulator Modal (F14) */}
      <CameraSimulatorModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
        categoryLabel={selectedCategory}
      />
    </div>
  );
};

