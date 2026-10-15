'use client';

import { StatusBadge } from '@/components/app/status-badge';
import { useViewer } from '@/components/app/use-viewer';

import type { IssueStatus } from '@/types/Issue';

type IssueStatusBadgeProps = {
  status: IssueStatus;
};

// Kept for the screens that still use it. The new StatusBadge does the work.
export default function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  const { audience } = useViewer();

  return <StatusBadge status={status} audience={audience} />;
}
