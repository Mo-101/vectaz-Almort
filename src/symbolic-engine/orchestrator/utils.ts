
// utils.ts - Utility functions for symbolic orchestration

/**
 * Processes geographic data for symbolic analysis
 * @param input Symbolic input with geographic coordinates
 * @returns Distance in kilometers or undefined if coordinates are missing
 */
export function processGeographicData(
  originLat?: number,
  originLng?: number,
  destLat?: number,
  destLng?: number
): number | undefined {
  if (originLat && originLng && destLat && destLng) {
    const distance = calculateRouteDistance(
      originLat, 
      originLng, 
      destLat, 
      destLng
    );
    return Math.round(distance);
  }
  return undefined;
}

/**
 * Helper function that delegates to the haversineDistance utility
 */
function calculateRouteDistance(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): number {
  // Import here to avoid circular dependencies
  const { haversineDistance } = require('../utils/distanceEngine');
  return haversineDistance(originLat, originLng, destLat, destLng);
}
