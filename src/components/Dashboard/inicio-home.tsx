'use client';

import { useTranslations } from 'next-intl';

import { useViewer } from '@/components/app/use-viewer';

import { parseJwt } from '@/utils/decodeJWT';

import { CitizenHome } from './citizen-home';
import { InicioSkeleton } from './inicio-skeleton';
import { StaffHome } from './staff-home';

import type { Issue } from '@/types/Issue';

export type InicioHomeProps = {
  /** The city's issues from the list endpoint (last 30 days, first page). */
  cityIssues: Issue[];
  /** The citizen's own reports, newest first. Only the first three carry photos. */
  reportedIssues: Issue[];
};

// Same page for everyone. Citizens and staff get different blocks.
export function InicioHome({ cityIssues, reportedIssues }: InicioHomeProps) {
  const t = useTranslations('Dashboard.greeting');
  const viewer = useViewer();

  if (!viewer.token) {
    return <InicioSkeleton />;
  }

  const firstName = parseJwt(viewer.token)?.user?.name?.split(' ')[0];
  const hour = new Date().getHours();
  const period = hour < 12 ? t('morning') : hour < 18 ? t('afternoon') : t('evening');
  const title = firstName ? t('named', { period, name: firstName }) : period;

  return viewer.audience === 'citizen'
    ? <CitizenHome title={title} viewer={viewer} cityIssues={cityIssues} reportedIssues={reportedIssues} />
    : <StaffHome title={title} viewer={viewer} cityIssues={cityIssues} />;
}
