'use server';

import { revalidateTag } from 'next/cache';

export const mutate = async (tag: string) => {
  revalidateTag(tag);
};
