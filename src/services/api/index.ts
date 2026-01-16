import * as auth from './auth';
import * as city from './city';
import * as comments from './comments';
import { get } from './get';
import { fetcher } from './instance';
import * as issues from './issues';

export const api = {
  get,
  instance: fetcher,
  auth,
  city,
  comments,
  issues,
};
