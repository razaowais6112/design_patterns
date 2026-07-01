import type { PatternData } from './types';

export const categories = {
  creational: {
    id: 'creational',
    name: 'Creational',
    slug: '/creational',
    description: 'Concerned with how objects are created, ensuring flexibility and reuse in object instantiation.'
  },
  structural: {
    id: 'structural',
    name: 'Structural',
    slug: '/structural',
    description: 'Concerned with how objects and classes are composed together to form larger structures.'
  },
  behavioral: {
    id: 'behavioral',
    name: 'Behavioral',
    slug: '/behavioral',
    description: 'Concerned with how objects communicate and behave, assigning responsibilities between them.'
  },
  'data-access': {
    id: 'data-access',
    name: 'Data Access',
    slug: '/data-access',
    description: 'Concerned with how application logic is decoupled from data persistence — not part of the original Gang of Four catalog, included here because it\'s commonly used alongside them in real systems.'
  }
} as const;

export const categoryPatterns: Record<string, string[]> = {
  creational: ['factory', 'builder', 'singleton'],
  structural: ['adapter', 'facade'],
  behavioral: ['observer', 'iterator', 'strategy', 'state'],
  'data-access': ['repository']
};

export function getPrevPattern(patterns: PatternData[], slug: string): PatternData | null {
  const idx = patterns.findIndex(p => p.slug === slug);
  return idx > 0 ? patterns[idx - 1] : null;
}

export function getNextPattern(patterns: PatternData[], slug: string): PatternData | null {
  const idx = patterns.findIndex(p => p.slug === slug);
  return idx < patterns.length - 1 ? patterns[idx + 1] : null;
}
