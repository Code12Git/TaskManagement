import z from "zod";

const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description cannot exceed 5000 characters"),

  dueDate: z.coerce
    .date()
    .min(new Date(), "Due date must be in future")
    .refine((date) => date.getFullYear() < 2030, "Max year is 2030"),

  priority: z.enum(["low", "medium", "high"]),

  status: z.enum(["not-started", "in-progress", "completed"]),
});

export default taskSchema;
