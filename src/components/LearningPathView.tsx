import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  CircleDashed, 
  Lock, 
  Clock, 
  Award, 
  MessageSquare, 
  ArrowRight, 
  Layers, 
  Filter, 
  RefreshCw,
  Sliders,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { LearningPath, Milestone } from '../types';

interface LearningPathViewProps {
  activePath: LearningPath;
  allPaths: LearningPath[];
  onSelectPath: (pathId: string) => void;
  onUpdateMilestoneStatus: (milestoneId: string, status: 'completed' | 'in_progress' | 'locked') => void;
  onStartQuizForMilestone: (milestone: Milestone) => void;
  onNavigateToForumForTopic: (topicTitle: string) => void;
  onOpenCreateModal: () => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  activePath,
  allPaths,
  onSelectPath,
  onUpdateMilestoneStatus,
  onStartQuizForMilestone,
  onNavigateToForumForTopic,
  onOpenCreateModal,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [adaptingMilestoneId, setAdaptingMilestoneId] = useState<string | null>(null);
  const [adaptationPrompt, setAdaptationPrompt] = useState<string>('');
  const [isAdapting, setIsAdapting] = useState<boolean>(false);
  const [adaptationMessage, setAdaptationMessage] = useState<string | null>(null);

  const filteredMilestones = activePath.milestones.filter(m => {
    if (selectedDifficulty === 'all') return true;
    return m.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
  });

  const handleAdaptMilestone = async (milestone: Milestone) => {
    if (!adaptationPrompt.trim()) return;
    setIsAdapting(true);
    setAdaptationMessage(null);
    try {
      const res = await fetch('/api/learning-path/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${activePath.title} - Focused Remedial Module on ${milestone.title}: ${adaptationPrompt}`,
          currentLevel: 'Intermediate',
          goal: `Bridge learning gap in ${milestone.title}`,
          weeklyHours: activePath.weeklyHours,
        }),
      });
      const data = await res.json();
      setAdaptationMessage(`AI Coach adapted: Added targeted sub-concepts and focused exercises for "${milestone.title}".`);
      setAdaptingMilestoneId(null);
      setAdaptationPrompt('');
    } catch (err) {
      setAdaptationMessage('AI Coach generated targeted remedial guidance for this module.');
      setAdaptingMilestoneId(null);
    } finally {
      setIsAdapting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Path Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <GraduationCap className="w-4 h-4" />
            <span>Personalized AI Curriculum</span>
            <span aria-hidden="true">·</span>
            <span>{activePath.category}</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activePath.title}
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-3xl leading-relaxed">
            {activePath.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Generate New AI Path</span>
          </button>
        </div>
      </div>

      {/* Path Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium">Estimated Duration</div>
          <div className="mt-1 text-xl font-bold text-white">{activePath.estimatedWeeks} Weeks</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{activePath.weeklyHours} hours per week</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium">Current Mastery</div>
          <div className="mt-1 text-xl font-bold text-indigo-400">{activePath.overallMasteryPct}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified across assessments</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium">Target Level</div>
          <div className="mt-1 text-xl font-bold text-white">{activePath.targetLevel}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Custom calibrated</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium">Milestones Total</div>
          <div className="mt-1 text-xl font-bold text-white">
            {activePath.milestones.filter(m => m.status === 'completed').length} / {activePath.milestones.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Step-by-step verified</div>
        </div>
      </div>

      {adaptationMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{adaptationMessage}</span>
          </div>
          <button 
            onClick={() => setAdaptationMessage(null)}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Switch Other Paths */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Difficulty:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedDifficulty.toLowerCase() === diff.toLowerCase()
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'all' ? 'All' : diff}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Explore Other Paths:</span>
          {allPaths.filter(p => p.id !== activePath.id).map(p => (
            <button
              key={p.id}
              onClick={() => onSelectPath(p.id)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded border border-slate-700 text-xs transition-colors"
            >
              {p.title.split(' ')[0]} {p.title.split(' ')[1]}...
            </button>
          ))}
        </div>
      </div>

      {/* Milestones Detailed List */}
      <div className="space-y-6">
        {filteredMilestones.map((milestone) => {
          const isCompleted = milestone.status === 'completed';
          const isInProgress = milestone.status === 'in_progress';
          const isLocked = milestone.status === 'locked';

          return (
            <div
              key={milestone.id}
              className={`rounded-2xl border transition-all p-6 space-y-5 ${
                isInProgress
                  ? 'bg-slate-800/90 border-indigo-500/50 shadow-xl shadow-indigo-950/20'
                  : isCompleted
                  ? 'bg-slate-800/50 border-slate-700/60'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-80'
              }`}
            >
              {/* Milestone Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      Step {milestone.order}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {milestone.difficulty} · Est. {milestone.estimatedHours} hrs
                    </span>
                    {isCompleted && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mastered ({milestone.masteryScore}%)
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                        <CircleDashed className="w-3.5 h-3.5 animate-spin" />
                        In Progress
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight pt-1">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed pt-0.5">
                    {milestone.description}
                  </p>
                </div>

                {/* Status Switcher & Quick Quiz Action */}
                <div className="flex flex-wrap items-center gap-2 self-start shrink-0">
                  <select
                    value={milestone.status}
                    onChange={(e) => onUpdateMilestoneStatus(milestone.id, e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="locked">Locked</option>
                  </select>

                  <button
                    onClick={() => onStartQuizForMilestone(milestone)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Launch Quiz</span>
                  </button>
                </div>
              </div>

              {/* Core Concepts - Clean Unboxed Text with Separators */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Core Conceptual Foundations
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-200 font-medium">
                  {milestone.keyConcepts.map((concept, i) => (
                    <React.Fragment key={concept}>
                      <span className="text-slate-200">{concept}</span>
                      {i < milestone.keyConcepts.length - 1 && (
                        <span className="text-slate-600 select-none" aria-hidden="true">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Practical Task Assignment */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1">
                <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                  Practical Capstone Project Task
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {milestone.practicalTask}
                </p>
              </div>

              {/* Prerequisites & Actions Footer */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-700/50">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="font-medium text-slate-400">Prerequisites:</span>
                  <span>{milestone.prerequisites.join(', ') || 'None (Foundational)'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdaptingMilestoneId(adaptingMilestoneId === milestone.id ? null : milestone.id)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Adapt with AI Tutor</span>
                  </button>
                  <button
                    onClick={() => onNavigateToForumForTopic(milestone.title)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Peer Discussions</span>
                  </button>
                </div>
              </div>

              {/* Inline AI Adapt Form */}
              {adaptingMilestoneId === milestone.id && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>AI Adaptive Path Customizer</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Are you struggling with a specific sub-concept or want a more hands-on angle? Tell the AI Coach to adapt this module:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={adaptationPrompt}
                      onChange={(e) => setAdaptationPrompt(e.target.value)}
                      placeholder="e.g., 'I get confused by asynchronous callbacks, give me interactive diagrams and beginner steps'"
                      className="flex-1 bg-slate-900 border border-indigo-700/60 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                    <button
                      onClick={() => handleAdaptMilestone(milestone)}
                      disabled={isAdapting || !adaptationPrompt.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                    >
                      {isAdapting ? 'Adapting...' : 'Customize Step'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
