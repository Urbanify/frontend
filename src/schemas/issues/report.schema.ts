import z from 'zod';

export const reportIssueSchema = (t: (arg: string) => string) => z.object({
  address: z.string().optional(),
  latitude: z.string({ required_error: t('map_position_required') }),
  longitude: z.string({ required_error: t('map_position_required') }),
  photos: z.any(),
  category: z.string(),
  issueType: z.string({ required_error: t('issueType_required') }),
  description: z.string({ required_error: t('issue_description_required') })
    .min(30, t('issue_description_length')),
});
