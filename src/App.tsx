import React, { useState, useEffect } from 'react';
import { 
  initialProfiles, 
  initialPaths, 
  initialForumPosts, 
  initialQuizHistory, 
  initialDiagnostic 
} from './data/initialData';
import { 
  LearningPath, 
  StudentProfile, 
  ForumPost, 
  ForumReply, 
  QuizAttemptResult, 
  DiagnosticReport, 
  Milestone 
} from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { LearningPathView } from './components/LearningPathView';
import { QuizEngineView } from './components/QuizEngineView';
import { PeerForumView } from './components/PeerForumView';
import { DiagnosticCoachView } from './components/DiagnosticCoachView';
import { CreatePathModal } from './components/CreatePathModal';

export default function App() {
  // LocalStorage-backed state with fallbacks
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('edugenie_profiles');
    return saved ? JSON.parse(saved) : initialProfiles;
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>(() => {
    return localStorage.getItem('edugenie_current_profile_id') || profiles[0].id;
  });

  const [paths, setPaths] = useState<LearningPath[]>(() => {
    const saved = localStorage.getItem('edugenie_paths');
    return saved ? JSON.parse(saved) : initialPaths;
  });

  const [activePathId, setActivePathId] = useState<string>(() => {
    return localStorage.getItem('edugenie_active_path_id') || paths[0].id;
  });

  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('edugenie_forum_posts');
    return saved ? JSON.parse(saved) : initialForumPosts;
  });

  const [quizHistory, setQuizHistory] = useState<QuizAttemptResult[]>(() => {
    const saved = localStorage.getItem('edugenie_quiz_history');
    return saved ? JSON.parse(saved) : initialQuizHistory;
  });

  const [diagnostic, setDiagnostic] = useState<DiagnosticReport>(() => {
    const saved = localStorage.getItem('edugenie_diagnostic');
    return saved ? JSON.parse(saved) : initialDiagnostic;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'path' | 'quiz' | 'forum' | 'diagnostics'>('dashboard');
  const [targetMilestoneForQuiz, setTargetMilestoneForQuiz] = useState<Milestone | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('edugenie_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('edugenie_current_profile_id', currentProfileId);
  }, [currentProfileId]);

  useEffect(() => {
    localStorage.setItem('edugenie_paths', JSON.stringify(paths));
  }, [paths]);

  useEffect(() => {
    localStorage.setItem('edugenie_active_path_id', activePathId);
  }, [activePathId]);

  useEffect(() => {
    localStorage.setItem('edugenie_forum_posts', JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem('edugenie_quiz_history', JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    localStorage.setItem('edugenie_diagnostic', JSON.stringify(diagnostic));
  }, [diagnostic]);

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
  const activePath = paths.find(p => p.id === activePathId) || paths[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch Active Path
  const handleSelectPath = (pathId: string) => {
    setActivePathId(pathId);
    showToast(`Switched active path to: ${paths.find(p => p.id === pathId)?.title}`);
  };

  // Add newly AI-generated path
  const handlePathCreated = (newPath: LearningPath) => {
    setPaths(prev => [newPath, ...prev]);
    setActivePathId(newPath.id);
    setActiveTab('path');
    showToast(`Created personalized AI path: ${newPath.title}!`);
  };

  // Update Milestone Status
  const handleUpdateMilestoneStatus = (milestoneId: string, newStatus: 'completed' | 'in_progress' | 'locked') => {
    setPaths(prev => prev.map(path => {
      if (path.id !== activePath.id) return path;

      const updatedMilestones = path.milestones.map(m => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status: newStatus,
            masteryScore: newStatus === 'completed' && m.masteryScore < 80 ? 85 : m.masteryScore,
          };
        }
        return m;
      });

      // Recalculate path mastery
      const totalScore = updatedMilestones.reduce((acc, curr) => acc + curr.masteryScore, 0);
      const overallMasteryPct = Math.round(totalScore / updatedMilestones.length);

      return {
        ...path,
        milestones: updatedMilestones,
        overallMasteryPct,
      };
    }));

    // Also update student profile overall mastery
    setProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        return { ...p, overallMasteryPct: Math.min(98, p.overallMasteryPct + 2) };
      }
      return p;
    }));

    showToast(`Updated milestone status to: ${newStatus.replace('_', ' ')}`);
  };

  // Launch Quiz from any Milestone
  const handleStartQuizForMilestone = (milestone: Milestone) => {
    setTargetMilestoneForQuiz(milestone);
    setActiveTab('quiz');
  };

  // Record Quiz Result & Dynamically update Mastery
  const handleRecordQuizResult = (result: QuizAttemptResult, percentageScore?: number) => {
    setQuizHistory(prev => [result, ...prev]);

    // Update milestone mastery in active path
    setPaths(prev => prev.map(path => {
      if (path.id !== activePath.id) return path;

      let milestoneUpdated = false;
      const updatedMilestones = path.milestones.map(m => {
        if (m.title === result.milestoneTitle || m.id === targetMilestoneForQuiz?.id) {
          milestoneUpdated = true;
          const newScore = Math.max(m.masteryScore, result.percentage);
          const newStatus = newScore >= 75 ? 'completed' : m.status;
          return {
            ...m,
            masteryScore: newScore,
            status: newStatus,
          };
        }
        return m;
      });

      // Unlock next milestone if completed
      if (result.percentage >= 75) {
        for (let i = 0; i < updatedMilestones.length - 1; i++) {
          if (updatedMilestones[i].status === 'completed' && updatedMilestones[i + 1].status === 'locked') {
            updatedMilestones[i + 1].status = 'in_progress';
            break;
          }
        }
      }

      // Recompute path mastery
      const avgMastery = Math.round(
        updatedMilestones.reduce((sum, m) => sum + m.masteryScore, 0) / updatedMilestones.length
      );

      // Boost related competencies
      const updatedCompetencies = path.competencies.map(c => ({
        ...c,
        levelPct: Math.min(100, Math.round(c.levelPct + (result.percentage >= 75 ? 4 : 1))),
      }));

      return {
        ...path,
        milestones: updatedMilestones,
        overallMasteryPct: avgMastery,
        competencies: updatedCompetencies,
      };
    }));

    // Update Profile statistics
    setProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        return {
          ...p,
          quizzesCompleted: p.quizzesCompleted + 1,
          totalStudyHours: Number((p.totalStudyHours + 0.5).toFixed(1)),
          overallMasteryPct: Math.min(99, Math.round(p.overallMasteryPct + (result.percentage >= 75 ? 3 : 1))),
        };
      }
      return p;
    }));

    showToast(`Assessment recorded! Mastery score updated (+${result.percentage >= 75 ? '5' : '2'}% mastery)`);
  };

  // Forum Actions
  const handleAddForumPost = (newPost: ForumPost) => {
    setForumPosts(prev => [newPost, ...prev]);
    showToast('Your discussion topic was published to the peer forum!');
  };

  const handleAddForumReply = (postId: string, reply: ForumReply) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, reply],
        };
      }
      return post;
    }));

    if (reply.role === 'student') {
      showToast('Your peer answer was posted!');
    }
  };

  const handleUpvotePost = (postId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, upvotes: post.upvotes + 1 };
      }
      return post;
    }));
  };

  const handleUpvoteReply = (postId: string, replyId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.map(r => r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r),
        };
      }
      return post;
    }));
  };

  const handleMarkSolution = (postId: string, replyId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasAcceptedSolution: true,
          replies: post.replies.map(r => r.id === replyId ? { ...r, isAcceptedSolution: true } : r),
        };
      }
      return post;
    }));

    // Reward student with an accepted solution count in profile
    setProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        return { ...p, forumSolutionsProvided: p.forumSolutionsProvided + 1 };
      }
      return p;
    }));

    showToast('Marked as verified accepted solution!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-800 border border-indigo-500/50 text-white text-xs font-medium shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePath={activePath}
        allPaths={paths}
        onSelectPath={handleSelectPath}
        onOpenCreatePathModal={() => setIsCreateModalOpen(true)}
        currentProfile={currentProfile}
        allProfiles={profiles}
        onSelectProfile={setCurrentProfileId}
      />

      {/* Primary View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            activePath={activePath}
            currentProfile={currentProfile}
            quizHistory={quizHistory}
            onStartQuizForMilestone={handleStartQuizForMilestone}
            onNavigateToTab={setActiveTab}
            onOpenCreatePath={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'path' && (
          <LearningPathView
            activePath={activePath}
            allPaths={paths}
            onSelectPath={handleSelectPath}
            onUpdateMilestoneStatus={handleUpdateMilestoneStatus}
            onStartQuizForMilestone={handleStartQuizForMilestone}
            onNavigateToForumForTopic={(topicTitle) => {
              setActiveTab('forum');
            }}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizEngineView
            activePath={activePath}
            currentMilestone={targetMilestoneForQuiz}
            onRecordQuizResult={handleRecordQuizResult}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'forum' && (
          <PeerForumView
            posts={forumPosts}
            currentProfile={currentProfile}
            onAddPost={handleAddForumPost}
            onAddReply={handleAddForumReply}
            onUpvotePost={handleUpvotePost}
            onUpvoteReply={handleUpvoteReply}
            onMarkSolution={handleMarkSolution}
          />
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticCoachView
            diagnostic={diagnostic}
            activePath={activePath}
            currentProfile={currentProfile}
            quizHistory={quizHistory}
            onUpdateDiagnostic={setDiagnostic}
            onNavigateToTab={setActiveTab}
          />
        )}
      </main>

      {/* Modal: Create New AI Learning Path */}
      <CreatePathModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPathCreated={handlePathCreated}
      />

      {/* Quiet Aesthetic Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EduGenie: Google Gemini Powered Learning Assistant & Mastery Platform</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Adaptive AI Paths</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Mastery</span>
            <span aria-hidden="true">·</span>
            <span>Peer Collaboration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
