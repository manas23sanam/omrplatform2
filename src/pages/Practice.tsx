import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { StudyMaterialViewer } from '../components/StudyMaterialViewer';
import { VerificationTest } from '../components/VerificationTest';

export const Practice = () => {
  const { topicId } = useParams();
  const [phase, setPhase] = useState<'study' | 'test' | 'complete'>('study');

  // In a real app, fetch topic details based on topicId
  const topicName = topicId === 'topic-1' ? 'Rotational Kinematics' : 'Limiting Reagents';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Practice Session</h2>
          <p className="text-gray-500 text-sm mt-1">Mastering: {topicName}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[600px]">
        {/* We reuse the modal components but force them to act inline by removing their fixed backdrop in CSS, or just rendering them inside this container if we modify them.
            Since they currently have `fixed inset-0`, let's just render them and they will take over the screen, but ideally we'd pass a prop `inline` to them.
            For now, we will render a custom inline version for the practice page to ensure perfect layout. */}
            
        {phase === 'study' && (
           <div className="p-8">
             <div className="flex items-center justify-between mb-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                  <BrainCircuit size={14} /> Step 1: Review Concepts
               </div>
             </div>
             
             <div className="space-y-6">
                <h3 className="text-3xl font-extrabold text-gray-900">Understanding Angular Velocity</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Just like linear velocity (v) is the rate of change of displacement, angular velocity (ω) is the rate of change of angular displacement. 
                  <br/><br/>
                  The key formula connecting them is: <strong>v = r × ω</strong>
                </p>
                
                <div className="bg-amber-50 p-6 md:p-8 rounded-2xl border border-amber-100 mt-8">
                  <div className="flex flex-col items-center text-center gap-4">
                    <p className="font-bold text-amber-900">If a wheel of radius 2m spins at 4 rad/s, what is the linear speed of a point on its edge?</p>
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xl md:text-2xl font-bold text-gray-800">
                      <span className="bg-white px-4 py-2 rounded-xl shadow-sm">r = 2</span>
                      <span className="text-amber-400">×</span>
                      <span className="bg-white px-4 py-2 rounded-xl shadow-sm">ω = 4</span>
                      <span className="text-amber-400">=</span>
                      <span className="bg-amber-500 text-white px-4 md:px-6 py-2 rounded-xl shadow-md">v = 8 m/s</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button 
                    onClick={() => setPhase('test')}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    I understand, let's practice
                  </button>
                </div>
             </div>
           </div>
        )}

        {phase === 'test' && (
          <div className="p-0">
             {/* We embed VerificationTest logic here inline to avoid fixed modal layout issues */}
             <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Verification Test</h2>
                  <p className="text-gray-500 text-sm font-medium">{topicName} • Question 1 of 5</p>
                </div>
              </div>
              <div className="p-8 bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900 leading-relaxed">
                  A car accelerates uniformly from rest. If its wheels have a radius of 0.5m and reach an angular velocity of 10 rad/s in 2 seconds, what is the car's final linear speed?
                </h3>
                <div className="mt-8 space-y-3">
                  {[
                    { id: 'A', text: '5 m/s' },
                    { id: 'B', text: '10 m/s' },
                    { id: 'C', text: '2.5 m/s' },
                    { id: 'D', text: '20 m/s' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setPhase('complete')} // Hack for demo: any click finishes test
                      className="w-full text-left p-4 rounded-xl font-medium border-2 transition-all hover:border-indigo-300 hover:bg-indigo-50 border-gray-200 bg-white text-gray-700"
                    >
                      <span className="inline-block w-8 font-bold text-gray-400">{option.id}</span>
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
          </div>
        )}

        {phase === 'complete' && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[500px] text-center animate-in fade-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-2">Concept Mastered!</h2>
             <p className="text-gray-500 text-lg mb-8 max-w-md">
               You successfully proved your understanding of {topicName}. This gap is now closed.
             </p>
             <Link 
                to="/dashboard"
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Return to Dashboard
             </Link>
          </div>
        )}

      </div>
    </div>
  );
};
