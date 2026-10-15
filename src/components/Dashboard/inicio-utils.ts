import type { Issue, IssueStatus } from '@/types/Issue';

export const STALE_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export type Tone = 'neutral' | 'blue' | 'amber' | 'green';

// Same tones as StatusBadge.
export const STATUS_TONE: Record<IssueStatus, Tone> = {
  WAITING_FOR_FISCAL: 'neutral',
  WAITING_FOR_PROCEDURE: 'blue',
  WAITING_FOR_MANAGER: 'neutral',
  WAITING_FOR_MANAGER_RESOLUTION: 'blue',
  WAITING_FOR_RESOLUTION_VALIDATION: 'amber',
  SOLVED: 'green',
  CLOSED: 'neutral',
};

// Map pins need a little more contrast than the badge text colors.
export const TONE_HEX: Record<Tone, string> = {
  neutral: '#5B6680',
  blue: '#034EFF',
  amber: '#D97706',
  green: '#12A26B',
};

// Citizen progress bar: steps finished (of 4) and the step in progress. CLOSED has no bar.
export const PROGRESS: Partial<Record<IssueStatus, { done: number; current: number }>> = {
  WAITING_FOR_FISCAL: { done: 1, current: 1 },
  WAITING_FOR_PROCEDURE: { done: 1, current: 1 },
  WAITING_FOR_MANAGER: { done: 2, current: 2 },
  WAITING_FOR_MANAGER_RESOLUTION: { done: 2, current: 2 },
  WAITING_FOR_RESOLUTION_VALIDATION: { done: 3, current: 3 },
  SOLVED: { done: 4, current: -1 },
};

// Same 3-day rule as StatusBadge: waiting in the queue or without a verifier for too long.
export function isStale(issue: Issue, now = Date.now()): boolean {
  const waiting = issue.status === 'WAITING_FOR_FISCAL' || issue.status === 'WAITING_FOR_MANAGER';
  return waiting && now - Date.parse(issue.updatedAt) > STALE_DAYS * DAY_MS;
}

// "Precisa de atenção": the whole manager queue plus stale issues without a verifier, most stale first.
export function attentionIssues(issues: Issue[], limit = 5, now = Date.now()): Issue[] {
  return issues
    .filter(issue => issue.status === 'WAITING_FOR_MANAGER' || isStale(issue, now))
    .sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
    .slice(0, limit);
}
