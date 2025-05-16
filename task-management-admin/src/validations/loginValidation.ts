import z from 'zod'

const loginValidation = z.object({
  email: z.string()
    .email('Invalid email format')
    .trim(),

  password: z.string()
    .trim()
    .min(6, 'Password must be at least 6 characters long'),
});

export default loginValidation;

