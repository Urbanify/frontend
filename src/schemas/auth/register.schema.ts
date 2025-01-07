import z from 'zod';

export const registerSchema = (t: (arg: string) => string) => z.object({
  cpf: z.string({ required_error: t('cpf_required') })
    .length(11, t('cpf_length'))
    .regex(/^\d+$/, t('cpf_only_numbers')),
  password: z.string({ required_error: t('cpf_required') })
    .min(8, t('password_length'))
    .max(32, t('password_length')),
  name: z.string({ required_error: t('name_required') })
    .min(2, t('name_length')),
  surname: z.string({ required_error: t('surname_required') })
    .min(2, t('surname_length')),
  email: z.string({ required_error: t('email_required') })
    .email(t('email_invalid')),
});
