export type Language = 'python' | 'javascript' | 'java';

export interface CodeExample {
  python: string;
  javascript: string;
  java: string;
}

export interface PatternCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface PatternData {
  id: string;
  name: string;
  slug: string;
  category: PatternCategory;
  intent: string;
  order: number;
  problem: {
    narrative: string;
    code: CodeExample;
    painPoints: string[];
  };
  solution: {
    narrative: string;
    code: CodeExample;
    changes: string;
  };
  whyUsed: string[];
  realWorldExamples: string[];
  dos: string[];
  donts: string[];
  relatedPatterns: Array<{
    name: string;
    slug: string;
    distinction: string;
  }>;
  interactiveType: 'toggle' | 'dropdown' | 'live-visualization' | 'step-through' | 'diagram-only';
  themeNote?: string;
}

export const PATTERN_ORDER = [
  'factory', 'builder', 'singleton',
  'adapter', 'facade',
  'observer', 'iterator', 'strategy', 'state',
  'repository'
] as const;
