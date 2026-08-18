import React from 'react';
import { Atom, FlaskConical, Calculator, Layers } from 'lucide-react';
import type { OMRSection } from '../../types/test';

export interface CategoryOption {
  id: OMRSection;
  label: string;
  questionCount: number;
  totalMarks: number;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  borderColor: string;
}

export const OMR_CATEGORIES: CategoryOption[] = [
  {
    id: 'Physics',
    label: 'Physics',
    questionCount: 30,
    totalMarks: 120,
    icon: <Atom size={18} />,
    color: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
  {
    id: 'Chemistry',
    label: 'Chemistry',
    questionCount: 30,
    totalMarks: 120,
    icon: <FlaskConical size={18} />,
    color: 'text-slate-600',
    bgLight: 'bg-slate-50',
    borderColor: 'border-slate-500',
  },
  {
    id: 'Biology',
    label: 'Biology',
    questionCount: 30,
    totalMarks: 120,
    icon: <Calculator size={18} />,
    color: 'text-slate-600',
    bgLight: 'bg-slate-50',
    borderColor: 'border-slate-500',
  },
  {
    id: 'Full Paper',
    label: 'Full Paper',
    questionCount: 90,
    totalMarks: 300,
    icon: <Layers size={18} />,
    color: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
];

interface OMRCategoryTabsProps {
  selectedCategory: OMRSection;
  onSelectCategory: (category: OMRSection) => void;
  disabled?: boolean;
}

export const OMRCategoryTabs: React.FC<OMRCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
          Step 1: Select OMR Sheet Category
        </label>
        <span className="text-[11px] font-bold text-slate-400">
          Choose subject scope for accurate bubble mapping
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {OMR_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-start text-left relative cursor-pointer ${
                isSelected
                  ? `border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20`
                  : `border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs`
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 text-white shadow-xs' : `${cat.bgLight} ${cat.color}`
                  }`}
                >
                  {cat.icon}
                </div>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                )}
              </div>

              <span className={`font-black text-sm ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                {cat.label}
              </span>

              <div className="flex items-center gap-2 mt-1 text-[11px]">
                <span className={`font-extrabold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                  {cat.questionCount} Qs
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-medium">
                  {cat.totalMarks} Marks
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
