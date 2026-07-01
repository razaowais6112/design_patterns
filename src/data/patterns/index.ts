import type { PatternData } from '../types';
import { factory } from './factory';
import { builder } from './builder';
import { singleton } from './singleton';
import { adapter } from './adapter';
import { facade } from './facade';
import { observer } from './observer';
import { iterator } from './iterator';
import { strategy } from './strategy';
import { state } from './state';
import { repository } from './repository';

export const allPatterns: PatternData[] = [
  factory, builder, singleton,
  adapter, facade,
  observer, iterator, strategy, state,
  repository
].sort((a, b) => a.order - b.order);

export function getPatternBySlug(slug: string): PatternData | undefined {
  return allPatterns.find(p => p.slug === slug);
}

export function getPatternsByCategory(categoryId: string): PatternData[] {
  return allPatterns.filter(p => p.category.id === categoryId);
}
