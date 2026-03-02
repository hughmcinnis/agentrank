import fs from 'fs';
import path from 'path';
import { Agent, Post, Comment, Like, Challenge } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'community');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filename: string): T[] {
  ensureDir();
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeJSON<T>(filename: string, data: T[]) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// Challenges (ephemeral, in-memory is fine for V1, but use file for serverless)
function readChallenges(): Challenge[] {
  return readJSON<Challenge>('challenges.json');
}
function writeChallenges(data: Challenge[]) {
  writeJSON('challenges.json', data);
}

export const store = {
  // Agents
  getAgents: () => readJSON<Agent>('agents.json'),
  getAgent: (id: string) => readJSON<Agent>('agents.json').find(a => a.id === id),
  getAgentByKeyHash: (hash: string) => readJSON<Agent>('agents.json').find(a => a.api_key_hash === hash),
  addAgent: (agent: Agent) => {
    const agents = readJSON<Agent>('agents.json');
    agents.push(agent);
    writeJSON('agents.json', agents);
  },
  updateAgent: (id: string, updates: Partial<Agent>) => {
    const agents = readJSON<Agent>('agents.json');
    const idx = agents.findIndex(a => a.id === id);
    if (idx >= 0) {
      agents[idx] = { ...agents[idx], ...updates };
      writeJSON('agents.json', agents);
    }
  },

  // Posts
  getPosts: () => readJSON<Post>('posts.json'),
  getPost: (id: string) => readJSON<Post>('posts.json').find(p => p.id === id),
  addPost: (post: Post) => {
    const posts = readJSON<Post>('posts.json');
    posts.push(post);
    writeJSON('posts.json', posts);
  },
  updatePost: (id: string, updates: Partial<Post>) => {
    const posts = readJSON<Post>('posts.json');
    const idx = posts.findIndex(p => p.id === id);
    if (idx >= 0) {
      posts[idx] = { ...posts[idx], ...updates };
      writeJSON('posts.json', posts);
    }
  },

  // Comments
  getComments: () => readJSON<Comment>('comments.json'),
  addComment: (comment: Comment) => {
    const comments = readJSON<Comment>('comments.json');
    comments.push(comment);
    writeJSON('comments.json', comments);
  },

  // Likes
  getLikes: () => readJSON<Like>('likes.json'),
  addLike: (like: Like) => {
    const likes = readJSON<Like>('likes.json');
    likes.push(like);
    writeJSON('likes.json', likes);
  },
  removeLike: (postId: string, agentId: string) => {
    const likes = readJSON<Like>('likes.json');
    writeJSON('likes.json', likes.filter(l => !(l.post_id === postId && l.agent_id === agentId)));
  },
  getLike: (postId: string, agentId: string) => {
    return readJSON<Like>('likes.json').find(l => l.post_id === postId && l.agent_id === agentId);
  },

  // Challenges
  addChallenge: (challenge: Challenge) => {
    const challenges = readChallenges();
    // Clean old challenges (>10 min)
    const now = Date.now();
    const fresh = challenges.filter(c => now - new Date(c.created_at).getTime() < 600000);
    fresh.push(challenge);
    writeChallenges(fresh);
  },
  getChallenge: (nonce: string) => {
    return readChallenges().find(c => c.nonce === nonce);
  },
  removeChallenge: (nonce: string) => {
    const challenges = readChallenges();
    writeChallenges(challenges.filter(c => c.nonce !== nonce));
  },
};
