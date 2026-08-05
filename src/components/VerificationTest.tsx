import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';

interface VerificationTestProps {
  topicName: string;
  onClose: () => void;
  onPass: () => void;
  onFail: () => void;
}

export const VerificationTest = ({ topicName, onClose, onPass, onFail }: VerificationTestProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [testComplete, setTestComplete] = useState(false);

  const questions = [
    { q: "What is 50% of 200?", options: ["50", "100", "150", "200"], answer: 1 },
    { q: "Convert 3/4 to a percentage.", options: ["25%", "50%", "75%", "100%"], answer: 2 },
    { q: "If a shirt costs $40 and is on sale for 20% off, what is the discount amount?", options: ["$2", "$4", "$8", "$10"], answer: 2 },
    { q: "What is 10% of 500?", options: ["5", "10", "50", "500"], answer: 2 },
    { q: "Express 0.85 as a percentage.", options: ["8.5%", "85%", "0.85%", "850%"], answer: 1 },
    { q: "A class has 20 boys and 30 girls. What percentage of the class are boys?", options: ["20%", "30%", "40%", "60%"], answer: 2 },
    { q: "If you scored 45 out of 50 on a test, what is your percentage?", options: ["80%", "85%", "90%", "95%"], answer: 2 },
    { q: "What is 25% of 80?", options: ["15", "20", "25", "30"], answer: 1 },
    { q: "Convert 1/5 to a percentage.", options: ["10%", "15%", "20%", "25%"], answer: 2 },
    { q: "If 40% of a number is 20, what is the number?", options: ["40", "50", "60", "80"], answer: 1 },
  ];

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setIsChecked(true);
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
    } else {
      setTestComplete(true);
    }
  };

  if (testComplete) {
    const passed = score >= 8; // 80% to pass
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-300">
          {passed ? (
            <>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Topic Mastered!</h2>
              <p className="text-gray-500 text-lg mb-8">You scored {score}/{questions.length}. Excellent work.</p>
              <button onClick={onPass} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg">
                Return to Dashboard
              </button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={48} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Needs More Work</h2>
              <p className="text-gray-500 text-lg mb-8">You scored {score}/{questions.length}. You need at least 8/10 to pass.</p>
              <button onClick={onFail} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg">
                Review Study Materials
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Verification Test</h2>
            <p className="text-gray-500 text-sm font-medium">{topicName} • Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="h-1.5 w-full bg-gray-100">
          <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${((currentQuestion) / questions.length) * 100}%` }} />
        </div>

        {/* Question Area */}
        <div className="p-10 bg-gray-50/50 flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
            {q.q}
          </h3>

          <div className="space-y-4">
            {q.options.map((opt, idx) => {
              let btnClass = "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50";
              let icon = null;
              
              if (selectedAnswer === idx) {
                btnClass = "border-primary-500 bg-primary-50 text-primary-700 font-bold ring-2 ring-primary-500/20";
              }
              
              if (isChecked) {
                if (idx === q.answer) {
                  btnClass = "border-green-500 bg-green-50 text-green-700 font-bold ring-2 ring-green-500/20";
                  icon = <CheckCircle2 className="text-green-500" size={20} />;
                } else if (selectedAnswer === idx) {
                  btnClass = "border-red-500 bg-red-50 text-red-700 font-bold opacity-80";
                  icon = <XCircle className="text-red-500" size={20} />;
                } else {
                  btnClass = "border-gray-200 bg-white text-gray-400 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isChecked}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full p-5 rounded-2xl border-2 text-left text-lg transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex justify-end">
          {!isChecked ? (
            <button
              onClick={handleCheck}
              disabled={selectedAnswer === null}
              className={`w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-colors ${selectedAnswer !== null ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg bg-gray-900 text-white shadow-md hover:bg-gray-800 transition-colors flex items-center justify-center sm:justify-start gap-2"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
