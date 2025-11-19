import { describe, expect, it } from 'vitest';
import { calculateMix } from './calculateMix';

describe('calculateMix', () => {
  it('calculates correct mix for 100g water', () => {
    const result = calculateMix(100);
    // Volume = 100ml
    // Total Wet = 100 * 1.845 = 184.5
    // Liquid = 184.5 / 3.5 = 52.71... -> 52.7
    // Base = 52.71... * 2.5 = 131.78... -> 131.8
    // Dry = 100 * 1.745 = 174.5
    
    expect(result.totalWet).toBe(184.5);
    expect(result.liquid).toBeCloseTo(52.7, 1);
    expect(result.base).toBeCloseTo(131.8, 1);
    expect(result.estimatedDry).toBe(174.5);
  });

  it('calculates correct mix with 10% waste', () => {
    const result = calculateMix(100, 10);
    // Volume = 100ml
    // Multiplier = 1.1
    // Total Wet = 100 * 1.845 * 1.1 = 202.95 -> 203.0
    // Liquid = 202.95 / 3.5 = 57.98... -> 58.0
    // Base = 57.98... * 2.5 = 144.96... -> 145.0
    // Dry = 100 * 1.745 * 1.1 = 191.95 -> 192.0

    expect(result.totalWet).toBe(203.0);
    expect(result.liquid).toBe(58.0);
    expect(result.base).toBe(145.0);
    expect(result.estimatedDry).toBe(192.0);
  });

  it('handles zero input', () => {
    const result = calculateMix(0);
    expect(result).toEqual({
      liquid: 0,
      base: 0,
      totalWet: 0,
      estimatedDry: 0
    });
  });

  it('handles negative input', () => {
    const result = calculateMix(-100);
    expect(result).toEqual({
      liquid: 0,
      base: 0,
      totalWet: 0,
      estimatedDry: 0
    });
  });
});
