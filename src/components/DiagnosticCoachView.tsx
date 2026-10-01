import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  RefreshCw, 
  Target,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DiagnosticReport, LearningPath, StudentProfile, QuizAttemptResult } from '../types';

interface DiagnosticCoachViewProps {
  diagnostic: DiagnosticReport;
  activePath: LearningPath;
  currentProfile: StudentProfile;
  quizHistory: QuizAttemptResult[];
  onUpdateDiagnostic: (newDiagnostic: DiagnosticReport) => void;
  onNavigateToTab: (tab: 'dashboard' | 'path' | 'quiz' | 'forum') => void;
}

export const DiagnosticCoachView: React.FC<DiagnosticCoachViewProps> = ({
  diagnostic,
  activePath,
  currentProfile,
  quizHistory,
  onUpdateDiagnostic,
  onNavigateToTab,
}) => {
  const [isRunningScan, setIsRunningScan] = useState<boolean>(false);
  const [completedSprintDays, setCompletedSprintDays] = useState<Record<string, boolean>>({});

  const handleRunDiagnosticScan = async () => {
    setIsRunningScan(true);
    try {
      const recentScores = quizHistory.slice(0, 5).map(q => ({
        topic: q.topic,
        milestone: q.milestoneTitle,
        score: `${q.score}/${q.total}`,
        percentage: q.percentage,
      }));

      const weakAreas = activePath.competencies
        .filter(c => c.levelPct < 75)
        .map(c => c.name);

      const res = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentProfile.name,
          topic: activePath.title,
          scores: recentScores,
          weakAreas,
        }),
      });

      const data = await res.json();
      const updated: DiagnosticReport = {
        ...data,
        generatedAt: 'Just now',
      };
      onUpdateDiagnostic(updated);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsRunningScan(false);
    }
  };

  const toggleSprintDay = (day: string) => {
    setCompletedSprintDays(prev => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Cognitive Diagnostics</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Mastery & Diagnostic Coach
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Gemini synthesizes your assessment patterns, retrieval gaps, and study cadence into precision learning interventions.
          </p>
        </div>

        <button
          onClick={handleRunDiagnosticScan}
          disabled={isRunningScan}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-300 ${isRunningScan ? 'animate-spin' : ''}`} />
          <span>{isRunningScan ? 'Analyzing Telemetry...' : 'Run Diagnostic Scan'}</span>
        </button>
      </div>

      {/* Main Diagnostic Summary Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Cognitive Trajectory Synthesis
            </span>
          </div>
          <span className="text-xs text-slate-400">Scan: {diagnostic.generatedAt}</span>
        </div>

        <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
          "{diagnostic.assessmentSummary}"
        </p>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 italic leading-relaxed">
          <strong className="text-cyan-300 not-italic block font-semibold mb-1">Coach Note:</strong>
          {diagnostic.coachEncouragement}
        </div>
      </div>

      {/* Strengths vs Critical Vulnerabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/60 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Validated Competency Strengths</span>
          </div>

          <div className="space-y-3">
            {diagnostic.strengths.map((str, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-emerald-900/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-200 font-medium leading-relaxed">{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Vulnerabilities */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/60 p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Target Vulnerabilities & Gaps</span>
          </div>

          <div className="space-y-3">
            {diagnostic.criticalFocusAreas.map((gap, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-amber-900/30">
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <div className="space-y-1">
                  <span className="text-xs text-slate-200 font-medium leading-relaxed block">{gap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Day Actionable Recovery Sprint */}
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Calendar className="w-4 h-4" />
              <span>Targeted Remediation Protocol</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Personalized 3-Day Recovery Sprint
            </h3>
          </div>
          <span className="text-xs text-slate-400">Micro-actions calibrated to eliminate current bottlenecks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {diagnostic.threeDaySprint.map((sprint) => {
            const isDone = !!completedSprintDays[sprint.day];
            return (
              <div
                key={sprint.day}
                onClick={() => toggleSprintDay(sprint.day)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : 'bg-slate-800/80 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                      {sprint.day}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {sprint.estimatedMinutes} mins
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {sprint.action}
                  </h4>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-700/40">
                  <div className="text-[11px] text-slate-300">
                    <strong className="text-slate-400 block font-normal mb-0.5">Target Artifact:</strong>
                    <span>{sprint.targetOutput}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      className={`text-xs font-semibold flex items-center gap-1.5 ${
                        isDone ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Completed sprints directly accelerate your overall path mastery velocity.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab('quiz')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
            >
              Verify with Quiz →
            </button>
            <button
              onClick={() => onNavigateToTab('forum')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
            >
              Ask Study Circle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
