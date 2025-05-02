const { z } = require('zod');

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),

  description: z.string().min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),

  dueDate: z.coerce.date()
  .min(new Date(), "Due date must be in future")
  .refine(date => date.getFullYear() < 2030, "Max year is 2030"),

  priority: z.enum(['low', 'medium', 'high']).default('medium'),

  status: z.enum(['not-started', 'in-progress', 'completed']).default('not-started'),
})


module.exports = {
  taskSchema,    
};