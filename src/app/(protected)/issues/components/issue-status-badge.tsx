import { useTranslations } from 'next-intl';

import { Badge, type BadgeVariant } from '@/components/ui/badge/badge';

import type { IssueStatus } from '@/types/Issue';

type StatusMap = Record<IssueStatus, { label: string; variant: BadgeVariant }>;

type IssueStatusBadgeProps = {
  status: IssueStatus;
};
export default function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  const t = useTranslations('Issues.status');
  const statusMap: StatusMap = {
    WAITING_FOR_FISCAL: {
      label: t('WAITING_FOR_FISCAL'),
      variant: 'info',
    },
    WAITING_FOR_PROCEDURE: {
      label: t('WAITING_FOR_PROCEDURE'),
      variant: 'warning',
    },
    WAITING_FOR_MANAGER: {
      label: t('WAITING_FOR_MANAGER'),
      variant: 'info',
    },
    WAITING_FOR_MANAGER_RESOLUTION: {
      label: t('WAITING_FOR_MANAGER_RESOLUTION'),
      variant: 'default',
    },
    WAITING_FOR_RESOLUTION_VALIDATION: {
      label: t('WAITING_FOR_RESOLUTION_VALIDATION'),
      variant: 'default',
    },
    SOLVED: {
      label: t('SOLVED'),
      variant: 'success',
    },
    CLOSED: {
      label: t('CLOSED'),
      variant: 'danger',
    },
  };

  const { label, variant } = statusMap[status];

  return <Badge variant={variant}>{label}</Badge>;
}
