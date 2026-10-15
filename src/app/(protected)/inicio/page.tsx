import dayjs from 'dayjs';
import { redirect } from 'next/navigation';

import { getAudience } from '@/components/app/audience';
import { InicioHome } from '@/components/Dashboard/inicio-home';

import { auth } from '@/auth';
import { api } from '@/services/api';
import { parseJwtUniversal } from '@/utils/decodeJWTUniversal';

import type { Issue } from '@/types/Issue';

export default async function Page() {
  const session = await auth();
  const viewer = parseJwtUniversal(session?.access_token)?.user;

  if (viewer?.role === 'ADMIN' && !viewer.cityId) {
    redirect('/cities');
  }

  // The list endpoint returns the city's issues from the last 30 days, first page (up to 100).
  const { data: cityData } = await api.issues.getAllIssuesPerPeriod({
    start: dayjs().subtract(30, 'day').toISOString(),
    end: dayjs().toISOString(),
    page: 1,
    take: 100,
  });

  let reportedIssues: Issue[] = [];

  if (getAudience(viewer?.role) === 'citizen') {
    // Not limited to 30 days. The list endpoint has no photos, so the three newest get details.
    const { data: mine } = await api.issues.getAllMyIssues({ page: 1, take: 30 });
    const list = mine.items ?? [];
    const newest = await Promise.all(list.slice(0, 3).map(async (issue) => {
      const { data: details } = await api.issues.getById(issue.id);
      return { ...issue, photos: details.photos };
    }));
    reportedIssues = [...newest, ...list.slice(3)];
  }

  return <InicioHome cityIssues={cityData.items ?? []} reportedIssues={reportedIssues} />;
}
