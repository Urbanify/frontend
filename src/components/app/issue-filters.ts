import type { IssueStatus } from '@/types/Issue';

export type FilterKey = 'all' | 'in_progress' | 'needs_action' | 'resolved';

// Status groups behind the filter chips and the citizen and staff tabs. `null` means every status.
export const FILTER_STATUSES: Record<FilterKey, IssueStatus[] | null> = {
  all: null,
  in_progress: ['WAITING_FOR_FISCAL', 'WAITING_FOR_PROCEDURE', 'WAITING_FOR_MANAGER', 'WAITING_FOR_MANAGER_RESOLUTION'],
  needs_action: ['WAITING_FOR_RESOLUTION_VALIDATION'],
  resolved: ['SOLVED', 'CLOSED'],
};
