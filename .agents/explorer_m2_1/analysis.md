# Milestone 2 (Part A) - Teacher Class Analytics Dashboard & Charts Analysis & Blueprint

## Executive Summary
This document delivers the complete architectural design, component hierarchy, data contracts, and production-ready source code blueprints for **Milestone 2 (Part A)** of the AI Learning & OMR Diagnostic Platform.

### Scope Coverage
1. **F05: Class KPI Summary Cards**: Total Tests Conducted (18), Class Average Score (184/300, 68.4%), Cohort Accuracy (68.0%), Active Student Count (48), and Top Struggling Concept ("Rotational Dynamics: Incline Rolling Friction" - 72.5% miss rate).
2. **F06: Class Performance Over Time Graph**: Multi-metric Recharts Area/Line chart tracking historical class averages, highest scores, lowest scores, and target benchmarks across conducted mock tests with custom tooltips and metric mode toggles.
3. **F07: Subject Mastery Comparison Graph**: Comparative Recharts Bar chart showing Physics (66.0%), Chemistry (74.2%), and Mathematics (65.1%) with benchmark reference lines and subject diagnostic summary cards.
4. **F08: Frequently Missed Questions Table**: Filterable, searchable diagnostic table displaying test titles, question IDs, subject tags, miss rate percentages with color-coded severity bars, common mistake option patterns, AI root-cause diagnosis, and a 1-click "Assign Remediation" workflow.

---

## 1. Architectural Design & Component Hierarchy

```
src/
├── pages/
│   └── teacher/
│       └── TeacherDashboard.tsx                  # Main Analytics Dashboard Container
├── components/
│   └── teacher/
│       ├── ClassKPICards.tsx                     # F05: 5 Responsive KPI Summary Cards
│       ├── ClassPerformanceChart.tsx             # F06: Recharts Historical Class Performance Chart
│       ├── SubjectMasteryChart.tsx               # F07: Recharts Comparative Subject Mastery Bar Chart
│       ├── FrequentlyMissedQuestionsTable.tsx     # F08: Detailed Missed Questions Table + Filters
│       └── AssignRemediationModal.tsx            # Interactive Remediation Assignment Modal
```

---

## 2. Interface Contracts & Data Mapping

### Store Integration (`useLearningStore()`)
The dashboard and child components consume the following state and actions from `LearningStoreContext`:
```ts
const {
  selectedBatch,
  students,
  classAnalytics,
  testPapers,
  assignedTests,
  assignMCQTest,
  uploadTestPaper,
} = useLearningStore();
```

### Key Data Structures (`src/types/test.ts`)
- **`ClassAnalyticsData`**:
  ```ts
  {
    batch: string;
    totalTestsConducted: number; // 18
    classAverageScore: number;   // 68.4
    classAverageMarks?: number;  // 184
    averageAccuracy: number;     // 68.0
    activeStudentCount: number;  // 48
    subjectAverages: {
      physics: number;           // 66.0
      chemistry: number;         // 74.2
      maths: number;             // 65.1
    };
    performanceTrends: ClassPerformanceTrendPoint[];
    frequentlyMissedQuestions: MissedQuestionStat[];
  }
  ```

---

## 3. Production-Ready Component Blueprints

### Blueprint 1: `src/components/teacher/ClassKPICards.tsx` (F05)

