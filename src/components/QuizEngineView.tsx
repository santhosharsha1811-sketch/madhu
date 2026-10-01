import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  BrainCircuit, 
  Code, 
  MessageSquare,
  BarChart2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Quiz, QuizQuestion, LearningPath, Milestone, QuizAttemptResult } from '../types';

interface QuizEngineViewProps {
  activePath: LearningPath;
  currentMilestone?: Milestone;
  onRecordQuizResult: (result: QuizAttemptResult, updatedMasteryScore?: number) => void;
  onNavigateToTab: (tab: 'dashboard' | 'path' | 'forum' | 'diagnostics') => void;
}

export const QuizEngineView: React.FC<QuizEngineViewProps> = ({
  activePath,
  currentMilestone,
  onRecordQuizResult,
  onNavigateToTab,
}) => {
  const defaultMilestone = currentMilestone || activePath.milestones.find(m => m.status === 'in_progress') || activePath.milestones[0];

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Intermediate');
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(4);

  // Active quiz attempt state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Fetch / Generate automated quiz
  const generateQuiz = async (topicToUse: string, milestoneTitleToUse: string, diff: string, count: number) => {
    setLoadingQuiz(true);
    setActiveQuiz(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setRevealedHints({});
    setIsCompleted(false);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          milestoneTitle: milestoneTitleToUse,
          difficulty: diff,
          questionCount: count,
          focusConcepts: defaultMilestone.keyConcepts,
        }),
      });
      const data: Quiz = await response.json();
      setActiveQuiz(data);
    } catch (err) {
      console.error('Quiz generation failed:', err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  // Start with default milestone quiz if no quiz active
  React.useEffect(() => {
    if (!activeQuiz && !loadingQuiz) {
      generateQuiz(activePath.title, defaultMilestone.title, defaultMilestone.difficulty || 'Intermediate', 4);
    }
  }, [defaultMilestone.id]);

  const handleSelectAnswer = (optionIdx: number) => {
    if (showExplanation || isCompleted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleConfirmAnswer = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    if (currentIndex < activeQuiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;
    setIsCompleted(true);

    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);

    // Confetti celebration if passed (>= 75%)
    if (percentage >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#fbbf24'],
        });
      } catch (e) {
        // ignore in non-browser
      }
    }

    const result: QuizAttemptResult = {
      quizId: activeQuiz.quizId || 'quiz-' + Date.now(),
      topic: activeQuiz.topic,
      milestoneTitle: activeQuiz.milestoneTitle,
      score: correctCount,
      total: activeQuiz.questions.length,
      percentage,
      timestamp: 'Just now',
      userAnswers: Object.values(selectedAnswers),
    };

    onRecordQuizResult(result, percentage);
  };

  const currentQ: QuizQuestion | undefined = activeQuiz?.questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const isCorrect = isAnswered && currentQ && selectedAnswers[currentIndex] === currentQ.correctIndex;

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Automated AI Assessment Engine</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Diagnostic Knowledge Assessment
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Real-time adaptive testing to verify conceptual mastery and reinforce neural retrieval pathways.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generateQuiz(activePath.title, defaultMilestone.title, selectedDifficulty, 4)}
            disabled={loadingQuiz}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loadingQuiz ? 'animate-spin' : ''}`} />
            <span>Regenerate Quiz</span>
          </button>
        </div>
      </div>

      {/* Target Module Bar */}
      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-400">Current Milestone Target:</span>
          <div className="font-semibold text-white text-sm">
            {activeQuiz?.milestoneTitle || defaultMilestone.title}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Beginner">Beginner (Foundations)</option>
            <option value="Intermediate">Intermediate (Applied)</option>
            <option value="Advanced">Advanced (Edge Cases & Architecture)</option>
          </select>
          <button
            onClick={() => generateQuiz(activePath.title, defaultMilestone.title, selectedDifficulty, customQuestionCount)}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loadingQuiz && (
        <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Synthesizing Adaptive Quiz...</h3>
            <p className="text-xs text-slate-400">
              Gemini AI is examining milestone competencies, formulating conceptual scenarios, and calibrating distractors.
            </p>
          </div>
        </div>
      )}

      {/* Active Quiz View */}
      {!loadingQuiz && activeQuiz && !isCompleted && currentQ && (
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/60 p-6 sm:p-8 space-y-6">
          {/* Question Progress & Meta */}
          <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-400 text-sm">
                Question {currentIndex + 1} of {activeQuiz.questions.length}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{currentQ.conceptTested}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 text-[11px] font-medium">
              {activeQuiz.difficulty}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700/40 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeQuiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQ.question}
            </h2>

            {/* Optional Code Snippet */}
            {currentQ.codeSnippet && (
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* Socratic Hint Drawer */}
          <div className="pt-1">
            {!revealedHints[currentIndex] ? (
              <button
                onClick={() => setRevealedHints(prev => ({ ...prev, [currentIndex]: true }))}
                className="text-xs text-amber-400/90 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Need a hint? Ask AI Tutor (Socratic Clue)</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90 space-y-1">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Socratic Guide</span>
                </div>
                <p>{currentQ.socraticHint}</p>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              const isCorrectOption = currentQ.correctIndex === optIdx;

              let optionStyle = 'bg-slate-850 hover:bg-slate-700/60 border-slate-700/80 text-slate-200';
              if (isSelected && !showExplanation) {
                optionStyle = 'bg-indigo-600/20 border-indigo-500 text-white font-medium ring-1 ring-indigo-500';
              } else if (showExplanation) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                } else {
                  optionStyle = 'bg-slate-800/30 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(optIdx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                    isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-relaxed pt-0.5">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              isCorrect 
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200' 
                : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Correct! Excellent deduction.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-300">Not quite. Here is the breakdown:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <button
              onClick={() => onNavigateToTab('forum')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Discuss question with peers</span>
            </button>

            {!showExplanation ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!isAnswered}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:translate-x-0.5"
              >
                <span>{currentIndex < activeQuiz.questions.length - 1 ? 'Next Question' : 'Complete Assessment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completion Summary Card */}
      {!loadingQuiz && isCompleted && activeQuiz && (
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/80 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20 text-white">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Assessment Completed!</h2>
            <p className="text-sm text-slate-300">
              Evaluated for <strong className="text-white">{activeQuiz.milestoneTitle}</strong>
            </p>
          </div>

          {/* Score Display */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-sm mx-auto space-y-3">
            <div className="text-4xl font-extrabold text-white">
              {Object.entries(selectedAnswers).filter(([idx, ans]) => ans === activeQuiz.questions[Number(idx)].correctIndex).length}
              <span className="text-xl text-slate-400 font-normal"> / {activeQuiz.questions.length}</span>
            </div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {Math.round((Object.entries(selectedAnswers).filter(([idx, ans]) => ans === activeQuiz.questions[Number(idx)].correctIndex).length / activeQuiz.questions.length) * 100)}% Accuracy
            </div>
            <div className="text-xs text-emerald-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time mastery metric updated in your profile!</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => generateQuiz(activePath.title, activeQuiz.milestoneTitle, selectedDifficulty, 4)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Adaptive Quiz</span>
            </button>
            <button
              onClick={() => onNavigateToTab('dashboard')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => onNavigateToTab('forum')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discuss in Forum</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
