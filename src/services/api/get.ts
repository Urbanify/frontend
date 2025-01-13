import { auth } from '@/auth';
import { mutate } from '@/utils/revalidateTag';

import { api } from '.';

export const get = async (endpoint: string, authed: boolean, key: string) => {
  const session = authed ? await auth() : undefined;
  const promise = api.instance(endpoint, {
    method: 'GET',
    next: {
      ...(key ? { tags: [key] } : {}),
    },
  }, session?.access_token);

  return {
    promise,
    ...(key ? { mutate: () => mutate(key) } : {}),
  };
};
