import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { week: 'W1', mastery: 42 },
  { week: 'W2', mastery: 48 },
  { week: 'W3', mastery: 58 },
  { week: 'W4', mastery: 65 },
  { week: 'W5', mastery: 81 },
  { week: 'W6', mastery: 85 },
  { week: 'W7', mastery: 90 },
  { week: 'W8', mastery: 94 },
];

export const ProgressChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Concept Mastery Progress</h2>
        <p className="text-sm text-gray-500">Overall class progression across 8 weeks</p>
      </div>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="week" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(val) => `${val}%`}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`${value}%`, 'Mastery']}
            />
            <Area 
              type="monotone" 
              dataKey="mastery" 
              stroke="#f43f5e" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMastery)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
