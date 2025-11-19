/**
 * Product Configuration Data
 * 
 * Ratios (Base : Liquid):
 * - AC100: 2.5 : 1
 * - AC200: 2 : 1
 * - AC300: 2.5 : 1
 * - AC730: 5 : 1
 * 
 * Densities (g/ml):
 * - AC100: Wet 1.845, Dry 1.745
 * - AC200: Wet 1.845, Dry 1.745
 * - AC300: Wet 1.845, Dry 1.745
 * - AC730: Wet 1.950, Dry 1.850
 */
export const PRODUCTS = {
  AC100: {
    name: 'AC100',
    ratioBase: 2.5,
    ratioLiquid: 1,
    wetDensity: 1.845,
    dryDensity: 1.745
  },
  AC200: {
    name: 'AC200',
    ratioBase: 2,
    ratioLiquid: 1,
    wetDensity: 1.845,
    dryDensity: 1.745
  },
  AC300: {
    name: 'AC300',
    ratioBase: 2.5,
    ratioLiquid: 1,
    wetDensity: 1.845,
    dryDensity: 1.745
  },
  AC730: {
    name: 'AC730',
    ratioBase: 5,
    ratioLiquid: 1,
    wetDensity: 1.950,
    dryDensity: 1.850
  }
};

/**
 * Calculates Jesmonite mix ratios based on water weight (mold volume) and product type.
 * 
 * @param {number} waterWeight - Weight of water in grams (representing volume in ml)
 * @param {number} wastePercentage - Safety margin in percentage (e.g., 10 for 10%)
 * @param {string} productType - Key for the product type (e.g., 'AC100')
 * @returns {object} - Calculated weights in grams
 */
export function calculateMix(waterWeight, wastePercentage = 0, productType = 'AC100') {
  if (waterWeight < 0 || wastePercentage < 0) {
    return {
      liquid: 0,
      base: 0,
      totalWet: 0,
      estimatedDry: 0
    };
  }

  const product = PRODUCTS[productType] || PRODUCTS['AC100'];
  const volume = waterWeight; // 1g water ~= 1ml volume
  const wasteMultiplier = 1 + (wastePercentage / 100);
  
  const totalWetMix = volume * product.wetDensity * wasteMultiplier;
  
  // Calculate parts
  const totalParts = product.ratioBase + product.ratioLiquid;
  const liquid = (totalWetMix / totalParts) * product.ratioLiquid;
  const base = (totalWetMix / totalParts) * product.ratioBase;
  
  const estimatedDry = volume * product.dryDensity * wasteMultiplier;

  return {
    liquid: Number(liquid.toFixed(1)),
    base: Number(base.toFixed(1)),
    totalWet: Number(totalWetMix.toFixed(1)),
    estimatedDry: Number(estimatedDry.toFixed(1))
  };
}
