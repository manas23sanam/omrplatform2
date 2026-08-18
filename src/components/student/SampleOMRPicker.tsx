import React from 'react';
import { FileText, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import type { OMRSection } from '../../types/test';

export interface SampleOMRSheet {
  id: string;
  testId: string;
  testNumber: string;
  title: string;
  section: OMRSection;
  questionCount: number;
  totalMarks: number;
  thumbnailColor: string;
  badgeLabel: string;
  summary: string;
}

export const PRESET_SAMPLE_OMRS: SampleOMRSheet[] = [
  {
    id: 'sample-full-paper-4',
    testId: 'paper-01',
    testNumber: 'Mock #4',
    title: 'NEET Advanced Grand Mock #4 - Full Syllabus',
    section: 'Full Paper',
    questionCount: 90,
    totalMarks: 300,
    thumbnailColor: 'from-blue-600 to-blue-700',
    badgeLabel: 'Grand Mock',
    summary: 'Full 90-question paper covering Physics, Chemistry, and Biology with realistic bubble distributions.',
  },
  {
    id: 'sample-physics-mechanics',
    testId: 'paper-02',
    testNumber: 'UT-12',
    title: 'Rotational Dynamics & Mechanics Unit Test',
    section: 'Physics',
    questionCount: 30,
    totalMarks: 120,
    thumbnailColor: 'from-blue-600 to-blue-700',
    badgeLabel: 'Physics Special',
    summary: '30 questions covering Moment of Inertia, Torque, Angular Momentum, and Rolling Motion.',
  },
  {
    id: 'sample-chemistry-organic',
    testId: 'paper-03',
    testNumber: 'UT-08',
    title: 'Thermodynamics & Organic Reaction Mechanisms',
    section: 'Chemistry',
    questionCount: 30,
    totalMarks: 120,
    thumbnailColor: 'from-slate-600 to-blue-700',
    badgeLabel: 'Chemistry Focus',
    summary: '30 questions testing Le Chatelier principle, Gibbs free energy, and SN1/SN2 kinetics.',
  },
  {
    id: 'sample-biology-calculus',
    testId: 'paper-04',
    testNumber: 'UT-15',
    title: 'Definite Integrals & Coordinate Geometry Sprint',
    section: 'Biology',
    questionCount: 30,
    totalMarks: 120,
    thumbnailColor: 'from-slate-600 to-slate-700',
    badgeLabel: 'Biology Unit',
    summary: '30 questions covering King Property of integration, conic sections, and 3D vectors.',
  },
];

interface SampleOMRPickerProps {
  onSelectSample: (sample: SampleOMRSheet) => void;
  selectedSampleId?: string | null;
  disabled?: boolean;
}

export const SampleOMRPicker: React.FC<SampleOMRPickerProps> = ({
  onSelectSample,
  selectedSampleId,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-slate-500" />
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            1-Click Demo: Sample OMR Sheets
          </h4>
        </div>
        <span className="text-[11px] font-bold text-blue-600">Instant Demo Ready</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESET_SAMPLE_OMRS.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          return (
            <div
              key={sample.id}
              onClick={() => !disabled && onSelectSample(sample)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 shadow-2xs'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sample.thumbnailColor} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs`}
                >
                  <FileText size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      {sample.badgeLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{sample.testNumber}</span>
                  </div>

                  <h5 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                    {sample.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {sample.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-500 text-[11px]">
                  {sample.questionCount} Questions • {sample.totalMarks} Marks
                </span>
                <span
                  className={`font-black text-xs flex items-center gap-1 ${
                    isSelected ? 'text-blue-700' : 'text-blue-600 group-hover:text-blue-800'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 size={13} className="text-blue-600" />
                      Loaded
                    </>
                  ) : (
                    <>
                      Use Sample
                      <ArrowRight size={12} />
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
