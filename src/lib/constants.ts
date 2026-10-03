import type { Category, CategoryId, DefaultTask } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'coding', label: 'Coding', emoji: '💻', chip: 'text-green border-green/30 bg-green/10', bar: 'bg-green' },
  { id: 'dsa', label: 'DSA', emoji: '🧩', chip: 'text-purple border-purple/30 bg-purple/10', bar: 'bg-purple' },
  { id: 'development', label: 'Development', emoji: '🏗️', chip: 'text-cyan border-cyan/30 bg-cyan/10', bar: 'bg-cyan' },
  { id: 'learning', label: 'Learning', emoji: '📚', chip: 'text-amber border-amber/30 bg-amber/10', bar: 'bg-amber' },
  { id: 'dbms', label: 'DBMS', emoji: '🗄️', chip: 'text-cyan border-cyan/30 bg-cyan/10', bar: 'bg-cyan' },
  { id: 'web', label: 'Web Development', emoji: '🌐', chip: 'text-purple border-purple/30 bg-purple/10', bar: 'bg-purple' },
  { id: 'skills', label: 'Skills', emoji: '🚀', chip: 'text-green border-green/30 bg-green/10', bar: 'bg-green' },
  { id: 'personal', label: 'Personal Goal', emoji: '🎯', chip: 'text-amber border-amber/30 bg-amber/10', bar: 'bg-amber' },
];

export const categoryOf = (id: CategoryId): Category => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];

export const INITIAL_DEFAULTS: DefaultTask[] = [
  { id: 'd-coding', title: 'Coding Practice', description: 'Improve programming skills', emoji: '💻', category: 'coding', enabled: true },
  { id: 'd-dsa', title: 'LeetCode / DSA Practice', description: 'Solve at least one problem', emoji: '🧩', category: 'dsa', enabled: true },
  { id: 'd-learning', title: 'Learning / Reading', description: 'Read docs, an article or a chapter', emoji: '📚', category: 'learning', enabled: true },
  { id: 'd-dbms', title: 'DBMS', description: 'SQL queries, normalization, concepts', emoji: '🗄️', category: 'dbms', enabled: true },
  { id: 'd-skills', title: 'Skills & Development', description: 'Build something, however small', emoji: '🚀', category: 'skills', enabled: true },
];

export const QUOTES: string[] = [
  'while (!success) { keepCoding(); }',
  '// One problem at a time.',
  'git commit -m "Another day of becoming better"',
  'const today = yesterday + 1; // that is enough',
  '// You do not need to be perfect. Just complete the next task.',
  'if (stuck) { takeBreak(); } else { ship(); }',
  'git push origin consistency',
  'try { learn(); } catch (bug) { learnMore(bug); }',
  '// Small commits build big projects.',
  'SELECT progress FROM life WHERE effort > 0;',
  'npm run build --self',
  '// Read the error message. It is on your side.',
  'for (const day of days) { improve(1); }',
  'return consistency > intensity;',
  '// Every expert once googled "what is a pointer".',
  'git commit -m "Keep improving"',
];

export const STORAGE_KEY = 'dev-todo:v1';
