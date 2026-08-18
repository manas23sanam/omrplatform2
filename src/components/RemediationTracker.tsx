import { useState } from 'react';
import { Target, CheckCircle2, ChevronRight, Calculator, FlaskConical, CircleDashed } from 'lucide-react';
import { StudyMaterialViewer } from './StudyMaterialViewer';
import { VerificationTest } from './VerificationTest';

interface Topic {
  id: string;
  subject: string;
  name: string;
  status: 'not_started' | 'studying' | 'ready' | 'mastered';
  icon: 'biology' | 'science';
}

export const RemediationTracker = () => {
  const [topics, setTopics] = useState<Topic[]>([
    { id: '1', subject: 'Biology', name: 'Percentages', status: 'not_started', icon: 'biology' },
    { id: '2', subject: 'Biology', name: 'Fractions', status: 'studying', icon: 'biology' },
    { id: '3', subject: 'Science', name: 'Cellular Respiration', status: 'ready', icon: 'science' },
    { id: '4', subject: 'Science', name: 'Photosynthesis', status: 'not_started', icon: 'science' },
  ]);

  const [activeStudyTopic, setActiveStudyTopic] = useState<Topic | null>(null);
  const [activeTestTopic, setActiveTestTopic] = useState<Topic | null>(null);

  const updateStatus = (id: string, newStatus: Topic['status']) => {
    setTopics(topics.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const toggleStatus = (id: string) => {
    setTopics(topics.map(t => {
      if (t.id === id) {
        if (t.status === 'not_started') return { ...t, status: 'studying' };
        if (t.status === 'studying') return { ...t, status: 'ready' };
        if (t.status === 'ready') return { ...t, status: 'not_started' };
      }
      return t;
    }));
  };

  const getStatusDisplay = (status: Topic['status']) => {
    switch (status) {
      case 'not_started': return { label: 'Not Started', color: 'bg-gray-100 text-gray-500', icon: <CircleDashed size={16} /> };
      case 'studying': return { label: 'Studying', color: 'bg-blue-100 text-blue-700', icon: <Target size={16} /> };
      case 'ready': return { label: 'Ready for Test', color: 'bg-slate-100 text-slate-700', icon: <CheckCircle2 size={16} /> };
      case 'mastered': return { label: 'Mastered', color: 'bg-slate-100 text-slate-700', icon: <CheckCircle2 size={16} /> };
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Weak Topics Tracker</h2>
        <p className="text-gray-500 text-lg">Your personalized checklist to close learning gaps across all subjects.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-8 py-4 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Topic</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-4 text-right">Action</div>
        </div>

        <div className="divide-y divide-gray-50">
          {topics.map(topic => {
            const statusStyle = getStatusDisplay(topic.status);
            
            return (
              <div key={topic.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 px-6 md:px-8 py-6 items-start md:items-center hover:bg-gray-50/50 transition-colors">
                
                <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${topic.icon === 'biology' ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-500'}`}>
                    {topic.icon === 'biology' ? <Calculator size={20} /> : <FlaskConical size={20} />}
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${topic.status === 'mastered' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{topic.name}</h4>
                    <p className="text-sm text-gray-500">{topic.subject}</p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex items-center mt-2 md:mt-0">
                  <button 
                    onClick={() => toggleStatus(topic.id)}
                    disabled={topic.status === 'mastered'}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors hover:opacity-80 disabled:opacity-100 disabled:cursor-default w-full md:w-auto justify-center md:justify-start ${statusStyle.color}`}
                  >
                    {statusStyle.icon}
                    {statusStyle.label}
                  </button>
                </div>

                <div className="col-span-1 md:col-span-4 flex justify-end mt-2 md:mt-0 w-full">
                  {topic.status === 'mastered' ? (
                    <span className="text-slate-500 font-bold flex items-center justify-center md:justify-end gap-2 px-4 py-2 w-full md:w-auto">
                      Topic Closed <CheckCircle2 size={18} />
                    </span>
                  ) : topic.status === 'not_started' || topic.status === 'studying' ? (
                    <button 
                      onClick={() => setActiveStudyTopic(topic)}
                      className="flex items-center justify-center md:justify-end gap-2 text-primary-600 font-semibold hover:bg-primary-50 px-4 py-2 rounded-xl transition-colors w-full md:w-auto"
                    >
                      Study Materials <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setActiveTestTopic(topic)}
                      className="flex items-center justify-center md:justify-end gap-2 bg-slate-600 text-white font-semibold hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors shadow-sm animate-pulse w-full md:w-auto text-sm md:text-base"
                    >
                      Start Verification Test
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Overlays */}
      {activeStudyTopic && (
        <StudyMaterialViewer 
          topicName={activeStudyTopic.name} 
          onClose={() => setActiveStudyTopic(null)} 
          onComplete={() => {
            updateStatus(activeStudyTopic.id, 'ready');
            setActiveStudyTopic(null);
          }}
        />
      )}

      {activeTestTopic && (
        <VerificationTest 
          topicName={activeTestTopic.name} 
          onClose={() => setActiveTestTopic(null)}
          onPass={() => {
            updateStatus(activeTestTopic.id, 'mastered');
            setActiveTestTopic(null);
          }}
          onFail={() => {
            updateStatus(activeTestTopic.id, 'studying');
            setActiveTestTopic(null);
            setActiveStudyTopic(activeTestTopic);
          }}
        />
      )}
    </div>
  );
};
