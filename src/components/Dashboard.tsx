import { useState } from 'react';
import { Topbar } from './Topbar';
import { SubjectCard } from './SubjectCard';
import { Leaderboard } from './Leaderboard';
import { RemediationTracker } from './RemediationTracker';
import { StudentProfile } from './StudentProfile';

export const Dashboard = ({ onDemoLogout }: { onDemoLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard' | 'tracker' | 'profile'>('dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onDemoLogout={onDemoLogout} />
      
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[73px] z-20">
        <div className="max-w-5xl mx-auto px-8 flex items-center gap-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'leaderboard' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Leaderboard
          </button>
          <button 
            onClick={() => setActiveTab('tracker')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tracker' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Weak Topics Tracker
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Student Profile
          </button>
        </div>
      </div>

      <main className="flex-1 p-8 overflow-y-auto w-full">
        {activeTab === 'dashboard' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                You're doing well in Science, but Fractions need work.
              </h1>
              <p className="text-gray-500 text-lg">Upload your latest test papers to get instant study recommendations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <SubjectCard 
                subject="Biology" 
                masteryStatus="Needs Attention" 
                icon="biology" 
              />
              <SubjectCard 
                subject="Science" 
                masteryStatus="On Track" 
                icon="science" 
              />
              <SubjectCard 
                subject="English" 
                masteryStatus="On Track" 
                icon="english" 
              />
              <SubjectCard 
                subject="History" 
                masteryStatus="Developing" 
                icon="history" 
              />
              <SubjectCard 
                subject="Geography" 
                masteryStatus="Developing" 
                icon="geography" 
              />
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'tracker' && <RemediationTracker />}
        {activeTab === 'profile' && <StudentProfile />}
      </main>
    </div>
  );
};
