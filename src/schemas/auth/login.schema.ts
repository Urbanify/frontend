import z from 'zod';

export const emailSchema = (t: (arg: string) => string) => z.object({
  email: z.string({ required_error: t('email_required') })
    .trim()
    .min(1, t('email_required'))
    .email(t('email_invalid')),
});

export const codeSchema = (t: (arg: string) => string) => z.object({
  code: z.string({ required_error: t('code_required') })
    .regex(/^\d{6}$/, t('code_invalid_format')),
});
