import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react';

const mockNodes = [
  { id: 1, label: 'Numbers', status: 'mastered', parents: [] },
  { id: 2, label: 'Integers', status: 'mastered', parents: [1] },
  { id: 3, label: 'Fractions', status: 'mastered', parents: [2] },
  { id: 4, label: 'Decimals', status: 'developing', parents: [3] },
  { id: 5, label: 'Percentages', status: 'weak', parents: [4] },
  { id: 6, label: 'Ratio', status: 'weak', parents: [3] },
  { id: 7, label: 'Algebra', status: 'weak', parents: [3] },
];

export const MasteryMap = () => {
  const [activeNode, setActiveNode] = useState(mockNodes[4]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'mastered': return 'bg-success-500 text-white border-success-500';
      case 'developing': return 'bg-warning-500 text-white border-warning-500';
      case 'weak': return 'bg-danger-500 text-white border-danger-500';
      default: return 'bg-gray-200 text-gray-600 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'mastered': return <CheckCircle2 size={16} />;
      case 'developing': return <TrendingUp size={16} />;
      case 'weak': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Concept Mastery Map</h2>
          <p className="text-sm text-gray-500">Mathematics - Grade 8</p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success-500"></span> Mastered</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning-500"></span> Developing</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger-500"></span> Weak</div>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Graph visualization placeholder */}
        <div className="flex-1 border-r border-gray-100 pr-6 relative flex flex-col items-center justify-center py-8">
          <div className="flex flex-col gap-6 relative items-center w-full">
            <div className="absolute top-8 bottom-8 w-px bg-gray-200 -z-10 left-1/2 -translate-x-1/2"></div>
            
            {mockNodes.map((node) => (
              <button 
                key={node.id}
                onClick={() => setActiveNode(node)}
                className={`relative px-4 py-2 rounded-full font-medium text-sm border-2 transition-all flex items-center gap-2 ${
                  activeNode.id === node.id ? 'ring-4 ring-primary-100 scale-110 z-10' : 'hover:scale-105 z-10'
                } ${getStatusColor(node.status)}`}
              >
                {getStatusIcon(node.status)}
                {node.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-1/3 min-w-[250px] pl-2 flex flex-col">
          <h3 className="font-bold text-gray-800 text-lg mb-1">{activeNode.label}</h3>
          <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-700 w-max mb-6 capitalize">
            Status: {activeNode.status}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Diagnosis</h4>
              <p className="text-sm text-gray-600 bg-red-50 text-red-800 p-3 rounded-lg border border-red-100">
                Struggles with relating fractions to percentages. Needs visual models before algorithmic practice.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Suggested Next Step</h4>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border border-gray-200 transition-colors group flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">Review Fractions Prerequisite</div>
                  <div className="text-xs text-gray-500">8 min interactive video</div>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
