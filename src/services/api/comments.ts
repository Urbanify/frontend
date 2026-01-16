import { getSession } from 'next-auth/react';

import { api } from '.';

type CommentPayload = {
  text: string;
  issueId: string;
  cityId: string;
};

type ListCommentsParams = {
  issueId: string;
  page: number;
  take?: number;
};

export const create = async (payload: CommentPayload) => {
  const session = await getSession();
  return api.instance('/comments', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, session?.access_token);
};

export const list = async ({ issueId, page, take }: ListCommentsParams) => {
  const session = await getSession();
  const query = new URLSearchParams({
    issueId,
    page: String(page),
    ...(take ? { take: String(take) } : {}),
  });
  return api.instance(`/comments?${query.toString()}`, {
    method: 'GET',
  }, session?.access_token);
};

export const reply = async (commentId: string, payload: CommentPayload) => {
  const session = await getSession();
  return api.instance(`/comments/${commentId}/reply`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, session?.access_token);
};

export const deleteById = async (commentId: string) => {
  const session = await getSession();
  return api.instance(`/comments/${commentId}`, {
    method: 'DELETE',
  }, session?.access_token);
};
