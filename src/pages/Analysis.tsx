import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Target, AlertTriangle, CheckCircle2, ChevronRight, BookOpen, BrainCircuit, PlayCircle, Map } from 'lucide-react';

export const Analysis = () => {
  const { testId } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown'>('overview');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* 1. Headline Result */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm border border-white/10">
              Mock Test 7 - Full Syllabus
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Great effort, Rohan!</h2>
            <p className="text-indigo-100 text-lg max-w-xl">
              You scored <strong className="text-white">120/160 (75%)</strong>. That's an 8% improvement from your last test! You're showing strong grasp in Algebra, but Physics Mechanics needs a little love.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[120px]">
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Score</p>
              <h3 className="text-4xl font-black">75<span className="text-xl opacity-70">%</span></h3>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[120px]">
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Accuracy</p>
              <h3 className="text-4xl font-black">82<span className="text-xl opacity-70">%</span></h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          AI Overview & Roadmap
        </button>
        <button 
          onClick={() => setActiveTab('breakdown')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${activeTab === 'breakdown' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Question Breakdown
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Weak Areas & What to study next */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Priority Focus Areas</h3>
                  <p className="text-gray-500 text-sm">We analyzed your incorrect answers and found these concept gaps.</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    topic: 'Rotational Kinematics',
                    subject: 'Physics',
                    mistakes: 3,
                    insight: "You consistently applied linear equations instead of angular ones. Remember to map 'v' to 'ω' and 'a' to 'α'.",
                    id: 'topic-1'
                  },
                  {
                    topic: 'Stoichiometry Limiting Reagents',
                    subject: 'Chemistry',
                    mistakes: 2,
                    insight: "Calculation errors spotted. You correctly identified the reaction, but didn't normalize by molar mass first.",
                    id: 'topic-2'
                  }
                ].map((gap, i) => (
                  <div key={i} className="border border-red-100 bg-red-50/30 rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
                          <Target size={14} /> {gap.subject} • {gap.mistakes} Mistakes
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{gap.topic}</h4>
                        <p className="text-gray-600 text-sm mt-1">{gap.insight}</p>
                      </div>
                    </div>
                    
                    {/* What to study next inside the gap card */}
                    <div className="mt-6 pt-6 border-t border-red-100/50">
                      <h5 className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">Recommended Fixes</h5>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                          <PlayCircle size={16} className="text-indigo-500" /> Watch 5m Concept Recap
                        </button>
                        <Link to={`/practice/${gap.id}`} className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                          <BrainCircuit size={16} /> Practice 5 Questions
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recovery Roadmap */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900 rounded-3xl p-8 shadow-xl text-white sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
                  <Map size={20} />
                </div>
                <h3 className="font-bold text-lg">Recovery Roadmap</h3>
              </div>

              <div className="relative border-l-2 border-gray-700 ml-3 space-y-8 pb-4">
                
                <div className="relative pl-6 opacity-50">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-gray-900 flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-300">Test Completed</h4>
                  <p className="text-xs text-gray-500 mt-1">Evaluated by AI</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-gray-900"></div>
                  <h4 className="font-bold text-sm text-white">Review Weak Concepts</h4>
                  <p className="text-xs text-gray-400 mt-1">2 topics require your attention.</p>
                  <button className="mt-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/10">
                    Start Review Session
                  </button>
                </div>

                <div className="relative pl-6 opacity-40">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-700 ring-4 ring-gray-900"></div>
                  <h4 className="font-bold text-sm text-gray-300">Practice Verification</h4>
                  <p className="text-xs text-gray-500 mt-1">Pass the mini-check to clear gaps.</p>
                </div>

                <div className="relative pl-6 opacity-40">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-700 ring-4 ring-gray-900"></div>
                  <h4 className="font-bold text-sm text-gray-300">Ready for Next Test</h4>
                  <p className="text-xs text-gray-500 mt-1">Target 85% next week.</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'breakdown' && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Question Breakdown</h3>
          <p className="text-gray-500 text-sm mb-6">A soft-toned review of exactly what happened during the test.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="pb-3 font-semibold uppercase tracking-wider">Q No.</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Subject</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">AI Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 font-bold text-gray-900">1</td>
                  <td className="py-4 text-gray-600">Physics</td>
                  <td className="py-4"><span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md font-bold text-xs"><CheckCircle2 size={12}/> Correct</span></td>
                  <td className="py-4 text-gray-500">Perfect application of Newton's second law.</td>
                </tr>
                <tr className="hover:bg-red-50/30">
                  <td className="py-4 font-bold text-gray-900">2</td>
                  <td className="py-4 text-gray-600">Physics</td>
                  <td className="py-4"><span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md font-bold text-xs">Incorrect</span></td>
                  <td className="py-4 text-gray-600">Marked (B), correct was (C). Looks like a sign error in the final step.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 font-bold text-gray-900">3</td>
                  <td className="py-4 text-gray-600">Physics</td>
                  <td className="py-4"><span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-bold text-xs">Skipped</span></td>
                  <td className="py-4 text-gray-500">Smart skip. It's a lengthy question, better to save time.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
