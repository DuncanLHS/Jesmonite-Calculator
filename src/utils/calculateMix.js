/**
 * Calculates Jesmonite mix ratios based on water weight (mold volume).
 * 
 * Data:
 * - Mix Ratio: 2.5 : 1 (Base : Liquid)
 * - Wet Density: 1.845 g/ml (Used for mixing to fill mold)
 * - Dry Density: 1.745 g/ml (Used for final weight estimation)
 * 
 * Logic:
 * - Volume (ml) = Water Weight (g)
 * - Total Wet Mix = Volume * 1.845
 * - Liquid = Total Wet Mix / 3.5
 * - Base = Liquid * 2.5
 * - Estimated Dry Weight = Volume * 1.745
 * 
 * @param {number} waterWeight - Weight of water in grams (representing volume in ml)
 * @param {number} wastePercentage - Safety margin in percentage (e.g., 10 for 10%)
 * @returns {object} - Calculated weights in grams
 */
export function calculateMix(waterWeight, wastePercentage = 0) {
  if (waterWeight < 0 || wastePercentage < 0) {
    return {
      liquid: 0,
      base: 0,
      totalWet: 0,
      estimatedDry: 0
    };
  }

  const volume = waterWeight; // 1g water ~= 1ml volume
  const wasteMultiplier = 1 + (wastePercentage / 100);
  
  const totalWetMix = volume * 1.845 * wasteMultiplier;
  
  // Ratio 2.5 : 1 means 3.5 parts total
  const liquid = totalWetMix / 3.5;
  const base = liquid * 2.5;
  
  const estimatedDry = volume * 1.745 * wasteMultiplier;

  return {
    liquid: Number(liquid.toFixed(1)),
    base: Number(base.toFixed(1)),
    totalWet: Number(totalWetMix.toFixed(1)),
    estimatedDry: Number(estimatedDry.toFixed(1))
  };
}
