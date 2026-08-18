import React from 'react';
import { Target, Award, BrainCircuit, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MasteryMap } from '../components/MasteryMap';

export const History = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Test History & Mastery</h2>
        <p className="text-gray-500 text-lg mt-1">
          Track your long-term progress across all subjects and topics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Long Term Mastery (Radar/Heatmap concept via existing component) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Topic Mastery Heatmap</h3>
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 p-4">
               {/* Reusing the MasteryMap component built previously */}
               <MasteryMap />
            </div>
          </div>
        </div>

        {/* Right Column: All Past Tests */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">All Past Tests</h3>
            
            <div className="space-y-4">
              {[
                { id: 't7', name: 'Mock Test 7 - Full Syllabus', date: 'Yesterday', score: '75%' },
                { id: 't6', name: 'Weekly Physics', date: '5 days ago', score: '68%' },
                { id: 't5', name: 'Chemistry - Organic', date: '2 weeks ago', score: '59%' },
                { id: 't4', name: 'Math - Calculus', date: '3 weeks ago', score: '82%' },
                { id: 't3', name: 'Mock Test 6', date: '1 month ago', score: '61%' },
                { id: 't2', name: 'Weekly Biology', date: '1 month ago', score: '88%' },
                { id: 't1', name: 'Mock Test 5', date: '2 months ago', score: '55%' },
              ].map((test) => (
                <div key={test.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors cursor-pointer flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-900 transition-colors leading-tight pr-4">{test.name}</h4>
                    <span className="font-black text-gray-900 text-lg">{test.score}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{test.date}</p>
                    <Link to={`/analysis/${test.id}`} className="text-xs font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Report <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
