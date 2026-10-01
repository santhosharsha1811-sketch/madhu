import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Clock, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  CircleDashed, 
  Lock, 
  Sparkles, 
  Play, 
  Target, 
  BrainCircuit, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { LearningPath, StudentProfile, QuizAttemptResult, Milestone } from '../types';

interface DashboardViewProps {
  activePath: LearningPath;
  currentProfile: StudentProfile;
  quizHistory: QuizAttemptResult[];
  onStartQuizForMilestone: (milestone: Milestone) => void;
  onNavigateToTab: (tab: 'path' | 'quiz' | 'forum' | 'diagnostics') => void;
  onOpenCreatePath: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activePath,
  currentProfile,
  quizHistory,
  onStartQuizForMilestone,
  onNavigateToTab,
  onOpenCreatePath,
}) => {
  const activeMilestone = activePath.milestones.find(m => m.status === 'in_progress') || activePath.milestones[0];
  const completedMilestones = activePath.milestones.filter(m => m.status === 'completed');

  // Competency status helper
  const getCompetencyBadge = (level: number) => {
    if (level >= 85) return { label: 'Mastered', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60' };
    if (level >= 70) return { label: 'Proficient', color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/60' };
    if (level >= 50) return { label: 'Developing', color: 'text-amber-400 bg-amber-950/40 border-amber-800/60' };
    return { label: 'Novice', color: 'text-rose-400 bg-rose-950/40 border-rose-800/60' };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner & AI Coach Insight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/40 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold tracking-wider uppercase">
              <span>Real-Time Mastery Dashboard</span>
              <span aria-hidden="true">·</span>
              <span>{activePath.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentProfile.name.split(' ')[0]}!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Currently advancing through <strong className="text-white font-medium">{activePath.title}</strong>. 
              You are {activePath.overallMasteryPct}% towards complete domain fluency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartQuizForMilestone(activeMilestone)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Adaptive Quiz</span>
            </button>
            <button
              onClick={onOpenCreatePath}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Generate New AI Path</span>
            </button>
          </div>
        </div>

        {/* AI Daily Diagnostic Micro-tip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-start gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-indigo-500/20">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-indigo-200 flex items-center gap-2">
              <span>EduGenie AI Mastery Diagnostic</span>
              <span className="text-[10px] text-slate-400 font-normal">Real-Time Insight</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activePath.aiCoachTip}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('diagnostics')}
            className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 whitespace-nowrap self-center font-medium flex items-center gap-1"
          >
            <span>Full Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 Vital Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Mastery */}
        <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Overall Path Mastery</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{activePath.overallMasteryPct}%</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +5.2% this wk
            </span>
          </div>
          {/* Progress track */}
          <div className="mt-3 w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${activePath.overallMasteryPct}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Milestones Progress */}
        <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Milestones Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {completedMilestones.length} <span className="text-base text-slate-400 font-normal">/ {activePath.milestones.length}</span>
            </span>
            <span className="text-xs text-slate-400">
              {Math.round((completedMilestones.length / activePath.milestones.length) * 100)}% steps
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="truncate">Active: {activeMilestone.title}</span>
          </div>
        </div>

        {/* Metric 3: Learning Streak */}
        <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300">
              {currentProfile.currentStreakDays} <span className="text-base text-slate-400 font-normal">Days</span>
            </span>
            <span className="text-xs text-amber-400/90 font-medium">Top 5% consistency</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Daily goal: 45 mins · <span className="text-emerald-400">Achieved today</span>
          </div>
        </div>

        {/* Metric 4: Total Study Hours */}
        <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Study Hours Logged</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{currentProfile.totalStudyHours}</span>
            <span className="text-xs text-slate-400">Target: {activePath.weeklyHours}h/wk</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>{currentProfile.quizzesCompleted} quizzes evaluated</span>
            <span className="text-cyan-400 font-medium">Verified</span>
          </div>
        </div>
      </div>

      {/* Main Dual Columns: Competency Breakdown & Active Milestone Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Real-time Competencies Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Competency Mastery Matrix</h2>
                <p className="text-xs text-slate-400">Real-time skill vectors in {activePath.title}</p>
              </div>
              <button
                onClick={() => onNavigateToTab('quiz')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Assess Gaps
              </button>
            </div>

            <div className="space-y-4">
              {activePath.competencies.map((comp) => {
                const badge = getCompetencyBadge(comp.levelPct);
                return (
                  <div key={comp.name} className="space-y-1.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{comp.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="font-mono font-bold text-slate-100">{comp.levelPct}%</span>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          comp.levelPct >= 85
                            ? 'bg-emerald-400'
                            : comp.levelPct >= 70
                            ? 'bg-indigo-400'
                            : comp.levelPct >= 50
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${comp.levelPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>Category: {comp.category}</span>
                      {comp.levelPct < 70 && (
                        <button
                          onClick={() => onNavigateToTab('quiz')}
                          className="text-amber-400 hover:text-amber-300 font-medium"
                        >
                          Targeted Quiz →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                Adaptive difficulty auto-adjusts
              </span>
              <button 
                onClick={() => onNavigateToTab('diagnostics')}
                className="text-cyan-400 hover:underline font-medium"
              >
                View Diagnostic
              </button>
            </div>
          </div>

          {/* Recent Quiz Assessment History */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Recent Quiz Evaluations</h2>
              <button
                onClick={() => onNavigateToTab('quiz')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View All
              </button>
            </div>

            {quizHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No assessments completed yet.</p>
            ) : (
              <div className="space-y-3">
                {quizHistory.slice(0, 3).map((hist, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-semibold text-slate-200 line-clamp-1">{hist.milestoneTitle}</div>
                      <div className="text-[11px] text-slate-400">{hist.timestamp}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                        hist.percentage >= 80 
                          ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50' 
                          : 'text-amber-400 bg-amber-950/40 border-amber-800/50'
                      }`}>
                        {hist.score}/{hist.total} ({hist.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Milestone Spotlight & Sequential Pathway (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Milestone Spotlight Card */}
          <div className="bg-gradient-to-br from-slate-800/90 to-indigo-950/40 rounded-2xl border border-indigo-500/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Current Milestone Focus</span>
              </div>
              <span className="text-xs font-medium text-slate-400">Step {activeMilestone.order} of {activePath.milestones.length}</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">{activeMilestone.title}</h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">{activeMilestone.description}</p>
            </div>

            {/* Key Concepts - Following Anti-Slop Zero-Pill Constitution */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Core Conceptual Foundations
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-200 font-medium">
                {activeMilestone.keyConcepts.map((concept, i) => (
                  <React.Fragment key={concept}>
                    <span className="text-slate-200">{concept}</span>
                    {i < activeMilestone.keyConcepts.length - 1 && (
                      <span className="text-slate-500 select-none" aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Practical Task Assignment */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-1">
              <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                Practical Capstone Objective
              </div>
              <p className="text-xs text-slate-200 font-medium">
                {activeMilestone.practicalTask}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onStartQuizForMilestone(activeMilestone)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>Take Milestone Assessment</span>
              </button>
              <button
                onClick={() => onNavigateToTab('forum')}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Ask Peer Forum</span>
              </button>
              <button
                onClick={() => onNavigateToTab('path')}
                className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View Full Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sequential Milestone Pathway Timeline */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Milestone Progression Roadmap</h3>
                <p className="text-xs text-slate-400">Sequential mastery trajectory</p>
              </div>
              <span className="text-xs text-slate-400">
                {activePath.estimatedWeeks} Weeks · {activePath.weeklyHours}h/wk
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
              {activePath.milestones.map((m) => {
                const isCompleted = m.status === 'completed';
                const isInProgress = m.status === 'in_progress';
                const isLocked = m.status === 'locked';

                return (
                  <div key={m.id} className="relative group">
                    {/* Status node icon */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-slate-900 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : isInProgress
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                      {isInProgress && <CircleDashed className="w-3 h-3 stroke-[3]" />}
                      {isLocked && <Lock className="w-2.5 h-2.5" />}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">Step {m.order}</span>
                          <span className="text-xs font-bold text-white">{m.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {isCompleted && (
                            <span className="font-semibold text-emerald-400 text-[11px]">
                              {m.masteryScore}% Mastered
                            </span>
                          )}
                          {isInProgress && (
                            <span className="font-semibold text-indigo-400 text-[11px]">
                              In Progress
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-slate-500 text-[11px]">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">{m.description}</p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span>Est. {m.estimatedHours} hrs · {m.difficulty}</span>
                        {!isLocked && (
                          <button
                            onClick={() => onStartQuizForMilestone(m)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                          >
                            Quiz ({m.masteryScore}%) →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
