import z from 'zod';

export const registerSchema = (t: (arg: string) => string) => z.object({
  // The field shows the mask (000.000.000-00); the API gets digits only.
  cpf: z.string({ required_error: t('cpf_required') })
    .transform(value => value.replace(/\D/g, ''))
    .pipe(z.string().length(11, t('cpf_length'))),
  name: z.string({ required_error: t('name_required') })
    .min(2, t('name_length')),
  surname: z.string({ required_error: t('surname_required') })
    .min(2, t('surname_length')),
  email: z.string({ required_error: t('email_required') })
    .email(t('email_invalid')),
  cityId: z.string({ required_error: t('city_required') })
    .min(1, t('city_required')),
});
