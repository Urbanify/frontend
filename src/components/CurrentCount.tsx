import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

export const CurrentCount = async () => {
  const t = await getTranslations('CurrentCount');

  // `x-e2e-random-id` is used for end-to-end testing to make isolated requests
  // The default value is 0 when there is no `x-e2e-random-id` header
  const id = Number((await headers()).get('x-e2e-random-id')) ?? 0;
  const count = id ?? 0;

  return <div>{t('count', { count })}</div>;
};
