import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Award, Clock, ArrowRight, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEMO_STUDENT } from '../config/branding';

const mockProgressData = [
  { name: 'Test 1', score: 45 },
  { name: 'Test 2', score: 52 },
  { name: 'Test 3', score: 48 },
  { name: 'Test 4', score: 61 },
  { name: 'Test 5', score: 59 },
  { name: 'Test 6', score: 68 },
  { name: 'Test 7', score: 75 },
];

export const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back, {DEMO_STUDENT.name}
        </h2>
        <p className="text-gray-500 text-lg mt-1">
          Here's your learning progress for {DEMO_STUDENT.batch}. Let's keep improving!
        </p>
      </div>

      {/* Quick Action / Highlight */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 bg-indigo-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-400/50">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Action Required
          </div>
          <h3 className="text-2xl font-bold mb-2">Weekly Physics OMR Pending</h3>
          <p className="text-indigo-100 max-w-lg">
            Your coaching just concluded the weekly test. Upload your OMR sheet now to get instant evaluation and personalized weak-topic analysis.
          </p>
        </div>
        <Link 
          to="/upload"
          className="relative z-10 shrink-0 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <UploadCloud size={20} /> Upload OMR Now
        </Link>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Latest Score', value: '75%', icon: <Target size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Overall Accuracy', value: '64%', icon: <TrendingUp size={24} className="text-green-500" />, bg: 'bg-green-50' },
          { label: 'Current Rank', value: '12th', icon: <Award size={24} className="text-amber-500" />, bg: 'bg-amber-50' },
          { label: 'Study Streak', value: '4 Days', icon: <Clock size={24} className="text-purple-500" />, bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center md:items-start text-center md:text-left transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-gray-900">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Graph */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Score Improvement</h3>
              <p className="text-sm text-gray-500">Your performance across all mock tests</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>All Time</option>
            </select>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tests List */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Past Tests</h3>
            <Link to="/history" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { id: 't7', name: 'Mock Test 7 - Full Syllabus', date: 'Yesterday', score: '75%', status: 'evaluated' },
              { id: 't6', name: 'Weekly Physics - Mechanics', date: '5 days ago', score: '68%', status: 'evaluated' },
              { id: 't5', name: 'Chemistry - Organic', date: '2 weeks ago', score: '59%', status: 'evaluated' },
            ].map((test) => (
              <div key={test.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors cursor-pointer flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-indigo-900 transition-colors">{test.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{test.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-gray-900">{test.score}</span>
                  <Link to={`/analysis/${test.id}`} className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-indigo-100 text-gray-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
