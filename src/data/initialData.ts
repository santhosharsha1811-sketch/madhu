import { LearningPath, StudentProfile, ForumPost, DiagnosticReport, QuizAttemptResult } from '../types';

export const initialProfiles: StudentProfile[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: 'Computer Science Major · Aspiring Full-Stack & AI Systems Engineer',
    currentStreakDays: 14,
    totalStudyHours: 42.5,
    overallMasteryPct: 76,
    quizzesCompleted: 12,
    forumSolutionsProvided: 5,
    activePathId: 'path-fullstack',
  },
  {
    id: 'user-2',
    name: 'Sophia Patel',
    email: 'sophia.patel@student.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    headline: 'Data Science & Machine Learning Researcher',
    currentStreakDays: 8,
    totalStudyHours: 29.0,
    overallMasteryPct: 84,
    quizzesCompleted: 9,
    forumSolutionsProvided: 8,
    activePathId: 'path-ml',
  },
];

export const initialPaths: LearningPath[] = [
  {
    id: 'path-fullstack',
    title: 'Full-Stack Modern Web & Cloud Architecture',
    description: 'Personalized AI path taking you from core mental models of modern web development to distributed services, state immutability, and containerized deployment.',
    category: 'Computer Science',
    targetLevel: 'Intermediate to Advanced',
    estimatedWeeks: 8,
    weeklyHours: 10,
    overallMasteryPct: 76,
    aiCoachTip: 'Your state management mastery is strong (82%), but your asynchronous caching and edge-case error handling need targeted review before the capstone deployment.',
    competencies: [
      { name: 'Core Foundations & DOM Architecture', levelPct: 94, category: 'Fundamentals' },
      { name: 'State Predictability & Immutability', levelPct: 82, category: 'Engineering' },
      { name: 'API Contracts & Distributed Sync', levelPct: 68, category: 'Backend' },
      { name: 'Performance & Bundle Optimization', levelPct: 60, category: 'System Design' },
    ],
    milestones: [
      {
        id: 'm1',
        order: 1,
        title: 'Modern Reactive Paradigms & Virtual DOM',
        description: 'Deep dive into unidirectional data flow, reconciliation mechanisms, and fiber scheduling.',
        difficulty: 'Beginner',
        estimatedHours: 8,
        keyConcepts: ['Reconciliation', 'Pure Components', 'Hook Lifecycles', 'Synthetic Events'],
        practicalTask: 'Build an interactive performance-benchmarked tree renderer that tracks render cycles.',
        status: 'completed',
        masteryScore: 92,
        prerequisites: ['ESNext JavaScript', 'DOM Basics'],
      },
      {
        id: 'm2',
        order: 2,
        title: 'State Architecture & Invariant Guarantees',
        description: 'Structure complex deterministic application states using state machines and immutable stores.',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        keyConcepts: ['Finite State Machines', 'Context Separation', 'Optimistic UI', 'Race Conditions'],
        practicalTask: 'Implement an offline-first collaborative task canvas with rollback capability.',
        status: 'completed',
        masteryScore: 84,
        prerequisites: ['Reactive Paradigms'],
      },
      {
        id: 'm3',
        order: 3,
        title: 'Full-Stack Edge Services & Async Pipelines',
        description: 'Design low-latency proxy APIs, background task orchestrators, and streaming endpoints.',
        difficulty: 'Intermediate',
        estimatedHours: 14,
        keyConcepts: ['Server-Sent Events', 'Edge Caching', 'Backpressure Handling', 'Bearer Auth'],
        practicalTask: 'Develop an AI-assisted live markdown preview server with chunked streaming.',
        status: 'in_progress',
        masteryScore: 68,
        prerequisites: ['State Architecture'],
      },
      {
        id: 'm4',
        order: 4,
        title: 'Scalability, Security & Distributed Deployment',
        description: 'Synthesize microservices, implement rate limiting, CORS hygiene, and load test endpoints.',
        difficulty: 'Advanced',
        estimatedHours: 16,
        keyConcepts: ['Dockerization', 'Load Balancing', 'OWASP Top 10 Hygiene', 'Zero-Downtime Releases'],
        practicalTask: 'Deploy an audited production application with real-time telemetry and health checkpoints.',
        status: 'locked',
        masteryScore: 0,
        prerequisites: ['Full-Stack Edge Services'],
      },
    ],
  },
  {
    id: 'path-ml',
    title: 'Generative AI & Gemini Application Engineering',
    description: 'Master prompting architecture, structured outputs, multi-modal pipelines, and RAG architectures using modern Gemini SDK.',
    category: 'Artificial Intelligence',
    targetLevel: 'Advanced',
    estimatedWeeks: 6,
    weeklyHours: 12,
    overallMasteryPct: 62,
    aiCoachTip: 'Focus on schema-constrained JSON output generation and low-latency streaming paradigms to reduce time-to-first-token in your applications.',
    competencies: [
      { name: 'Prompt Engineering & System Directives', levelPct: 88, category: 'Fundamentals' },
      { name: 'Structured JSON Schemas & Type Enums', levelPct: 75, category: 'Engineering' },
      { name: 'Multi-modal Ingestion (Audio/Vision)', levelPct: 54, category: 'Applied AI' },
      { name: 'Grounding & Tool Integration', levelPct: 42, category: 'Advanced' },
    ],
    milestones: [
      {
        id: 'ml-m1',
        order: 1,
        title: 'Foundations of Modern LLMs & Prompt Anatomy',
        description: 'Understand tokenization, temperature scaling, system prompts, and context window limits.',
        difficulty: 'Beginner',
        estimatedHours: 6,
        keyConcepts: ['Context Windows', 'Temperature & TopP', 'Few-shot Priming', 'Hallucination Mitigation'],
        practicalTask: 'Build a prompt evaluation test suite comparing zero-shot vs few-shot output fidelity.',
        status: 'completed',
        masteryScore: 90,
        prerequisites: ['Basic Python or TypeScript'],
      },
      {
        id: 'ml-m2',
        order: 2,
        title: 'Structured Output Engineering with Schema Typing',
        description: 'Force deterministic JSON representations using Type enums and schema constraints.',
        difficulty: 'Intermediate',
        estimatedHours: 10,
        keyConcepts: ['JSON Schema Enums', 'Type Specifications', 'Field Validation', 'Failover Parsers'],
        practicalTask: 'Create an automated data ingestion pipeline that parses unstructured medical records into validated schema records.',
        status: 'in_progress',
        masteryScore: 65,
        prerequisites: ['Foundations of LLMs'],
      },
      {
        id: 'ml-m3',
        order: 3,
        title: 'Function Calling & Agentic Tool Invocations',
        description: 'Equip models with custom tools, external search grounding, and self-correcting loops.',
        difficulty: 'Advanced',
        estimatedHours: 14,
        keyConcepts: ['Function Declarations', 'Hybrid Grounding', 'Multi-turn Execution', 'Tool Response Injection'],
        practicalTask: 'Build an autonomous research agent that queries live data APIs and synthesizes analytical briefs.',
        status: 'locked',
        masteryScore: 0,
        prerequisites: ['Structured Output Engineering'],
      },
    ],
  },
  {
    id: 'path-dsa',
    title: 'Data Structures, Algorithms & Problem Solving',
    description: 'Systematic approach to mastering tree traversals, dynamic programming, graph algorithms, and algorithmic complexity.',
    category: 'Computer Science',
    targetLevel: 'Intermediate',
    estimatedWeeks: 10,
    weeklyHours: 8,
    overallMasteryPct: 45,
    aiCoachTip: 'Strengthen recursive tree traversals before transitioning to complex DAG topological sorting and memoization.',
    competencies: [
      { name: 'Asymptotic Analysis & Big-O', levelPct: 92, category: 'Theory' },
      { name: 'Linear Structures & Hash Maps', levelPct: 80, category: 'Data Structures' },
      { name: 'Binary Trees & Graph Traversals', levelPct: 52, category: 'Algorithms' },
      { name: 'Dynamic Programming & Memoization', levelPct: 30, category: 'Advanced' },
    ],
    milestones: [
      {
        id: 'dsa-1',
        order: 1,
        title: 'Asymptotic Complexity & Memory Models',
        description: 'Evaluate time vs space trade-offs, cache locality, and worst-case scenarios.',
        difficulty: 'Beginner',
        estimatedHours: 6,
        keyConcepts: ['Big-O / Big-Theta', 'Stack vs Heap', 'Cache Lines', 'Amortized Analysis'],
        practicalTask: 'Write a comparative micro-benchmark measuring array resizing vs linked node traversal.',
        status: 'completed',
        masteryScore: 94,
        prerequisites: ['High school algebra'],
      },
      {
        id: 'dsa-2',
        order: 2,
        title: 'Tree Representations & Graph Traversal Protocols',
        description: 'Implement BFS, DFS, Dijkstra, and cycle detection in directed graphs.',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        keyConcepts: ['Adjacency Lists', 'BFS Queues', 'DFS Callstacks', 'Cycle Invariants'],
        practicalTask: 'Implement a maze routing engine that visualizes shortest paths using Dijkstra.',
        status: 'in_progress',
        masteryScore: 50,
        prerequisites: ['Asymptotic Complexity'],
      },
    ],
  },
];

