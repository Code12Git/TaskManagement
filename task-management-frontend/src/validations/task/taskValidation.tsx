import z from 'zod'

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),

  description: z.string().min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),

  dueDate: z.string(),

  priority: z.enum(['low', 'medium', 'high']),

  status: z.enum(['not-started', 'in-progress', 'completed']),
})


export default taskSchema;