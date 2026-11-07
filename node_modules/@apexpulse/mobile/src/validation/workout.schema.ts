import { z } from 'zod';

export const logSetSchema = z.object({
  weightKg: z
    .number()
    .min(0, 'Weight cannot be negative')
    .max(600, 'Weight exceeds realistic limits'),
  reps: z
    .number()
    .int('Reps must be a whole number')
    .min(1, 'Minimum 1 repetition required')
    .max(150, 'Maximum 150 reps per set'),
  rpe: z
    .number()
    .min(1)
    .max(10)
    .optional(),
});

export type LogSetFormData = z.infer<typeof logSetSchema>;

export const createWorkoutSchema = z.object({
  title: z
    .string()
    .min(3, 'Routine title must be at least 3 characters')
    .max(60, 'Title cannot exceed 60 characters'),
  category: z.string().min(1, 'Category is required'),
  fitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advance', 'Elite']),
  estimatedDurationMinutes: z
    .number()
    .min(10, 'Duration must be at least 10 minutes')
    .max(240, 'Duration cannot exceed 4 hours'),
  description: z.string().max(250).optional(),
});

export type CreateWorkoutFormData = z.infer<typeof createWorkoutSchema>;
