import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Clock, Target, Compass, Layers, Check } from 'lucide-react';
import { LearningPath } from '../types';

interface CreatePathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPathCreated: (path: LearningPath) => void;
}

const POPULAR_TOPICS = [
  'Quantum Computing & Qiskit',
  'Autonomous Robotics & ROS2',
  'Distributed Systems in Go',
  'Biochemistry & Genetic Engineering',
  'AP Computer Science & DSA',
  'Generative AI Multi-Modal Agents',
  'Calculus III & Linear Algebra for ML',
  'Cloud Architecture & Kubernetes',
];

export const CreatePathModal: React.FC<CreatePathModalProps> = ({
  isOpen,
  onClose,
  onPathCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [goal, setGoal] = useState('Career Readiness & Job Mastery');
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [preferredStyle, setPreferredStyle] = useState('Hands-on Applied Projects');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/learning-path/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          currentLevel,
          goal,
          weeklyHours,
          preferredStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate learning path');
      }

      const generatedPath: LearningPath = await response.json();
      onPathCreated(generatedPath);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not synthesize path right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Curriculum Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Design Personalized Learning Path
          </h2>
          <p className="text-xs text-slate-300">
            Gemini AI builds a structured, multi-milestone path with verified competencies, practical capstones, and adaptive quizzes.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-5 text-xs">
          {/* Topic Input */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-200">
              What do you want to master?
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Distributed Database Architecture, Deep Reinforcement Learning..."
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Quick Suggestions */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-1.5">Or choose a trending topic:</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700/60 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Level */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200">Current Knowledge Baseline</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCurrentLevel(lvl)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    currentLevel === lvl
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                      : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Target Goal */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200">Primary Educational Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Career Readiness & Job Mastery">Career Readiness & Professional Transition</option>
              <option value="Academic Exam / AP Certification">Academic Coursework & High-Stakes Exam</option>
              <option value="Building a Tangible Production Product">Building a Real-World Production Product</option>
              <option value="Scientific Research & Theoretical Depth">Academic Research & Conceptual Depth</option>
            </select>
          </div>

          {/* Weekly Hours */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200">Weekly Study Cadence</label>
              <span className="font-mono text-cyan-400 font-bold">{weeklyHours} hrs / week</span>
            </div>
            <input
              type="range"
              min={2}
              max={25}
              step={1}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Light (2-4 hrs)</span>
              <span>Balanced (8-12 hrs)</span>
              <span>Intensive (20+ hrs)</span>
            </div>
          </div>

          {/* Learning Style */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200">Preferred Learning Style</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                'Hands-on Applied Projects',
                'Visual & Mental Models',
                'First-Principles Theory',
              ].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setPreferredStyle(style)}
                  className={`p-2 rounded-xl border text-[11px] font-medium transition-all ${
                    preferredStyle === style
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGenerating ? 'Synthesizing Path with Gemini...' : 'Generate Personalized Path'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
