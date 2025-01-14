import { getSession } from 'next-auth/react';

import type { ReportIssueData } from '@/components/Issues/report-issue-form';

import { api } from '.';

export const report = async (data: ReportIssueData) => {
  const session = await getSession();
  return api.instance('/issues/report', {
    method: 'POST',
    body: JSON.stringify(data),
  }, session?.access_token);
};
