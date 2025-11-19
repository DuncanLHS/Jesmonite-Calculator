import { describe, expect, it } from 'vitest';
import { calculateMix } from './calculateMix';

describe('calculateMix', () => {
  it('should calculate correctly for AC100 (default)', () => {
    const result = calculateMix(100, 0, 'AC100');
    // Volume 100ml * 1.845 = 184.5g Total Wet
    // 184.5 / 3.5 = 52.7g Liquid
    // 52.7 * 2.5 = 131.8g Base
    expect(result.totalWet).toBe(184.5);
    expect(result.liquid).toBe(52.7);
    expect(result.base).toBe(131.8);
    expect(result.estimatedDry).toBe(174.5);
  });

  it('should calculate correctly for AC200', () => {
    const result = calculateMix(100, 0, 'AC200');
    // Volume 100ml * 1.845 = 184.5g Total Wet
    // Ratio 2:1 = 3 parts
    // 184.5 / 3 = 61.5g Liquid
    // 61.5 * 2 = 123.0g Base
    expect(result.totalWet).toBe(184.5);
    expect(result.liquid).toBe(61.5);
    expect(result.base).toBe(123.0);
  });

  it('should calculate correctly for AC300', () => {
    const result = calculateMix(100, 0, 'AC300');
    // Same as AC100
    expect(result.totalWet).toBe(184.5);
    expect(result.liquid).toBe(52.7);
    expect(result.base).toBe(131.8);
  });

  it('should calculate correctly for AC730', () => {
    const result = calculateMix(100, 0, 'AC730');
    // Volume 100ml * 1.950 = 195.0g Total Wet
    // Ratio 5:1 = 6 parts
    // 195.0 / 6 = 32.5g Liquid
    // 32.5 * 5 = 162.5g Base
    expect(result.totalWet).toBe(195.0);
    expect(result.liquid).toBe(32.5);
    expect(result.base).toBe(162.5);
    expect(result.estimatedDry).toBe(185.0);
  });

  it('should handle waste percentage', () => {
    const result = calculateMix(100, 10, 'AC100');
    // 184.5 * 1.1 = 202.95 -> 203.0
    expect(result.totalWet).toBe(203.0);
  });

  it('should return zeros for invalid input', () => {
    const result = calculateMix(-100);
    expect(result.totalWet).toBe(0);
  });
});
