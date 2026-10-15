import * as city from './city';
import * as comments from './comments';
import * as crimes from './crimes';
import { get } from './get';
import { fetcher } from './instance';
import * as issues from './issues';
import * as users from './users';

export const api = {
  get,
  instance: fetcher,
  city,
  comments,
  crimes,
  issues,
  users,
};
