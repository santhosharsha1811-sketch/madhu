import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  Tag, 
  User, 
  CornerDownRight, 
  Send,
  HelpCircle,
  Award,
  Share2,
  Clock
} from 'lucide-react';
import { ForumPost, ForumReply, StudentProfile } from '../types';

interface PeerForumViewProps {
  posts: ForumPost[];
  currentProfile: StudentProfile;
  initialTopicFilter?: string;
  onAddPost: (newPost: ForumPost) => void;
  onAddReply: (postId: string, reply: ForumReply) => void;
  onUpvotePost: (postId: string) => void;
  onUpvoteReply: (postId: string, replyId: string) => void;
  onMarkSolution: (postId: string, replyId: string) => void;
}

export const PeerForumView: React.FC<PeerForumViewProps> = ({
  posts,
  currentProfile,
  initialTopicFilter,
  onAddPost,
  onAddReply,
  onUpvotePost,
  onUpvoteReply,
  onMarkSolution,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unanswered' | 'solved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // New post modal
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCodeSnippet, setNewCodeSnippet] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Web Dev & Architecture');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('');

  // Reply state
  const [replyContent, setReplyContent] = useState<string>('');
  const [isAiReplying, setIsAiReplying] = useState<boolean>(false);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
    if (statusFilter === 'unanswered' && post.replies.length > 0) return false;
    if (statusFilter === 'solved' && !post.hasAcceptedSolution) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTags = post.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }
    return true;
  });

  const activePost = posts.find(p => p.id === activePostId);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      ? newTags.split(',').map(t => t.trim()).filter(Boolean)
      : ['Peer Learning', newCategory];

    const createdPost: ForumPost = {
      id: 'post-' + Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      codeSnippet: newCodeSnippet.trim() || undefined,
      author: currentProfile.name,
      avatar: currentProfile.avatar,
      category: newCategory,
      relatedTopic: newTopic.trim() || newCategory,
      timestamp: 'Just now',
      upvotes: 1,
      hasAcceptedSolution: false,
      replies: [],
      tags: tagsArray,
    };

    onAddPost(createdPost);
    setIsCreatingPost(false);
    setNewTitle('');
    setNewContent('');
    setNewCodeSnippet('');
    setNewTopic('');
    setNewTags('');
    setActivePostId(createdPost.id);
  };

  const handleSendReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const reply: ForumReply = {
      id: 'reply-' + Date.now(),
      author: currentProfile.name,
      avatar: currentProfile.avatar,
      role: 'student',
      badge: 'Peer Contributor',
      content: replyContent.trim(),
      timestamp: 'Just now',
      upvotes: 0,
      isAcceptedSolution: false,
    };

    onAddReply(postId, reply);
    setReplyContent('');
  };

  const handleSummonAiMentor = async (post: ForumPost) => {
    setIsAiReplying(true);
    try {
      const res = await fetch('/api/forum/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postTitle: post.title,
          postContent: post.content,
          topic: post.relatedTopic || post.category,
          existingRepliesCount: post.replies.length,
        }),
      });
      const data = await res.json();

      const aiReply: ForumReply = {
        id: 'reply-ai-' + Date.now(),
        author: data.author || 'EduGenie AI Peer Mentor',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=EduGenie',
        role: 'ai_mentor',
        badge: 'AI Study Partner',
        content: data.replyText,
        timestamp: 'Just now',
        upvotes: 1,
        isAcceptedSolution: false,
      };

      onAddReply(post.id, aiReply);
    } catch (err) {
      console.error('Failed to summon AI mentor:', err);
    } finally {
      setIsAiReplying(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Forum Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Collaborative Student Network</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Peer-to-Peer Discussion Forum
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Ask questions, debate architectural trade-offs, share mental models, and support each other's educational mastery.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPost(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Discussion</span>
        </button>
      </div>

      {/* Main Grid: Thread List vs Active Post Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List of Discussions (5 cols if post open, 12 cols if none selected) */}
        <div className={activePostId ? 'lg:col-span-5 space-y-4' : 'lg:col-span-12 space-y-4'}>
          {/* Search & Category Filter Controls */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions by keyword, concept, or tag..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {['All', 'Web Dev & Architecture', 'Algorithms & Logic', 'Study Circles'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2 py-1 rounded ${statusFilter === 'all' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('unanswered')}
                  className={`px-2 py-1 rounded ${statusFilter === 'unanswered' ? 'bg-slate-700 text-amber-300 font-medium' : 'text-slate-400'}`}
                >
                  Unanswered
                </button>
                <button
                  onClick={() => setStatusFilter('solved')}
                  className={`px-2 py-1 rounded ${statusFilter === 'solved' ? 'bg-slate-700 text-emerald-300 font-medium' : 'text-slate-400'}`}
                >
                  Solved
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <p className="text-xs text-slate-400">No discussions match this filter.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setStatusFilter('all'); setSearchQuery(''); }}
                  className="text-xs text-indigo-400 hover:underline font-medium"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredPosts.map(post => {
                const isSelected = activePostId === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => setActivePostId(post.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                      isSelected
                        ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-slate-300 font-semibold">{post.author}</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.timestamp}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-indigo-400">{post.category}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </div>

                      {post.hasAcceptedSolution && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Solved</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Metadata & Reactions */}
                    <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpvotePost(post.id);
                          }}
                          className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.upvotes}</span>
                        </button>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.replies.length} replies</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px]">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-slate-400">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Discussion Detail Reader (7 cols) */}
        {activePost && (
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700/80 p-6 space-y-6">
              {/* Question Header */}
              <div className="space-y-3 pb-4 border-b border-slate-700/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activePost.avatar}
                      alt={activePost.author}
                      className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{activePost.author}</div>
                      <div className="text-[11px] text-slate-400">{activePost.timestamp} · {activePost.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpvotePost(activePost.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{activePost.upvotes}</span>
                    </button>
                    <button
                      onClick={() => setActivePostId(null)}
                      className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                    >
                      Close ✕
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-extrabold text-white leading-snug">
                  {activePost.title}
                </h2>

                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {activePost.content}
                </div>

                {/* Optional Code Snippet */}
                {activePost.codeSnippet && (
                  <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                    <pre>{activePost.codeSnippet}</pre>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {activePost.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Peer Mentor Summon CTA */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>EduGenie AI Peer Study Partner</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Stuck or want a structured mental model breakdown to kick off peer discussion?
                  </p>
                </div>
                <button
                  onClick={() => handleSummonAiMentor(activePost)}
                  disabled={isAiReplying}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiReplying ? 'AI Generating Insight...' : 'Summon AI Peer Assist'}</span>
                </button>
              </div>

              {/* Peer Replies List */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {activePost.replies.length} Collaborative Responses
                </div>

                {activePost.replies.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No responses yet. Be the first peer to provide an answer or summon AI assist!
                  </p>
                ) : (
                  activePost.replies.map(reply => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-xl border space-y-3 ${
                        reply.isAcceptedSolution
                          ? 'bg-emerald-950/20 border-emerald-800/60'
                          : reply.role === 'ai_mentor'
                          ? 'bg-indigo-950/20 border-indigo-800/50'
                          : 'bg-slate-850 border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={reply.avatar}
                            alt={reply.author}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{reply.author}</span>
                              {reply.badge && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                                  reply.role === 'ai_mentor'
                                    ? 'text-cyan-300 bg-cyan-950/60 border-cyan-800/60'
                                    : 'text-indigo-300 bg-indigo-950/60 border-indigo-800/60'
                                }`}>
                                  {reply.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{reply.timestamp}</div>
                          </div>
                        </div>

                        {reply.isAcceptedSolution && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accepted Solution</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                        {reply.content}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs">
                        <button
                          onClick={() => onUpvoteReply(activePost.id, reply.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{reply.upvotes}</span>
                        </button>

                        {!activePost.hasAcceptedSolution && (
                          <button
                            onClick={() => onMarkSolution(activePost.id, reply.id)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Accepted Solution</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Input Box */}
              <div className="pt-2 border-t border-slate-700/60 space-y-3">
                <div className="text-xs font-bold text-white">Contribute a Peer Answer</div>
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Share your insight, mental model, or code example to help your fellow student..."
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSendReply(activePost.id)}
                      disabled={!replyContent.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Answer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Create New Discussion Thread */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Start a Peer Discussion</h3>
              </div>
              <button
                onClick={() => setIsCreatingPost(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Discussion Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How do you manage backpressure in Node.js event streams?"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Web Dev & Architecture">Web Dev & Architecture</option>
                    <option value="Algorithms & Logic">Algorithms & Logic</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Study Circles">Study Circles</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Related Concept / Milestone</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Milestone 3: Full-Stack Edge Services"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Question Content</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your current mental model, what you've attempted, and where you are getting stuck..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  value={newCodeSnippet}
                  onChange={(e) => setNewCodeSnippet(e.target.value)}
                  placeholder="// Paste your relevant code or pseudocode here..."
                  className="w-full p-2.5 bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Streams, Backpressure, Nodejs"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
