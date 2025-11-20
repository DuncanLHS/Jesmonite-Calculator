
/**
 * Get the maximum pigment percentage allowed for a product type
 * @param {string} productType - Product type (AC100, AC200, etc.)
 * @returns {number} Maximum pigment percentage
 */
export function getMaxPigmentPercentage(productType) {
  // AC730 can handle up to 5% powder pigment
  // AC100, AC200, AC300 have a 2% maximum for liquid pigments
  if (productType === 'AC730') {
    return 5;
  }
  return 2;
}

/**
 * Calculate individual pigment weights based on percentages
 * @param {Array} pigments - Array of pigment objects with {id, name, percentage}
 * @param {number} baseWeight - Weight of base powder in grams
 * @param {number} liquidWeight - Weight of liquid in grams
 * @returns {Array} Array of pigment objects with calculated weights
 */
export function calculatePigmentWeights(pigments, baseWeight, liquidWeight) {
  const totalMixWeight = baseWeight + liquidWeight;
  
  return pigments.map(pigment => ({
    ...pigment,
    weight: Number(((totalMixWeight * pigment.percentage) / 100).toFixed(1))
  }));
}

/**
 * Auto-balance pigment percentages when one is changed
 * Ensures total never exceeds maxPercentage by proportionally reducing others
 * @param {Array} pigments - Current pigment array
 * @param {number} changedIndex - Index of the pigment being changed
 * @param {number} newValue - New percentage value for the changed pigment
 * @param {number} maxPercentage - Maximum total percentage allowed
 * @returns {Array} New pigment array with balanced percentages
 */
export function rebalancePigments(pigments, changedIndex, newValue, maxPercentage) {
  // Create a copy to avoid mutation
  const newPigments = [...pigments];
  
  // Update the changed pigment
  newPigments[changedIndex] = {
    ...newPigments[changedIndex],
    percentage: newValue
  };
  
  // Calculate new total
  const newTotal = newPigments.reduce((sum, p) => sum + p.percentage, 0);
  
  // If we're under the limit, no rebalancing needed
  if (newTotal <= maxPercentage) {
    return newPigments;
  }
  
  // Calculate excess that needs to be removed from other pigments
  const excess = newTotal - maxPercentage;
  
  // Get sum of all other pigments (excluding the one being changed)
  const otherPigmentsSum = newPigments.reduce((sum, p, idx) => {
    return idx === changedIndex ? sum : sum + p.percentage;
  }, 0);
  
  // If other pigments sum to zero, we can't rebalance
  // Just cap the changed pigment at max
  if (otherPigmentsSum === 0) {
    newPigments[changedIndex] = {
      ...newPigments[changedIndex],
      percentage: maxPercentage
    };
    return newPigments;
  }
  
  // Proportionally reduce other pigments
  return newPigments.map((pigment, idx) => {
    if (idx === changedIndex) {
      return pigment; // Keep the changed pigment as-is
    }
    
    // Calculate this pigment's share of the reduction
    const reductionRatio = pigment.percentage / otherPigmentsSum;
    const reduction = excess * reductionRatio;
    const newPercentage = Math.max(0, pigment.percentage - reduction);
    
    return {
      ...pigment,
      percentage: Number(newPercentage.toFixed(2))
    };
  });
}

/**
 * Calculate total pigment percentage
 * @param {Array} pigments - Array of pigment objects
 * @returns {number} Total percentage
 */
export function getTotalPigmentPercentage(pigments) {
  return Number(pigments.reduce((sum, p) => sum + p.percentage, 0).toFixed(2));
}

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color string (e.g., '#FF0000')
 * @returns {object} RGB object {r, g, b}
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 128, g: 128, b: 128 }; // Default gray if invalid
}

/**
 * Convert RGB to hex color string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color string
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculate mixed color from multiple pigments using weighted RGB average
 * and accounting for opacity (percentage) by blending with white Jesmonite base
 * @param {Array} pigments - Array of pigment objects with color and percentage
 * @param {number} maxPercentage - Maximum percentage (default 2 for AC100)
 * @returns {string} Hex color string of mixed result
 */
export function calculateMixedColor(pigments, maxPercentage = 2) {
  if (!pigments || pigments.length === 0) {
    return '#FFFFFF'; // Default to white
  }

  const totalPercentage = getTotalPigmentPercentage(pigments);
  
  if (totalPercentage === 0) {
    return '#FFFFFF';
  }

  // Step 1: Mix all pigment colors together (weighted by their percentages)
  let pigmentR = 0, pigmentG = 0, pigmentB = 0;
  
  pigments.forEach(pigment => {
    if (pigment.color && pigment.percentage > 0) {
      const weight = pigment.percentage / totalPercentage;
      const rgb = hexToRgb(pigment.color);
      pigmentR += rgb.r * weight;
      pigmentG += rgb.g * weight;
      pigmentB += rgb.b * weight;
    }
  });

  // Step 2: Blend the mixed pigment color with white base based on total percentage
  // The total percentage represents the opacity/concentration of pigment in the white base
  // At 0%: pure white, At maxPercentage (2% or 5%): full pigment color
  const opacity = Math.min(totalPercentage / maxPercentage, 1); // Normalize to 0-1
  
  // White Jesmonite base
  const baseR = 255, baseG = 255, baseB = 255;
  
  // Blend: base * (1 - opacity) + pigment * opacity
  const finalR = baseR * (1 - opacity) + pigmentR * opacity;
  const finalG = baseG * (1 - opacity) + pigmentG * opacity;
  const finalB = baseB * (1 - opacity) + pigmentB * opacity;

  return rgbToHex(finalR, finalG, finalB);
}

/**
 * Get contrasting text color (black or white) for a given background color
 * @param {string} hex - Background hex color
 * @returns {string} '#000000' or '#FFFFFF'
 */
export function getContrastColor(hex) {
  const rgb = hexToRgb(hex);
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

