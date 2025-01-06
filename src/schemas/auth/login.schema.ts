import z from 'zod';

export const loginSchema = (t: (arg: string) => string) => z.object({
  cpf: z.string({ required_error: t('cpf_required') })
    .length(11, t('cpf_length'))
    .regex(/^\d+$/, t('cpf_only_numbers')),
  password: z.string({ required_error: t('cpf_required') })
    .min(8, t('password_length'))
    .max(32, t('password_length')),
});
