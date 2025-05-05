import z from 'zod'

const registerValidation = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),

  username: z.string()
    .trim()
    .min(4, 'Username must be at least 4 characters long')
    .max(20, 'Username cannot exceed 20 characters'),

  email: z.string()
    .email('Invalid email format')
    .trim(),

  password: z.string()
    .trim()
    .min(6, 'Password must be at least 6 characters long'),
});

export default registerValidation;

