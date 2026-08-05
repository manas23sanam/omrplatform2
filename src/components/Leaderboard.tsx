import { Trophy, Medal, Star, Flame, Crown } from 'lucide-react';

export const Leaderboard = () => {
  const students = [
    { id: 1, rank: 1, name: "Student A", score: 980, streak: 12, isMe: false },
    { id: 2, rank: 2, name: "Student B", score: 945, streak: 8, isMe: false },
    { id: 3, rank: 3, name: "Student C", score: 920, streak: 5, isMe: false },
    { id: 4, rank: 4, name: "You", score: 890, streak: 15, isMe: true },
    { id: 5, rank: 5, name: "Student D", score: 850, streak: 2, isMe: false },
    { id: 6, rank: 6, name: "Student E", score: 810, streak: 4, isMe: false },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-yellow-300" size={32} />
            <h2 className="text-3xl font-bold">Grade 8 Mathematics League</h2>
          </div>
          <p className="text-primary-100 text-lg opacity-90">You are in the Top 15% this week! Keep it up!</p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none scale-150 translate-x-1/4 -translate-y-1/4">
          <Crown size={240} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg">Current Rankings</h3>
          <span className="text-sm font-medium text-gray-500">Names anonymized for privacy</span>
        </div>
        
        <div className="divide-y divide-gray-50">
          {students.map((student) => (
            <div 
              key={student.id} 
              className={`flex items-center justify-between p-6 transition-colors ${
                student.isMe ? 'bg-primary-50/50 border-l-4 border-primary-500' : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className="w-8 text-center font-bold text-gray-400 text-lg">
                  {student.rank === 1 ? <Medal size={28} className="text-yellow-500 mx-auto" /> : 
                   student.rank === 2 ? <Medal size={28} className="text-gray-400 mx-auto" /> :
                   student.rank === 3 ? <Medal size={28} className="text-amber-600 mx-auto" /> :
                   `#${student.rank}`}
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                    student.isMe ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {student.isMe ? 'Y' : student.name.charAt(8)}
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${student.isMe ? 'text-primary-700' : 'text-gray-800'}`}>
                      {student.name}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Flame size={14} className="text-orange-500" />
                      {student.streak} Day Streak
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-xl text-gray-800">{student.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
