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
import { BookOpen } from 'lucide-react';

interface SubjectMasteryChartProps {
  subjectAverages: {
    physics: number;
    chemistry: number;
    biology: number;
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
      color: '#2563eb',
      lightColor: '#eff6ff',
      tag: 'Mechanics & Optics',
      weakArea: 'Rotational Dynamics',
      status: 'Needs Focus',
    },
    {
      subject: 'Chemistry',
      mastery: subjectAverages.chemistry || 74.2,
      color: '#2563eb',
      lightColor: '#eff6ff',
      tag: 'Organic & Physical',
      weakArea: 'Le Chatelier Shift',
      status: 'Strong',
    },
    {
      subject: 'Biology',
      mastery: subjectAverages.biology || 65.1,
      color: '#2563eb',
      lightColor: '#eff6ff',
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
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Subject Mastery Comparison</h3>
            <p className="text-xs text-slate-500 font-medium">Class proficiency across PCM subjects vs 75% target</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-extrabold rounded-full border border-blue-100">
          Target: 75%
        </span>
      </div>

      {/* Recharts Bar Chart */}
      <div className="w-full h-72 min-h-[280px]">
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
                      <div className="mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-slate-300">
                        Critical: {item.weakArea}
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
    </div>
  );
};
