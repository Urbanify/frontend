import z from 'zod';

export const updatePasswordSchema = (t: (arg: string) => string) => z.object({
  newPassword: z.string({ required_error: t('password_required') })
    .min(8, t('password_length'))
    .max(32, t('password_length')),
  newPasswordConfirmation: z.string({ required_error: t('password_confirmation_required') })
    .min(8, t('password_confirmation_length'))
    .max(32, t('password_confirmation_length')),
  token: z.string(),
}).refine(data => data.newPassword === data.newPasswordConfirmation, {
  message: t('passwords_must_match'),
  path: ['newPasswordConfirmation'],
});
