import z from 'zod';

export const takeActionIssueSchema = (t: (arg: string) => string) => z.object({
  description: z.string({ required_error: t('issue_description_required') })
    .min(30, t('issue_description_length')),
});