```tsx
import React from 'react';
import {
  TrendingUp,
  FileCheck2,
  Target,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import { ClassAnalyticsData } from '../../types/test';
import { StudentRecord } from '../../types/student';

interface ClassKPICardsProps {
  analytics: ClassAnalyticsData;
  students: StudentRecord[];
  onRemediateTopGap?: (concept: string, subject: string) => void;
}

export const ClassKPICards: React.FC<ClassKPICardsProps> = ({
  analytics,
  students,
  onRemediateTopGap,
}) => {
  const topMissed = analytics.frequentlyMissedQuestions?.[0];
  const activeCount = analytics.activeStudentCount || students.length || 48;
  const avgMarks = analytics.classAverageMarks || Math.round((analytics.classAverageScore / 100) * 300) || 184;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Class Average Score */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Class Avg Score
          </span>
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{avgMarks}</span>
            <span className="text-xs font-bold text-slate-400">/ 300</span>
            <span className="text-xs font-extrabold text-indigo-600 ml-1">({analytics.classAverageScore}%)</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <ArrowUpRight size={13} />
            <span>+14.2% vs baseline test</span>
          </div>
        </div>
      </div>

      {/* 2. Total Tests Conducted */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Tests Conducted
          </span>
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileCheck2 size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {analytics.totalTestsConducted}
            </span>
            <span className="text-xs font-bold text-slate-400">Evaluated</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1 truncate" title="Latest: Grand Mock #4">
            Latest: Grand Mock #4
          </p>
        </div>
      </div>

      {/* 3. Cohort Accuracy */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Avg Accuracy
          </span>
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Target size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {analytics.averageAccuracy}%
            </span>
            <span className="text-xs font-bold text-emerald-600">Optimal</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <ArrowUpRight size={13} />
            <span>+3.8% across last 3 tests</span>
          </div>
        </div>
      </div>

      {/* 4. Active Students */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Active Students
          </span>
          <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {activeCount}
            </span>
            <span className="text-xs font-bold text-slate-400">Enrolled</span>
          </div>
          <p className="text-[11px] font-bold text-purple-600 mt-1 flex items-center gap-1">
            <Sparkles size={12} /> 100% submission rate
          </p>
        </div>
      </div>

      {/* 5. Top Struggling Concept */}
      <div className="bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 p-5 rounded-3xl border border-rose-100/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-rose-500 animate-pulse" />
            <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">
              Top Struggle
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
            {topMissed ? `${topMissed.missedPercentage}% Miss` : '72.5% Miss'}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-xs font-black text-slate-900 line-clamp-1">
            {topMissed?.topic || 'Rotational Dynamics'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            {topMissed ? `${topMissed.subject} • Q${topMissed.questionNumber}` : 'Physics • Incline Rolling'}
          </p>
          {onRemediateTopGap && (
            <button
              type="button"
              onClick={() => onRemediateTopGap(topMissed?.topic || 'Rotational Dynamics', topMissed?.subject || 'Physics')}
              className="mt-2 text-[10px] font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1 underline underline-offset-2 cursor-pointer"
            >
              <span>Assign AI Remediation</span>
              <ArrowUpRight size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### Blueprint 2: `src/components/teacher/ClassPerformanceChart.tsx` (F06)

```tsx
import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Award, Target, Calendar, CheckCircle2 } from 'lucide-react';
import { ClassPerformanceTrendPoint } from '../../types/test';