export const initialForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    title: 'How do you prevent race conditions when handling optimistic UI updates?',
    content: `Hey everyone! I'm currently working on Milestone 2 (State Architecture). When a user quickly toggles an item status multiple times, my optimistic UI update sometimes gets overwritten by a delayed network response from an earlier click. 

What is the recommended design pattern to discard stale responses or sequence optimistic rollbacks without glitching the interface?`,
    codeSnippet: `// Current problematic implementation:
async function handleToggle(id, newState) {
  setLocalState(prev => ({ ...prev, [id]: newState }));
  const res = await api.update(id, newState);
  // If an earlier request resolves after this, localState gets outdated!
  setLocalState(prev => ({ ...prev, [id]: res.serverState }));
}`,
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: 'Web Dev & Architecture',
    relatedTopic: 'State Architecture',
    timestamp: '2 hours ago',
    upvotes: 14,
    hasAcceptedSolution: true,
    tags: ['State Management', 'Optimistic UI', 'Race Conditions'],
    replies: [
      {
        id: 'reply-1',
        author: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'student',
        badge: 'Top Contributor',
        content: `I faced this exact issue last week! The cleanest pattern is attaching an incremental version counter or timestamp token to every dispatch. 

When the response arrives, compare its request timestamp against the highest completed timestamp for that entity ID. If \`response.requestId < currentActiveId\`, simply ignore the payload.

Alternatively, use \`AbortController\` to cancel previous in-flight requests for that specific entity whenever a new action is triggered!`,
        timestamp: '1 hour ago',
        upvotes: 9,
        isAcceptedSolution: true,
      },
      {
        id: 'reply-2',
        author: 'EduGenie AI Peer Mentor',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=EduGenie',
        role: 'ai_mentor',
        badge: 'AI Study Partner',
        content: `Both Alex's recommendations are spot on! 

To add an architectural insight: in distributed systems, this is known as the **Last-Write-Wins (LWW) with Monotonic Clocks** pattern. 

Here is how you can implement the AbortController pattern:
\`\`\`js
const abortControllers = useRef(new Map());

async function handleToggle(id, newState) {
  if (abortControllers.current.has(id)) {
    abortControllers.current.get(id).abort();
  }
  const controller = new AbortController();
  abortControllers.current.set(id, controller);

  try {
    const res = await api.update(id, newState, { signal: controller.signal });
    // Process only if not aborted
  } catch (err) {
    if (err.name !== 'AbortError') handleRollback(id);
  }
}
\`\`\`
Notice how handling \`AbortError\` gracefully prevents unwanted rollback triggers. Have you tried checking your network tab with simulated 3G latency to verify this?`,
        timestamp: '45 mins ago',
        upvotes: 12,
        isAcceptedSolution: false,
      },
    ],
  },
  {
    id: 'post-2',
    title: 'Intuitive mental model for Dijkstra vs A* Search?',
    content: `I am going through the Graph Algorithms milestone. I can write the code for Dijkstra with a Priority Queue, but I struggle to explain conceptually to my study circle why A* is faster for point-to-point pathfinding. Can someone give a practical physical analogy?`,
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    category: 'Algorithms & Logic',
    relatedTopic: 'Graph Algorithms',
    timestamp: '4 hours ago',
    upvotes: 21,
    hasAcceptedSolution: false,
    tags: ['Graph Theory', 'Dijkstra', 'A* Algorithm', 'Mental Models'],
    replies: [
      {
        id: 'reply-3',
        author: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        role: 'student',
        badge: 'Peer Tutor',
        content: `Imagine you drop a bucket of water on the floor. 
Dijkstra is like water spreading uniformly in every single direction equally (a concentric circle) until it touches your target point. It is completely blind to where the target actually lies.

A* is like adding a magnet or gravitational pull towards your destination. It still spreads like water, but the water is biased to rush towards the target side first because of the heuristic distance function!`,
        timestamp: '2 hours ago',
        upvotes: 18,
      },
    ],
  },
  {
    id: 'post-3',
    title: 'Study Group: Preparing for the Gemini Generative AI Structured Output Quiz!',
    content: `Anyone want to pair up for practicing schema definitions and tool-calling edge cases? We have a live study circle tomorrow at 6 PM UTC. We will review how to construct type enums, validate response payloads, and handle fallback strategies when a model hallucinates unexpected fields.`,
    author: 'Jordan Hayes',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    category: 'Study Circles',
    relatedTopic: 'Generative AI Engineering',
    timestamp: '6 hours ago',
    upvotes: 11,
    hasAcceptedSolution: false,
    tags: ['Study Group', 'Gemini AI', 'Assessment Prep'],
    replies: [],
  },
];

