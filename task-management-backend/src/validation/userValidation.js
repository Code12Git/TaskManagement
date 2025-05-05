const { z } = require('zod');

const userSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),

  username: z.string()
    .trim()
    .min(4, 'Username must be at least 4 characters long')
    .max(20, 'Username cannot exceed 20 characters')
    .optional(),

  email: z.string()
    .email('Invalid email format')
    .trim(),

  role: z.enum(['manager', 'user', 'admin'])
    .default('user'),

  password: z.string()
    .trim()
    .min(6, 'Password must be at least 6 characters long'),
});

module.exports =  userSchema

