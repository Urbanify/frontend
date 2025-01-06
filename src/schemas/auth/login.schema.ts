import { object, string } from 'zod';

export const loginSchema = object({
  cpf: string({ required_error: 'CPF is required' })
    .min(11, 'CPF is required'),
  // .email("Invalid email"),
  password: string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});