export const initialQuizHistory: QuizAttemptResult[] = [
  {
    quizId: 'q-history-1',
    topic: 'Full-Stack Modern Web',
    milestoneTitle: 'Modern Reactive Paradigms & Virtual DOM',
    score: 4,
    total: 4,
    percentage: 100,
    timestamp: 'Yesterday at 3:15 PM',
    userAnswers: [1, 2, 0, 1],
  },
  {
    quizId: 'q-history-2',
    topic: 'Full-Stack Modern Web',
    milestoneTitle: 'State Architecture & Invariant Guarantees',
    score: 3,
    total: 4,
    percentage: 75,
    timestamp: '2 days ago',
    userAnswers: [1, 1, 3, 1],
  },
  {
    quizId: 'q-history-3',
    topic: 'Generative AI Engineering',
    milestoneTitle: 'Foundations of Modern LLMs & Prompt Anatomy',
    score: 4,
    total: 4,
    percentage: 100,
    timestamp: '3 days ago',
    userAnswers: [2, 0, 1, 3],
  },
];

export const initialDiagnostic: DiagnosticReport = {
  assessmentSummary: 'High conceptual retention across reactive rendering and component lifecycle architecture, with a targeted need to reinforce asynchronous error boundaries and race-condition resolution.',
  strengths: [
    'Consistent daily active streak (14 Days) showing disciplined spaced repetition',
    'Perfect scores on Virtual DOM and Prompt Anatomy foundational assessments',
    'Active collaborative contributor in peer discussion forums',
  ],
  criticalFocusAreas: [
    'Asynchronous state cancellation (AbortController & monotonic request IDs)',
    'Distributed cache invalidation strategies',
    'Edge latency optimization under degraded network connectivity',
  ],
  threeDaySprint: [
    {
      day: 'Day 1',
      action: 'Deconstruct optimistic race condition bug in sandbox',
      targetOutput: 'Pass all 3 automated test cases using AbortController',
      estimatedMinutes: 20,
    },
    {
      day: 'Day 2',
      action: 'Take the adaptive milestone quiz on Full-Stack Edge Services',
      targetOutput: 'Achieve 85%+ mastery on async pipeline questions',
      estimatedMinutes: 25,
    },
    {
      day: 'Day 3',
      action: 'Synthesize learning by answering 1 peer question in the forum',
      targetOutput: 'Reinforce mental models through peer teaching (Feynman Technique)',
      estimatedMinutes: 15,
    },
  ],
  coachEncouragement: 'You have entered the cognitive acceleration zone where theoretical concepts turn into instinctual engineering reflexes. Stay consistent on the 3-day recovery sprint!',
  generatedAt: 'Today at 08:30 AM',
};
