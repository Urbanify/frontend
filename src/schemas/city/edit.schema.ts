import z from 'zod';

export const editCitySchema = (t: (arg: string) => string) => z.object({
  name: z.string({ required_error: t('name_required') })
    .min(2, t('name_length')),
  latitude: z
    .string(),
  longitude: z
    .string(),

  id: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  featureFlags: z
    .array(
      z.object({
        cityId: z.string(),
        featureFlagId: z.string(),
        slug: z.string(),
        description: z.string(),
        status: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    )
    .nonempty(),
});