interface ClassPerformanceChartProps {
  data: ClassPerformanceTrendPoint[];
  title?: string;
  subtitle?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  viewMode: 'marks' | 'percentage';
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, viewMode }) => {
  if (active && payload && payload.length) {
    const itemData = payload[0].payload as ClassPerformanceTrendPoint;
    const avgVal = viewMode === 'marks' ? itemData.classAverage : Math.round((itemData.classAverage / 300) * 100);
    const highVal = viewMode === 'marks' ? itemData.highestScore : Math.round((itemData.highestScore / 300) * 100);
    const lowVal = viewMode === 'marks' ? itemData.lowestScore : Math.round((itemData.lowestScore / 300) * 100);
    const benchmarkVal = viewMode === 'marks' ? itemData.targetBenchmark : Math.round((itemData.targetBenchmark / 300) * 100);
    const unit = viewMode === 'marks' ? ' marks' : '%';

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-slate-800 text-xs min-w-[220px] animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
          <span className="font-extrabold text-indigo-300">{itemData.testNumber}</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Calendar size={10} /> {itemData.date || 'Recent'}
          </span>
        </div>
        <p className="font-bold text-white text-xs mb-2.5 line-clamp-1">{itemData.testTitle}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Class Average:
            </span>
            <span className="font-extrabold text-white">{avgVal}{unit}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Highest Score:
            </span>
            <span className="font-bold text-emerald-400">{highVal}{unit}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              Lowest Score:
            </span>
            <span className="font-medium text-slate-400">{lowVal}{unit}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 pt-1.5 border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Target size={11} /> Target Goal:
            </span>
            <span className="font-bold text-amber-300">{benchmarkVal}{unit}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ClassPerformanceChart: React.FC<ClassPerformanceChartProps> = ({
  data,
  title = 'Class Performance Over Time',
  subtitle = 'Historical average marks & highest achievement across conducted tests',
}) => {
  const [viewMode, setViewMode] = useState<'marks' | 'percentage'>('marks');
  const [showHighest, setShowHighest] = useState(true);

  // Transform data if viewing as percentage
  const chartData = data.map((d) => ({
    ...d,
    chartAverage: viewMode === 'marks' ? d.classAverage : Math.round((d.classAverage / 300) * 100),
    chartHighest: viewMode === 'marks' ? d.highestScore : Math.round((d.highestScore / 300) * 100),
    chartBenchmark: viewMode === 'marks' ? d.targetBenchmark : Math.round((d.targetBenchmark / 300) * 100),
  }));

  const initialScore = data[0]?.classAverage || 142;
  const latestScore = data[data.length - 1]?.classAverage || 184;
  const netGain = latestScore - initialScore;
  const percentageGain = Number(((netGain / initialScore) * 100).toFixed(1));

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Chart View Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setViewMode('marks')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'marks'
                  ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                  : 'hover:text-slate-900'
              }`}
            >
              Marks (/300)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('percentage')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'percentage'
                  ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                  : 'hover:text-slate-900'
              }`}
            >
              Percentage (%)
            </button>
          </div>

          {/* Highest Score Toggle */}
          <button
            type="button"
            onClick={() => setShowHighest(!showHighest)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showHighest
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <Award size={12} />
            <span className="hidden md:inline">Top Score</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="classAvgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="testNumber"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              dy={8}
            />
            <YAxis
              domain={viewMode === 'marks' ? [60, 300] : [20, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              tickFormatter={(val) => (viewMode === 'marks' ? `${val}` : `${val}%`)}
            />
            <Tooltip content={<CustomChartTooltip viewMode={viewMode} />} />
            
            {/* Target Benchmark Line */}
            <ReferenceLine
              y={viewMode === 'marks' ? 180 : 60}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Target Benchmark (180M)',
                position: 'insideTopRight',
                fill: '#d97706',
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            {/* Class Average Area */}
            <Area
              type="monotone"
              dataKey="chartAverage"
              name="Class Average"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#classAvgGradient)"
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
            />

            {/* Highest Score Line */}
            {showHighest && (
              <Line
                type="monotone"
                dataKey="chartHighest"
                name="Cohort Highest"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#10b981' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Trajectory Metrics */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Baseline (Test #1)
          </span>
          <span className="text-sm font-black text-slate-800">{initialScore} marks</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
            Current Avg (Test #7)
          </span>
          <span className="text-sm font-black text-indigo-900">{latestScore} marks</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Net Improvement
          </span>
          <span className="text-sm font-black text-emerald-900">+{netGain}M (+{percentageGain}%)</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-100">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
            Benchmark Status
          </span>
          <span className="text-sm font-black text-amber-900 flex items-center gap-1">
            <CheckCircle2 size={13} className="text-amber-600" /> Target Met (+4M)
          </span>
        </div>
      </div>
    </div>
  );
};
```

---

### Blueprint 3: `src/components/teacher/SubjectMasteryChart.tsx` (F07)

```tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { BookOpen, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface SubjectMasteryChartProps {
  subjectAverages: {
    physics: number;
    chemistry: number;
    maths: number;
    biology?: number;
  };
  onSubjectClick?: (subject: string) => void;
}

export const SubjectMasteryChart: React.FC<SubjectMasteryChartProps> = ({
  subjectAverages,
  onSubjectClick,
}) => {
  const data = [
    {
      subject: 'Physics',
      mastery: subjectAverages.physics || 66.0,
      color: '#4f46e5',
      lightColor: '#eef2ff',
      tag: 'Mechanics & Optics',
      weakArea: 'Rotational Dynamics',
      status: 'Needs Focus',
    },
    {
      subject: 'Chemistry',
      mastery: subjectAverages.chemistry || 74.2,
      color: '#059669',
      lightColor: '#ecfdf5',
      tag: 'Organic & Physical',
      weakArea: 'Le Chatelier Shift',
      status: 'Strong',
    },
    {
      subject: 'Mathematics',
      mastery: subjectAverages.maths || 65.1,
      color: '#d97706',
      lightColor: '#fffbeb',
      tag: 'Calculus & Vectors',
      weakArea: 'Definite Integrals',
      status: 'Needs Focus',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Subject Mastery Comparison</h3>
            <p className="text-xs text-slate-500 font-medium">Class proficiency across PCM subjects vs 75% target</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-extrabold rounded-full border border-indigo-100">
          Target: 75%
        </span>
      </div>

      {/* Recharts Bar Chart */}
      <div className="w-full h-52 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#334155', fontWeight: 700 }}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[180px]">
                      <div className="flex items-center justify-between font-extrabold mb-1">
                        <span>{item.subject}</span>
                        <span style={{ color: item.color }}>{item.mastery}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.tag}</p>
                      <div className="mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-rose-300">
                        ⚠️ Critical: {item.weakArea}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={75}
              stroke="#94a3b8"
              strokeDasharray="3 3"
              label={{ value: 'Target 75%', position: 'insideTopLeft', fill: '#64748b', fontSize: 10 }}
            />
            <Bar dataKey="mastery" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.subject} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-100">
        {data.map((sub) => (
          <div
            key={sub.subject}
            onClick={() => onSubjectClick && onSubjectClick(sub.subject)}
            className="p-3 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer bg-slate-50/50 hover:bg-slate-50 group"
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-800">{sub.subject}</span>
              <span style={{ color: sub.color }} className="font-black">
                {sub.mastery}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${sub.mastery}%`, backgroundColor: sub.color }}
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              Gap: <span className="font-bold text-slate-700">{sub.weakArea}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### Blueprint 4: `src/components/teacher/FrequentlyMissedQuestionsTable.tsx` (F08)

```tsx
import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Send,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { MissedQuestionStat } from '../../types/test';
import { SubjectName } from '../../types/student';

interface FrequentlyMissedQuestionsTableProps {
  questions: MissedQuestionStat[];
  onAssignRemediation: (question: MissedQuestionStat) => void;
}

export const FrequentlyMissedQuestionsTable: React.FC<FrequentlyMissedQuestionsTableProps> = ({
  questions,
  onAssignRemediation,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering
  const filteredQuestions = questions.filter((q) => {
    const matchesSubject = selectedSubject === 'All' || q.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch =
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.rootCauseDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const getSubjectBadge = (subject: SubjectName) => {
    switch (subject) {
      case 'Physics':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Chemistry':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Mathematics':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getSeverityStyle = (rate: number) => {
    if (rate >= 65) return { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-50 border-rose-200' };
    if (rate >= 55) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 border-amber-200' };
    return { bg: 'bg-indigo-500', text: 'text-indigo-700', badge: 'bg-indigo-50 border-indigo-200' };
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                Frequently Missed Questions Diagnostic
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Root-cause error pattern breakdown and faculty remediation dispatch
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subject Filter Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold text-slate-600">
            {['All', 'Physics', 'Chemistry', 'Mathematics'].map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedSubject === sub
                    ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                    : 'hover:text-slate-900'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic or diagnostic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all w-48"
            />
          </div>
        </div>
      </div>

      {/* Interactive Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <th className="py-3.5 px-4">Test & Question</th>
              <th className="py-3.5 px-4">Concept / Topic</th>
              <th className="py-3.5 px-4">Class Miss Rate</th>
              <th className="py-3.5 px-4">Common Error Pattern</th>
              <th className="py-3.5 px-4">Root Cause AI Diagnosis</th>
              <th className="py-3.5 px-4 text-right">Faculty Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No missed questions matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredQuestions.map((q, idx) => {
                const severity = getSeverityStyle(q.missedPercentage);
                return (
                  <tr
                    key={`${q.testTitle}-${q.questionNumber}-${idx}`}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    {/* Test & Question */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${getSubjectBadge(q.subject)}`}>
                          {q.subject} • Q{q.questionNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 truncate max-w-[150px]" title={q.testTitle}>
                        {q.testTitle}
                      </p>
                    </td>

                    {/* Concept / Topic */}
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-900">{q.topic}</p>
                    </td>

                    {/* Class Miss Rate */}
                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-[11px] font-black mb-1">
                          <span className={severity.text}>{q.missedPercentage}%</span>
                          <span className="text-[10px] text-slate-400 font-medium">cohort</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${severity.bg}`}
                            style={{ width: `${q.missedPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Common Error Pattern */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 font-bold flex items-center gap-1">
                          <XCircle size={11} /> Picked {q.commonWrongOption}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                          <CheckCircle2 size={11} /> Correct {q.correctOption}
                        </span>
                      </div>
                    </td>

                    {/* AI Diagnosis */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2" title={q.rootCauseDiagnosis}>
                        {q.rootCauseDiagnosis}
                      </p>
                      {q.recommendedAction && (
                        <p className="text-[10px] text-indigo-600 font-bold mt-1 line-clamp-1">
                          💡 Action: {q.recommendedAction}
                        </p>
                      )}
                    </td>

                    {/* Faculty Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onAssignRemediation(q)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-extrabold transition-all shadow-xs hover:shadow-indigo-200 cursor-pointer"
                      >
                        <Send size={12} />
                        <span>Assign Drill</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

### Blueprint 5: `src/components/teacher/AssignRemediationModal.tsx`

```tsx
import React, { useState } from 'react';
import { Send, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { SubjectName } from '../../types/student';
import { MissedQuestionStat, NewAssignmentInput } from '../../types/test';

interface AssignRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignment: NewAssignmentInput) => void;
  initialQuestion?: MissedQuestionStat | null;
  activeBatch: string;
}

export const AssignRemediationModal: React.FC<AssignRemediationModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  initialQuestion,
  activeBatch,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(
    initialQuestion
      ? `${initialQuestion.topic} Targeted Remediation Drill`
      : 'Rotational Dynamics AI Practice Pack'
  );
  const [subject, setSubject] = useState<SubjectName>(initialQuestion?.subject || 'Physics');
  const [targetTopic, setTargetTopic] = useState(initialQuestion?.topic || 'Rotational Dynamics');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Hard');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [dueDate, setDueDate] = useState<string>('2026-08-20');
  const [xpReward, setXpReward] = useState<number>(150);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign({
      title,
      subject,
      targetTopic,
      difficulty,
      questionCount,
      assignedToBatch: activeBatch,
      dueDate,
      xpReward,
      description: `Targeted MCQ practice drill focusing on ${targetTopic}. Designed to remediate high error rate concept gaps.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Send size={18} />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">Assign Targeted Remediation</h3>
              <p className="text-[11px] text-slate-500 font-medium">Dispatches targeted MCQ practice to {activeBatch}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="Easy">Easy (Foundation)</option>
                <option value="Medium">Medium (JEE Main)</option>
                <option value="Hard">Hard (JEE Advanced)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Target Concept / Gap
            </label>
            <input
              type="text"
              required
              value={targetTopic}
              onChange={(e) => setTargetTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Questions
              </label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Reward XP
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Dispatch Drill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

### Blueprint 6: `src/pages/teacher/TeacherDashboard.tsx` (Complete Orchestration)

```tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Users,
  FileSpreadsheet,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import { ClassKPICards } from '../../components/teacher/ClassKPICards';
import { ClassPerformanceChart } from '../../components/teacher/ClassPerformanceChart';
import { SubjectMasteryChart } from '../../components/teacher/SubjectMasteryChart';
import { FrequentlyMissedQuestionsTable } from '../../components/teacher/FrequentlyMissedQuestionsTable';
import { AssignRemediationModal } from '../../components/teacher/AssignRemediationModal';
import { MissedQuestionStat, NewAssignmentInput } from '../../types/test';

export const TeacherDashboard: React.FC = () => {
  const {
    classAnalytics,
    students,
    selectedBatch,
    assignMCQTest,
  } = useLearningStore();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedQuestionForRemediation, setSelectedQuestionForRemediation] = useState<MissedQuestionStat | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleOpenRemediation = (question: MissedQuestionStat) => {
    setSelectedQuestionForRemediation(question);
    setIsAssignModalOpen(true);
  };

  const handleTopGapRemediate = (concept: string, subject: string) => {
    const found = classAnalytics.frequentlyMissedQuestions.find((q) => q.topic === concept);
    if (found) {
      setSelectedQuestionForRemediation(found);
    } else {
      setSelectedQuestionForRemediation({
        questionNumber: 14,
        testTitle: 'JEE Advanced Grand Mock #4',
        subject: subject as any,
        topic: concept,
        correctOption: 'C',
        missedPercentage: 72.5,
        commonWrongOption: 'B',
        rootCauseDiagnosis: 'Rolling friction torque sign error',
      });
    }
    setIsAssignModalOpen(true);
  };

  const handleDispatchAssignment = (assignment: NewAssignmentInput) => {
    assignMCQTest(assignment);
    setSuccessToast(`Targeted drill "${assignment.title}" assigned to ${selectedBatch}!`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {selectedBatch}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Real-time Faculty Dashboard</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Class Diagnostic Overview</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Cohort aggregate tracking, historical marks distributions, and mistake pattern diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sync Active ({students.length} Students)
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-bold animate-in fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {/* F05: Class KPI Cards */}
      <ClassKPICards
        analytics={classAnalytics}
        students={students}
        onRemediateTopGap={handleTopGapRemediate}
      />

      {/* Analytics Visuals: Performance Trend & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* F06: Class Performance Over Time Graph */}
        <div className="lg:col-span-7">
          <ClassPerformanceChart data={classAnalytics.performanceTrends} />
        </div>

        {/* F07: Subject Mastery Comparison Graph */}
        <div className="lg:col-span-5">
          <SubjectMasteryChart subjectAverages={classAnalytics.subjectAverages} />
        </div>
      </div>

      {/* F08: Frequently Missed Questions Table */}
      <FrequentlyMissedQuestionsTable
        questions={classAnalytics.frequentlyMissedQuestions}
        onAssignRemediation={handleOpenRemediation}
      />

      {/* Faculty Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/teacher/students"
          className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md flex items-center justify-between group hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300">
              <Users size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">Student Directory & Mistake Logs</h4>
              <p className="text-xs text-indigo-200 mt-0.5">Explore individual score trajectories and logged errors</p>
            </div>
          </div>
          <ArrowUpRight size={20} className="text-indigo-300 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/teacher/tests"
          className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-md flex items-center justify-between group hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">Test Management & Answer Keys</h4>
              <p className="text-xs text-emerald-200 mt-0.5">Upload new test papers or compose targeted MCQ packs</p>
            </div>
          </div>
          <ArrowUpRight size={20} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Assign Remediation Modal */}
      <AssignRemediationModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedQuestionForRemediation(null);
        }}
        onAssign={handleDispatchAssignment}
        initialQuestion={selectedQuestionForRemediation}
        activeBatch={selectedBatch}
      />
    </div>
  );
};
```
