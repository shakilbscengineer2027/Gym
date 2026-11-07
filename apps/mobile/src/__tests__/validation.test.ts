import { describe, it } from 'node:test';
import assert from 'node:assert';
import { loginSchema, registerSchema } from '../validation/auth.schema.ts';
import { bodyMeasurementSchema } from '../validation/measurement.schema.ts';
import { createWorkoutSchema } from '../validation/workout.schema.ts';

describe('Zod Validation Schemas', () => {
  describe('loginSchema', () => {
    it('passes for valid email and password', () => {
      const res = loginSchema.safeParse({
        email: 'athlete@apexpulse.app',
        password: 'SecurePassword123!',
      });
      assert.strictEqual(res.success, true);
    });

    it('rejects invalid email', () => {
      const res = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'SecurePassword123!',
      });
      assert.strictEqual(res.success, false);
    });

    it('rejects short passwords under 8 characters', () => {
      const res = loginSchema.safeParse({
        email: 'athlete@apexpulse.app',
        password: 'short',
      });
      assert.strictEqual(res.success, false);
    });
  });

  describe('registerSchema & GDPR Consent', () => {
    it('fails if GDPR health consent is false', () => {
      const res = registerSchema.safeParse({
        fullName: 'Alex Thorne',
        email: 'alex@example.com',
        password: 'Password1234!',
        healthConsent: false,
      });
      assert.strictEqual(res.success, false);
    });

    it('passes when all requirements and GDPR consent are satisfied', () => {
      const res = registerSchema.safeParse({
        fullName: 'Alex Thorne',
        email: 'alex@example.com',
        password: 'Password1234!',
        healthConsent: true,
      });
      assert.strictEqual(res.success, true);
    });
  });

  describe('bodyMeasurementSchema', () => {
    it('validates realistic body weight entries', () => {
      const valid = bodyMeasurementSchema.safeParse({
        weightKg: 82.5,
        bodyFatPercent: 12.5,
      });
      assert.strictEqual(valid.success, true);

      const invalidWeight = bodyMeasurementSchema.safeParse({
        weightKg: 10, // Under 25kg minimum
      });
      assert.strictEqual(invalidWeight.success, false);
    });
  });

  describe('createWorkoutSchema', () => {
    it('validates routine creation fields', () => {
      const valid = createWorkoutSchema.safeParse({
        title: 'Push Day Hypertrophy',
        category: 'Strength',
        fitnessLevel: 'Advance',
        estimatedDurationMinutes: 60,
      });
      assert.strictEqual(valid.success, true);
    });
  });
});
