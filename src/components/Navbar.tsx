import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Award, 
  BookOpen, 
  BarChart3, 
  CheckCircle2, 
  MessageSquare, 
  BrainCircuit, 
  Plus, 
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { LearningPath, StudentProfile } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'path' | 'quiz' | 'forum' | 'diagnostics';
  setActiveTab: (tab: 'dashboard' | 'path' | 'quiz' | 'forum' | 'diagnostics') => void;
  activePath: LearningPath;
  allPaths: LearningPath[];
  onSelectPath: (pathId: string) => void;
  onOpenCreatePathModal: () => void;
  currentProfile: StudentProfile;
  allProfiles: StudentProfile[];
  onSelectProfile: (profileId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activePath,
  allPaths,
  onSelectPath,
  onOpenCreatePathModal,
  currentProfile,
  allProfiles,
  onSelectProfile,
}) => {
  const [pathDropdownOpen, setPathDropdownOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">EduGenie</span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Adaptive Learning & Mastery</p>
            </div>
          </div>

          {/* Active Learning Path Dropdown Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setPathDropdownOpen(!pathDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors max-w-[280px]"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate text-left font-medium">{activePath.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
            </button>

            {pathDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700/50 mb-1">
                  Active Learning Paths
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {allPaths.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPath(p.id);
                        setPathDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                        p.id === activePath.id
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-medium truncate">{p.title}</div>
                        <div className="text-[10px] text-slate-400">{p.category} · {p.overallMasteryPct}% Mastery</div>
                      </div>
                      {p.id === activePath.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-1 border-t border-slate-700/60">
                  <button
                    onClick={() => {
                      setPathDropdownOpen(false);
                      onOpenCreatePathModal();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New AI Learning Path</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('path')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'path'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Path Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Quizzes</span>
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'forum'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Forum</span>
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'diagnostics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden md:inline">AI Coach</span>
            </button>
          </nav>

          {/* Student Profile & Gamification Stats */}
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>{currentProfile.currentStreakDays}d Streak</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setPathDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
                />
                <div className="hidden xl:block text-left text-xs">
                  <div className="font-semibold text-slate-200 leading-tight">{currentProfile.name}</div>
                  <div className="text-[10px] text-cyan-400">{currentProfile.overallMasteryPct}% Mastery</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden xl:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-700/60">
                    <img
                      src={currentProfile.avatar}
                      alt={currentProfile.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{currentProfile.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{currentProfile.email}</div>
                    </div>
                  </div>

                  <div className="py-2.5 text-xs text-slate-300 space-y-1.5 border-b border-slate-700/60">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Total Study Time</span>
                      <span className="font-semibold text-white">{currentProfile.totalStudyHours} hrs</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Quizzes Passed</span>
                      <span className="font-semibold text-white">{currentProfile.quizzesCompleted} assessments</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Forum Solutions</span>
                      <span className="font-semibold text-cyan-400">{currentProfile.forumSolutionsProvided} accepted</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Switch Student Profile
                    </div>
                    {allProfiles.map((prof) => (
                      <button
                        key={prof.id}
                        onClick={() => {
                          onSelectProfile(prof.id);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-xs text-left transition-colors ${
                          prof.id === currentProfile.id
                            ? 'bg-indigo-600/30 text-indigo-300'
                            : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{prof.name}</span>
                        {prof.id === currentProfile.id && <span className="ml-auto text-[10px] text-indigo-400 font-medium">Active</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
