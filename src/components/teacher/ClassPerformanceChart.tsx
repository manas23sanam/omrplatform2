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
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import type { ClassPerformanceTrendPoint } from '../../types/test';

interface ClassPerformanceChartProps {
  data: ClassPerformanceTrendPoint[];
  title?: string;
  subtitle?: string;
}

const CustomChartTooltip: React.FC<any> = ({ active, payload, viewMode }) => {
  if (active && payload && payload.length) {
    const itemData = payload[0].payload;
    const avgVal = viewMode === 'marks' ? itemData.classAverage : Math.round((itemData.classAverage / 300) * 100);
    const highVal = viewMode === 'marks' ? itemData.highestScore : Math.round((itemData.highestScore / 300) * 100);
    const lowVal = viewMode === 'marks' ? itemData.lowestScore : Math.round((itemData.lowestScore / 300) * 100);
    const benchmarkVal = viewMode === 'marks' ? itemData.targetBenchmark : Math.round((itemData.targetBenchmark / 300) * 100);
    const unit = viewMode === 'marks' ? ' marks' : '%';

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-slate-800 text-xs min-w-[220px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
          <span className="font-extrabold text-blue-300">{itemData.testNumber}</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Calendar size={10} /> {itemData.date || 'Recent'}
          </span>
        </div>
        <p className="font-bold text-white text-xs mb-2.5 line-clamp-1">{itemData.testTitle}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Class Average:</span>
            <span className="font-extrabold text-white">{avgVal}{unit}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span>Highest Score:</span>
            <span className="font-bold text-slate-400">{highVal}{unit}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ClassPerformanceChart: React.FC<ClassPerformanceChartProps> = ({ data, title = 'Class Performance Over Time' }) => {
  const [viewMode, setViewMode] = useState<'marks' | 'percentage'>('marks');
  const [showHighest, setShowHighest] = useState(true);

  const chartData = data.map((d) => ({
    ...d,
    chartAverage: viewMode === 'marks' ? d.classAverage : Math.round((d.classAverage / 300) * 100),
    chartHighest: viewMode === 'marks' ? d.highestScore : Math.round((d.highestScore / 300) * 100),
    chartBenchmark: viewMode === 'marks' ? d.targetBenchmark : Math.round((d.targetBenchmark / 300) * 100),
  }));

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 tracking-tight">{title}</h3>
        </div>
      </div>

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
            <XAxis dataKey="testNumber" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={8} />
            <YAxis domain={viewMode === 'marks' ? [60, 300] : [20, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `${val}`} />
            <Tooltip content={<CustomChartTooltip viewMode={viewMode} />} />
            
            <ReferenceLine y={viewMode === 'marks' ? 180 : 60} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} />

            <Area type="monotone" dataKey="chartAverage" name="Class Average" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#classAvgGradient)" activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }} />

            {showHighest && (
              <Line type="monotone" dataKey="chartHighest" name="Cohort Highest" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#10b981' }} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
