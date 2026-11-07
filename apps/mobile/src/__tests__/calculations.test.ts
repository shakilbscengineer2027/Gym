import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * 1RM Estimations
 * Brzycki: weight / (1.0278 - (0.0278 * reps))
 * Epley: weight * (1 + 0.0333 * reps)
 */
export function calculateBrzycki1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  const value = weightKg / (1.0278 - 0.0278 * reps);
  return Math.round(value * 10) / 10;
}

export function calculateEpley1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  const value = weightKg * (1 + 0.0333 * reps);
  return Math.round(value * 10) / 10;
}

export function calculateVolumeLoad(sets: Array<{ weightKg: number; reps: number }>): number {
  return sets.reduce((total, s) => total + s.weightKg * s.reps, 0);
}

describe('Fitness Calculation Formulas', () => {
  it('calculates 1RM accurately for a 1-rep lift', () => {
    assert.strictEqual(calculateBrzycki1RM(100, 1), 100);
    assert.strictEqual(calculateEpley1RM(100, 1), 100);
  });

  it('estimates 1RM with Brzycki formula for 100kg x 10 reps', () => {
    const estimated = calculateBrzycki1RM(100, 10);
    // 100 / (1.0278 - 0.278) = 100 / 0.7498 = ~133.4 kg
    assert.ok(estimated >= 133 && estimated <= 134);
  });

  it('estimates 1RM with Epley formula for 100kg x 10 reps', () => {
    const estimated = calculateEpley1RM(100, 10);
    // 100 * (1 + 0.333) = 133.3 kg
    assert.strictEqual(estimated, 133.3);
  });

  it('calculates total volume load across multiple sets', () => {
    const sets = [
      { weightKg: 100, reps: 10 }, // 1000
      { weightKg: 100, reps: 8 },  // 800
      { weightKg: 90, reps: 10 },  // 900
    ];
    assert.strictEqual(calculateVolumeLoad(sets), 2700);
  });
});
