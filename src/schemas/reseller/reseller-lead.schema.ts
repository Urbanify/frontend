import z from 'zod';

import { isValidCnpj } from '@/lib/brazil';

const digitsOnly = (value: string) => value.replace(/\D/g, '');

const resellerExperienceValues = ['none', 'some', 'strong'];

export const resellerLeadSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo.').max(120, 'Use no máximo 120 caracteres.'),
  email: z.string().trim().email('Informe um e-mail válido.').max(254, 'Use no máximo 254 caracteres.'),
  phone: z.string()
    .transform(digitsOnly)
    .pipe(z.string()
      .min(10, 'Informe o telefone com DDD.')
      .max(11, 'Confira o telefone.')),
  company: z.string().trim().min(2, 'Informe a razão social.').max(160, 'Use no máximo 160 caracteres.'),
  cnpj: z.string()
    .transform(digitsOnly)
    .pipe(z.string().refine(isValidCnpj, 'CNPJ inválido. Confira os números.')),
  region: z.string().trim().min(2, 'Informe a cidade e o estado de atuação.').max(160, 'Use no máximo 160 caracteres.'),
  citiesOfInterest: z.string().trim().max(500, 'Use no máximo 500 caracteres.'),
  experience: z.string()
    .refine(value => resellerExperienceValues.includes(value), 'Escolha uma opção.'),
  howHeard: z.string().trim().max(200, 'Use no máximo 200 caracteres.'),
  message: z.string().trim().max(1000, 'Use no máximo 1000 caracteres.'),
  consent: z.boolean()
    .refine(value => value, 'Marque o aceite para enviar.'),
  // Honeypot: must stay empty. Filled by bots only.
  website: z.string(),
});

export type ResellerLeadInput = z.input<typeof resellerLeadSchema>;
export type ResellerLeadPayload = z.output<typeof resellerLeadSchema>;
