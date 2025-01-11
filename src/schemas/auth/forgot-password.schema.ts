import z from 'zod';

export const forgotPasswordSchema = (t: (arg: string) => string) => z.object({
  cpf: z.string({ required_error: t('cpf_required') })
    .length(11, t('cpf_length'))
    .regex(/^\d+$/, t('cpf_only_numbers')),
});
