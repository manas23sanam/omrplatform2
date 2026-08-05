import React from 'react';
import { Target, TrendingUp, Zap } from 'lucide-react';

export const Benchmarking = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-6">AI Insights & Benchmarking</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-transparent border border-blue-100">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0 mt-1">
            <Target size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Geometry Mastery</h4>
            <p className="text-sm text-gray-600 mt-1">
              You understand Geometry better than <strong>76%</strong> of the class. Keep up the great work!
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-transparent border border-green-100">
          <div className="p-2 rounded-lg bg-green-100 text-green-600 shrink-0 mt-1">
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Learning Consistency</h4>
            <p className="text-sm text-gray-600 mt-1">
              Students with similar learning profiles improved Algebra by practicing <strong>12 minutes/day</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-transparent border border-purple-100">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600 shrink-0 mt-1">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Comprehension Speed</h4>
            <p className="text-sm text-gray-600 mt-1">
              Your reading comprehension is improving <strong>1.5x faster</strong> than the class average.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
