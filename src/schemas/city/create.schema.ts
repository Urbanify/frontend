import z from 'zod';

export const createCitySchema = (t: (arg: string) => string) => z.object({
  name: z.string({ required_error: t('name_required') })
    .min(2, t('name_length')),
  latitude: z.string({ required_error: t('map_position_required') }),
  longitude: z.string({ required_error: t('map_position_required') }),
});
