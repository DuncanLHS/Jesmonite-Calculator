/**
 * Commercial Jesmonite Pigment Library
 * 
 * IMPORTANT: These hex codes are approximations based on color name research,
 * not official Jesmonite specifications. Actual pigment colors will vary
 * significantly based on percentage, material type, lighting, and curing.
 */

export const JESMONITE_PIGMENTS = [
  // Core Range
  {
    id: 'white',
    name: 'White',
    hex: '#FFFFFF',
    category: 'core'
  },
  {
    id: 'black',
    name: 'Black',
    hex: '#000000',
    category: 'core'
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#0066CC',
    category: 'core'
  },
  {
    id: 'green',
    name: 'Green',
    hex: '#228B22',
    category: 'core'
  },
  {
    id: 'coade',
    name: 'Coade',
    hex: '#C19A6B',
    category: 'core'
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    hex: '#E2725B',
    category: 'core'
  },
  {
    id: 'bright-red',
    name: 'Bright Red',
    hex: '#FF160C',
    category: 'core'
  },
  {
    id: 'red-oxide',
    name: 'Red Oxide',
    hex: '#6E0902',
    category: 'core'
  },
  {
    id: 'bright-yellow',
    name: 'Bright Yellow',
    hex: '#FFEA00',
    category: 'core'
  },
  {
    id: 'yellow-oxide',
    name: 'Yellow Oxide',
    hex: '#FECB52',
    category: 'core'
  },
  // New Colors
  {
    id: 'pink',
    name: 'Pink',
    hex: '#FF69B4',
    category: 'new'
  },
  {
    id: 'purple',
    name: 'Purple',
    hex: '#8B00FF',
    category: 'new'
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#FF6600',
    category: 'new'
  }
];

/**
 * Get pigment by ID
 */
export function getPigmentById(id) {
  return JESMONITE_PIGMENTS.find(p => p.id === id);
}

/**
 * Get pigment by name (case-insensitive)
 */
export function getPigmentByName(name) {
  const normalizedName = name.toLowerCase().trim();
  return JESMONITE_PIGMENTS.find(p => p.name.toLowerCase() === normalizedName);
}
