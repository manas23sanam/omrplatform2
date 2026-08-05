import React from 'react';
import { Award, Zap, BookOpen, BrainCircuit, Target, CheckCircle2, TrendingUp, Flame, CalendarDays, Calculator } from 'lucide-react';

export const StudentProfile = () => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Hero Banner */}
      <div className="relative mb-16">
        <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl translate-y-1/3"></div>
        </div>
        
        {/* Profile Info Overlay */}
        <div className="absolute -bottom-12 left-8 md:left-12 flex items-end gap-6 w-full">
          <div className="relative">
            <img 
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
              alt="User profile" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-8 border-gray-50 shadow-xl bg-white"
            />
            <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
          </div>
          
          <div className="pb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Aditya Sharma</h2>
            <p className="text-gray-500 font-medium text-lg mt-1 flex items-center gap-2">
              <BookOpen size={16} /> Grade 8 • GD Goenka Public School
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Subjects */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Core Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame size={48} className="text-orange-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Flame size={20} />
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Streak</p>
              <h3 className="text-3xl font-black text-gray-900">15 <span className="text-lg text-gray-400 font-semibold">Days</span></h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={48} className="text-blue-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total XP</p>
              <h3 className="text-3xl font-black text-gray-900">1,240</h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit size={48} className="text-purple-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <BrainCircuit size={20} />
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Mastered</p>
              <h3 className="text-3xl font-black text-gray-900">12 <span className="text-lg text-gray-400 font-semibold">Topics</span></h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={48} className="text-green-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <Target size={20} />
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Accuracy</p>
              <h3 className="text-3xl font-black text-gray-900">84<span className="text-lg text-gray-400 font-semibold">%</span></h3>
            </div>
          </div>

          {/* Subject Mastery Progress */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">Subject Mastery</h3>
              <button className="text-primary-600 font-semibold text-sm hover:text-primary-700">View Detailed Analytics</button>
            </div>
            
            <div className="space-y-6">
              {[
                { name: 'Mathematics', progress: 78, color: 'bg-blue-500', bg: 'bg-blue-100' },
                { name: 'Science', progress: 92, color: 'bg-green-500', bg: 'bg-green-100' },
                { name: 'English', progress: 65, color: 'bg-purple-500', bg: 'bg-purple-100' },
                { name: 'History', progress: 45, color: 'bg-amber-500', bg: 'bg-amber-100' },
              ].map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-gray-700">{subject.name}</span>
                    <span className="font-bold text-gray-900">{subject.progress}%</span>
                  </div>
                  <div className={`h-3 w-full rounded-full ${subject.bg} overflow-hidden`}>
                    <div 
                      className={`h-full ${subject.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Badges & Activity */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Recent Badges */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="text-amber-500" /> Recent Badges
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-inner">
                  <Flame size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">7-Day Streak</h4>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">Unlocked 2 days ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-inner">
                  <Calculator size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Math Whiz</h4>
                  <p className="text-xs text-blue-700 font-medium mt-0.5">Mastered 5 Math Topics</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-60 grayscale cursor-not-allowed">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Bookworm</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Read 10 Study Guides</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-primary-500" /> Recent Activity
            </h3>
            
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Today</p>
                <h4 className="font-bold text-gray-900 text-sm">Mastered "Percentages"</h4>
                <p className="text-sm text-gray-500 mt-1">Passed verification test with 90% accuracy.</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Yesterday</p>
                <h4 className="font-bold text-gray-900 text-sm">Uploaded Math Weekly Test</h4>
                <p className="text-sm text-gray-500 mt-1">AI identified 2 weak topics.</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-white"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">3 Days Ago</p>
                <h4 className="font-bold text-gray-900 text-sm">Studied "Cellular Respiration"</h4>
                <p className="text-sm text-gray-500 mt-1">Spent 45 mins reviewing interactive materials.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
