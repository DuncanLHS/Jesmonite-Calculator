import { describe, expect, it } from 'vitest';
import {
    calculatePigmentWeights,
    getMaxPigmentPercentage,
    getTotalPigmentPercentage,
    rebalancePigments
} from './calculatePigment';

describe('getMaxPigmentPercentage', () => {
  it('should return 2% for AC100', () => {
    expect(getMaxPigmentPercentage('AC100')).toBe(2);
  });

  it('should return 2% for AC200', () => {
    expect(getMaxPigmentPercentage('AC200')).toBe(2);
  });

  it('should return 2% for AC300', () => {
    expect(getMaxPigmentPercentage('AC300')).toBe(2);
  });

  it('should return 5% for AC730', () => {
    expect(getMaxPigmentPercentage('AC730')).toBe(5);
  });
});

describe('calculatePigmentWeights', () => {
  it('should calculate correct weights for single pigment', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 1.0 }
    ];
    const result = calculatePigmentWeights(pigments, 125, 50);
    
    expect(result[0].weight).toBe(1.8); // (125 + 50) * 0.01 = 1.75, rounded to 1.8
  });

  it('should calculate correct weights for multiple pigments', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 0.8 },
      { id: '2', name: 'White', percentage: 0.5 }
    ];
    const result = calculatePigmentWeights(pigments, 125, 50);
    
    expect(result[0].weight).toBe(1.4); // 175 * 0.008
    expect(result[1].weight).toBe(0.9); // 175 * 0.005
  });

  it('should handle zero weights', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 1.0 }
    ];
    const result = calculatePigmentWeights(pigments, 0, 0);
    
    expect(result[0].weight).toBe(0);
  });
});

describe('getTotalPigmentPercentage', () => {
  it('should calculate total percentage correctly', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 0.8 },
      { id: '2', name: 'White', percentage: 0.5 }
    ];
    
    expect(getTotalPigmentPercentage(pigments)).toBe(1.3);
  });

  it('should return 0 for empty array', () => {
    expect(getTotalPigmentPercentage([])).toBe(0);
  });
});

describe('rebalancePigments', () => {
  it('should not rebalance if under max', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 0.5 },
      { id: '2', name: 'White', percentage: 0.5 }
    ];
    
    const result = rebalancePigments(pigments, 0, 0.8, 2);
    
    expect(result[0].percentage).toBe(0.8);
    expect(result[1].percentage).toBe(0.5);
    expect(getTotalPigmentPercentage(result)).toBe(1.3);
  });

  it('should rebalance when exceeding max with 2 pigments', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 1.0 },
      { id: '2', name: 'White', percentage: 1.0 }
    ];
    
    // Increase first pigment to 1.5, should reduce second to 0.5
    const result = rebalancePigments(pigments, 0, 1.5, 2);
    
    expect(result[0].percentage).toBe(1.5);
    expect(result[1].percentage).toBe(0.5);
    expect(getTotalPigmentPercentage(result)).toBe(2);
  });

  it('should rebalance proportionally with 3 pigments', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 0.6 },
      { id: '2', name: 'White', percentage: 0.6 },
      { id: '3', name: 'Red', percentage: 0.6 }
    ];
    
    // Total is 1.8, increase first to 1.0 (new total would be 2.2)
    // Excess = 0.2, should be distributed across other two (0.6 each)
    // Each should lose 0.1 (proportional to their 50% share)
    const result = rebalancePigments(pigments, 0, 1.0, 2);
    
    expect(result[0].percentage).toBe(1.0);
    expect(result[1].percentage).toBe(0.5);
    expect(result[2].percentage).toBe(0.5);
    expect(getTotalPigmentPercentage(result)).toBe(2);
  });

  it('should handle unequal pigment percentages', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 0.5 },
      { id: '2', name: 'White', percentage: 1.0 }
    ];
    
    // Total is 1.5, increase first to 1.5 (new total would be 2.5)
    // Excess = 0.5, all should come from White (100% of others)
    const result = rebalancePigments(pigments, 0, 1.5, 2);
    
    expect(result[0].percentage).toBe(1.5);
    expect(result[1].percentage).toBe(0.5);
    expect(getTotalPigmentPercentage(result)).toBe(2);
  });

  it('should cap at max when single pigment', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 1.0 }
    ];
    
    const result = rebalancePigments(pigments, 0, 3.0, 2);
    
    expect(result[0].percentage).toBe(2);
  });

  it('should handle reducing a pigment (no rebalancing needed)', () => {
    const pigments = [
      { id: '1', name: 'Blue', percentage: 1.5 },
      { id: '2', name: 'White', percentage: 0.5 }
    ];
    
    const result = rebalancePigments(pigments, 0, 1.0, 2);
    
    expect(result[0].percentage).toBe(1.0);
    expect(result[1].percentage).toBe(0.5);
    expect(getTotalPigmentPercentage(result)).toBe(1.5);
  });
});
