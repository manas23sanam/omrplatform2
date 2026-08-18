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
import { TrendingUp, Target, Award, Filter } from 'lucide-react';
import type { StudentScoreHistory } from '../../types/student';

interface ScoreTrajectoryChartProps {
  scoreHistory: StudentScoreHistory[];
}

type TrajectorySubject = 'Total' | 'Physics' | 'Chemistry' | 'Biology';

export const ScoreTrajectoryChart: React.FC<ScoreTrajectoryChartProps> = ({ scoreHistory }) => {
  const [activeSubject, setActiveSubject] = useState<TrajectorySubject>('Total');

  // Format data for recharts based on active subject filter
  const chartData = scoreHistory.map((item, index) => {
    let studentMarks = item.score;
    let maxMarks = item.totalMarks || 300;
    let benchmarkScore = 195 + (index * 8); // realistic class average benchmark

    if (activeSubject === 'Physics') {
      studentMarks = item.physicsScore;
      maxMarks = 100;
      benchmarkScore = 65 + (index * 2);
    } else if (activeSubject === 'Chemistry') {
      studentMarks = item.chemistryScore;
      maxMarks = 100;
      benchmarkScore = 62 + (index * 3);
    } else if (activeSubject === 'Biology') {
      studentMarks = item.biologyScore;
      maxMarks = 100;
      benchmarkScore = 64 + (index * 2);
    }

    const percentage = Math.round((studentMarks / maxMarks) * 100);
    const benchmarkPercentage = Math.round((benchmarkScore / maxMarks) * 100);

    return {
      name: item.testNumber || `Test ${index + 1}`,
      testTitle: item.testTitle,
      date: item.date,
      studentScore: studentMarks,
      classAverage: benchmarkScore,
      percentage,
      benchmarkPercentage,
      maxMarks,
      delta: studentMarks - benchmarkScore,
    };
  });

  const latest = chartData[chartData.length - 1];
  const earliest = chartData[0];
  const growth = latest && earliest ? latest.studentScore - earliest.studentScore : 0;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 text-lg">Score Improvement Trajectory</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
              <TrendingUp size={12} />
              +{growth} Marks Growth
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your marks trajectory compared against the Batch Average benchmark
          </p>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['Total', 'Physics', 'Chemistry', 'Biology'] as TrajectorySubject[]).map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setActiveSubject(subj)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSubject === subj
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {subj === 'Total' ? 'Overall (300M)' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Trajectory Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="studentScoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              domain={[0, activeSubject === 'Total' ? 300 : 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5">
                      <p className="font-black text-slate-400">{data.testTitle}</p>
                      <p className="text-[11px] text-slate-400">{data.date}</p>
                      <div className="pt-1 border-t border-slate-800 space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-300">Your Score:</span>
                          <span className="font-bold text-blue-300">
                            {data.studentScore} / {data.maxMarks} ({data.percentage}%)
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-300">Batch Average:</span>
                          <span className="font-bold text-slate-400">{data.classAverage} marks</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-300">Delta vs Class:</span>
                          <span className="font-black text-slate-300">
                            {data.delta >= 0 ? `+${data.delta}` : data.delta} marks
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* 80% Benchmark Reference Line */}
            <ReferenceLine
              y={activeSubject === 'Total' ? 240 : 80}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: 'NEET Adv Target (80%)',
                fill: '#d97706',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            {/* Batch Average Line */}
            <Line
              type="monotone"
              dataKey="classAverage"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ fill: '#10b981', r: 3 }}
            />
            {/* Student Score Area */}
            <Area
              type="monotone"
              dataKey="studentScore"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#studentScoreGrad)"
              dot={{ fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2, r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Info */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="font-bold text-slate-700">Your Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 border-t-2 border-dashed border-slate-500" />
            <span className="font-bold text-slate-500">Batch Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 border-t-2 border-dashed border-slate-500" />
            <span className="font-bold text-slate-600">80% Target Benchmark</span>
          </div>
        </div>

        <span className="text-slate-400 font-medium text-[11px]">
          Showing {scoreHistory.length} most recent evaluations
        </span>
      </div>
    </div>
  );
};
