import { getSession } from 'next-auth/react';

import type { ReportIssueData } from '@/components/Issues/report-issue-form';

import { formatQueryParams } from '@/utils/queryParamsFormatter';

import { api } from '.';

import type { Issue, IssueCategory, IssueStatus } from '@/types/Issue';

export const report = async (data: ReportIssueData) => {
  const session = await getSession();
  return api.instance('/issues', {
    method: 'POST',
    body: JSON.stringify(data),
  }, session?.access_token);
};

type IssueFilter = {
  status?: IssueStatus;
  category?: IssueCategory;
  start: string;
  end: string;
  page: number;
  take?: number;
};

type ListIssueResponse = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: Issue[];
  take: number;
};

export const getAllOpenIssuesPerPeriod = async ({
  end,
  page = 1,
  start,
  category,
  status,
  take = 30,
}: IssueFilter) => {
  const urlSearchParams = formatQueryParams({
    end,
    page,
    start,
    category,
    status,
    take,
  });

  const { promise, mutate } = await api.get(`/issues${urlSearchParams}`, true, 'list-open-issues');
  const response = await promise;
  let data = [];
  if (response.ok) {
    data = await response.json() ?? [];
  }
  return {
    data: data as ListIssueResponse,
    mutate,
  };
};
