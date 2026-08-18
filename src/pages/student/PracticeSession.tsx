import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trophy,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLearningStore } from '../../context/LearningStoreContext';
import { getPracticeTopicPack, type PracticeQuestion } from '../../data/practiceQuestions';
import { formatXp } from '../../lib/gamification';

export const PracticeSession: React.FC = () => {
  const { topicId } = useParams<{ topicId?: string }>();
  const navigate = useNavigate();
  const { completePracticeQuiz, currentUser } = useLearningStore();

  const topicPack = getPracticeTopicPack(topicId);
  const questions = topicPack.questions;

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // qIdx -> optionIdx (0..3)
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean>>({}); // qIdx -> boolean (checked)
  const [secondsRemaining, setSecondsRemaining] = useState(topicPack.timeLimitSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [instantMode, setInstantMode] = useState(true);

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  const currentQ: PracticeQuestion = questions[currentIdx] || questions[0];
  const selectedOptionIdx = selectedAnswers[currentIdx];
  const isCurrentChecked = checkedAnswers[currentIdx];

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted || isCurrentChecked) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleCheckCurrentAnswer = () => {
    if (selectedOptionIdx === undefined) return;
    setCheckedAnswers((prev) => ({ ...prev, [currentIdx]: true }));
  };

  // Calculate score & statistics
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctOptionIndex) {
      correctCount++;
    }
  });
  const totalQuestions = questions.length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const earnedXp = Math.round(topicPack.targetXp * (scorePercentage / 100)) + 30; // base reward + accuracy bonus

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    // Mark all as checked
    const allChecked: Record<number, boolean> = {};
    questions.forEach((_, i) => (allChecked[i] = true));
    setCheckedAnswers(allChecked);

    // Sync with global store (updates weak topic to mastered if >= 80, adds XP, re-ranks leaderboard)
    completePracticeQuiz(topicPack.topicId, scorePercentage, earnedXp);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCheckedAnswers({});
    setSecondsRemaining(topicPack.timeLimitSeconds);
    setCurrentIdx(0);
    setIsSubmitted(false);
    setIsTimerRunning(true);
    setShowHint(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 font-sans">
      {/* Top Navigation & Topic Briefing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/student/mock-tests"
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors shadow-2xs"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  topicPack.subject === 'Physics'
                    ? 'bg-blue-50 text-blue-700'
                    : topicPack.subject === 'Chemistry'
                    ? 'bg-slate-50 text-slate-700'
                    : 'bg-slate-50 text-slate-700'
                }`}
              >
                {topicPack.subject} Drill
              </span>
              <span className="text-xs font-bold text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-500">5-Question Verification</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              {topicPack.topicName}
            </h2>
          </div>
        </div>

        {/* XP Bounty & Timer Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-black text-slate-900 shadow-2xs">
            <Zap size={14} className="fill-slate-500 text-slate-600" />
            <span>+{topicPack.targetXp} XP Bounty</span>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-black border shadow-2xs ${
              secondsRemaining < 60
                ? 'bg-slate-50 text-slate-700 border-slate-200 animate-pulse'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <Clock size={14} className={secondsRemaining < 60 ? 'text-slate-500' : 'text-blue-400'} />
            <span className="font-mono text-sm">{formatTimer(secondsRemaining)}</span>
          </div>
        </div>
      </div>

      {!isSubmitted ? (
        /* ACTIVE QUIZ SESSION VIEW */
        <div className="space-y-6">
          {/* Progress Bar & Question Stepper */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-slate-900">
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setInstantMode(!instantMode)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                    instantMode ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {instantMode ? '⚡ Instant Feedback Active' : 'Exam Mode (Submit at End)'}
                </button>
                <span className="font-extrabold text-slate-400">
                  {Math.round(((currentIdx + 1) / totalQuestions) * 100)}% Complete
                </span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Question Palette Chips */}
            <div className="flex items-center gap-2 pt-1">
              {questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCurrent = currentIdx === idx;
                const isChecked = checkedAnswers[idx];
                const isCorrect = selectedAnswers[idx] === questions[idx].correctOptionIndex;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentIdx(idx);
                      setShowHint(false);
                    }}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-blue-500 shadow-xs'
                        : ''
                    } ${
                      isChecked
                        ? isCorrect
                          ? 'bg-slate-500 text-white'
                          : 'bg-slate-500 text-white'
                        : isAnswered
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Presentation Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Question {currentIdx + 1}
              </span>
              <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-relaxed">
                {currentQ.questionText}
              </h3>
            </div>

            {/* 4 MCQ Option Buttons */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((optText, optIdx) => {
                const optionLetter = ['A', 'B', 'C', 'D'][optIdx];
                const isSelected = selectedOptionIdx === optIdx;
                const isChecked = isCurrentChecked;
                const isCorrectOption = optIdx === currentQ.correctOptionIndex;

                let buttonStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800';
                if (isChecked) {
                  if (isCorrectOption) {
                    buttonStyle = 'border-slate-500 bg-slate-50/80 text-slate-950 font-black ring-2 ring-slate-400/40 shadow-xs';
                  } else if (isSelected) {
                    buttonStyle = 'border-slate-500 bg-slate-50/80 text-slate-950 font-bold ring-2 ring-slate-400/40';
                  } else {
                    buttonStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  buttonStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-black ring-2 ring-blue-500/30 shadow-xs';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isSubmitted || isCurrentChecked}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer ${buttonStyle}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isChecked && isCorrectOption
                          ? 'bg-slate-600 text-white'
                          : isChecked && isSelected
                          ? 'bg-slate-600 text-white'
                          : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {optionLetter}
                    </div>

                    <span className="text-xs md:text-sm pt-0.5 leading-relaxed flex-1">
                      {optText}
                    </span>

                    {isChecked && isCorrectOption && (
                      <CheckCircle2 size={18} className="text-slate-600 shrink-0 mt-0.5" />
                    )}
                    {isChecked && isSelected && !isCorrectOption && (
                      <XCircle size={18} className="text-slate-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Check Answer Button (in Instant Mode) */}
            {instantMode && !isCurrentChecked && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={selectedOptionIdx === undefined}
                  onClick={handleCheckCurrentAnswer}
                  className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                    selectedOptionIdx !== undefined
                      ? 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-105'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 size={15} />
                  <span>Check Answer</span>
                </button>
              </div>
            )}

            {/* Detailed AI Explanation Box (revealed when checked) */}
            {isCurrentChecked && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={18} className="text-blue-600" />
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Step-by-Step AI Solution & Derivation
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      selectedOptionIdx === currentQ.correctOptionIndex
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {selectedOptionIdx === currentQ.correctOptionIndex ? '✓ Correct Solution' : '✗ Mistake Corrected'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentQ.aiExplanation}
                </p>

                {currentQ.formula && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-blue-700 font-bold">
                    Key Formula: {currentQ.formula}
                  </div>
                )}
              </div>
            )}

            {/* Navigation & Submission Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => {
                  setCurrentIdx((prev) => Math.max(0, prev - 1));
                  setShowHint(false);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
                  currentIdx > 0
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                    : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                }`}
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {currentIdx < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1));
                      setShowHint(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Trophy size={16} />
                    <span>Submit & Grade Quiz</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* QUIZ RESULTS & CELEBRATION SUMMARY VIEW */
        <div className="space-y-8 animate-in zoom-in-95 duration-400">
          {/* Headline Results Hero Card */}
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl text-center relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-400 to-slate-500 text-slate-950 flex items-center justify-center font-black text-3xl mx-auto shadow-xl ring-8 ring-white/10 animate-bounce">
                <Trophy size={36} className="fill-slate-950" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  {scorePercentage >= 80 ? 'Mastery Milestone Achieved!' : 'Practice Complete!'}
                </span>
                <h3 className="text-3xl md:text-4xl font-black mt-2">
                  {scorePercentage}% Score ({correctCount}/{totalQuestions} Correct)
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-400 to-slate-400 text-slate-950 px-6 py-2.5 rounded-2xl font-black text-sm shadow-md">
                <Zap size={18} className="fill-slate-950" />
                <span>+{formatXp(earnedXp)} XP Awarded & Synced to Cohort Leaderboard</span>
              </div>

              <p className="text-xs md:text-sm text-blue-100 leading-relaxed pt-2">
                {scorePercentage >= 80
                  ? `Outstanding! You demonstrated clear mastery of ${topicPack.topicName}. This topic has been marked as Mastered on your study checklist.`
                  : `Good effort! You scored ${scorePercentage}%. Review the step-by-step solutions below and retake to achieve Mastered status.`}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Retake Practice Quiz</span>
                </button>

                <Link
                  to="/student/mock-tests"
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                >
                  <span>Return to Mock Tests</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Solution Review Mode (All Questions) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs space-y-6">
            <h3 className="font-black text-slate-900 text-lg">
              Question-by-Question Solution Review
            </h3>

            <div className="space-y-6">
              {questions.map((q, idx) => {
                const pickedIdx = selectedAnswers[idx];
                const isCorrect = pickedIdx === q.correctOptionIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                      isCorrect ? 'border-slate-200 bg-slate-50/20' : 'border-slate-200 bg-slate-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase text-slate-400">
                            Question {idx + 1}
                          </span>
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={12} /> Correct (+4)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                              <XCircle size={12} /> Incorrect (-1)
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900">{q.questionText}</h4>
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isPicked = pickedIdx === oIdx;
                        const isRight = oIdx === q.correctOptionIndex;

                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border flex items-center gap-2 ${
                              isRight
                                ? 'bg-slate-100 border-slate-300 text-slate-950 font-bold'
                                : isPicked
                                ? 'bg-slate-100 border-slate-300 text-slate-950 font-bold'
                                : 'bg-white border-slate-200 text-slate-500'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md bg-white text-slate-800 flex items-center justify-center font-black text-[10px]">
                              {['A', 'B', 'C', 'D'][oIdx]}
                            </span>
                            <span className="line-clamp-1">{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Solution Explanation */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 text-xs space-y-1.5 text-slate-600 leading-relaxed">
                      <p className="font-bold text-slate-900">💡 Solution & Concept Derivation:</p>
                      <p>{q.aiExplanation}</p>
                      {q.formula && (
                        <p className="font-mono text-[11px] text-blue-700 font-bold mt-1">
                          {q.formula}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
