import z from 'zod';

export const editFeatureSchema = (t: (arg: string) => string) => z.object({
  name: z.string({ required_error: t('feature_name_required') })
    .min(2, t('feature_name_length')),
  description: z.string({ required_error: t('feature_description_required') })
    .min(10, t('feature_description_length')),
  slug: z.string(),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
