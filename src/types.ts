export interface Competency {
  name: string;
  levelPct: number;
  category: string;
}

export interface Milestone {
  id: string;
  order: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  estimatedHours: number;
  keyConcepts: string[];
  practicalTask: string;
  status: 'completed' | 'in_progress' | 'locked';
  masteryScore: number;
  prerequisites: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  targetLevel: string;
  estimatedWeeks: number;
  weeklyHours: number;
  overallMasteryPct: number;
  aiCoachTip: string;
  competencies: Competency[];
  milestones: Milestone[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  socraticHint: string;
  conceptTested: string;
}

export interface Quiz {
  quizId: string;
  topic: string;
  milestoneTitle: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface QuizAttemptResult {
  quizId: string;
  topic: string;
  milestoneTitle: string;
  score: number;
  total: number;
  percentage: number;
  timestamp: string;
  userAnswers: number[];
}

export interface ForumReply {
  id: string;
  author: string;
  avatar: string;
  role: 'student' | 'ai_mentor' | 'peer_tutor';
  badge?: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isAcceptedSolution?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  codeSnippet?: string;
  author: string;
  avatar: string;
  category: string;
  relatedTopic: string;
  timestamp: string;
  upvotes: number;
  hasAcceptedSolution: boolean;
  replies: ForumReply[];
  tags: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  currentStreakDays: number;
  totalStudyHours: number;
  overallMasteryPct: number;
  quizzesCompleted: number;
  forumSolutionsProvided: number;
  activePathId: string;
}

export interface DiagnosticSprintItem {
  day: string;
  action: string;
  targetOutput: string;
  estimatedMinutes: number;
}

export interface DiagnosticReport {
  assessmentSummary: string;
  strengths: string[];
  criticalFocusAreas: string[];
  threeDaySprint: DiagnosticSprintItem[];
  coachEncouragement: string;
  generatedAt: string;
}
