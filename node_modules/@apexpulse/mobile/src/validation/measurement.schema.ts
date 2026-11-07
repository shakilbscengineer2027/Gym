import { z } from 'zod';

export const bodyMeasurementSchema = z.object({
  weightKg: z
    .number()
    .min(25, 'Weight must be at least 25 kg')
    .max(350, 'Weight cannot exceed 350 kg'),
  bodyFatPercent: z
    .number()
    .min(3, 'Body fat must be at least 3%')
    .max(65, 'Body fat cannot exceed 65%')
    .optional(),
  chestCm: z.number().min(20).max(250).optional(),
  waistCm: z.number().min(20).max(250).optional(),
  leftArmCm: z.number().min(10).max(100).optional(),
  rightArmCm: z.number().min(10).max(100).optional(),
});

export type BodyMeasurementFormData = z.infer<typeof bodyMeasurementSchema>;
