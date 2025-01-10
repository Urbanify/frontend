import { useTranslations } from 'next-intl';

import { Badge, type BadgeVariant } from '@/components/ui/badge/badge';

import type { CityStatus } from '@/types/City';

type StatusMap = Record<CityStatus, { label: string; variant: BadgeVariant }>;

type CityStatusBadgeProps = {
  status: CityStatus;
};
export default function CityStatusBadge({ status }: CityStatusBadgeProps) {
  const t = useTranslations('Cities.status');
  const statusMap: StatusMap = {
    ACTIVE: {
      label: t('active'),
      variant: 'success',
    },
    DISABLED: {
      label: t('inactive'),
      variant: 'warning',
    },
  };

  const { label, variant } = statusMap[status];

  return <Badge variant={variant}>{label}</Badge>;
}
