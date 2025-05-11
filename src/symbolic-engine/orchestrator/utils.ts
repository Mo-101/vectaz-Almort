
// utils.ts - Utility functions for symbolic orchestration

/**
 * Processes geographic data for symbolic analysis
 * @param originLat Latitude of origin point
 * @param originLng Longitude of origin point
 * @param destLat Latitude of destination point
 * @param destLng Longitude of destination point
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

/**
 * Normalizes KPI data to a 0-1 range
 * @param kpiData Raw KPI values
 * @returns Normalized values between 0-1
 */
export function normalizeKPI(kpiData: number[]): number[] {
  if (!kpiData.length) return [];
  
  const min = Math.min(...kpiData);
  const max = Math.max(...kpiData);
  
  if (min === max) return kpiData.map(() => 1);
  
  return kpiData.map(value => (value - min) / (max - min));
}

/**
 * Derives a standardized lane code from origin and destination
 * @param origin Origin location code or name
 * @param destination Destination location code or name
 * @returns Standardized lane code
 */
export function deriveLaneCode(origin: string, destination: string): string {
  // Standardize by removing spaces and converting to uppercase
  const cleanOrigin = origin.replace(/\s+/g, '').toUpperCase();
  const cleanDest = destination.replace(/\s+/g, '').toUpperCase();
  
  return `${cleanOrigin}-${cleanDest}`;
}
