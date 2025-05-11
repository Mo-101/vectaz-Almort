
// utils.test.ts - Tests for symbolic utilities

import { processGeographicData, normalizeKPI, deriveLaneCode } from '../orchestrator/utils';

describe('Geographic Utilities', () => {
  test('processGeographicData calculates correct distances', () => {
    // Example: Singapore to Sydney distance (approx 6300 km)
    const distance = processGeographicData(1.3521, 103.8198, -33.8688, 151.2093);
    
    // We expect the distance to be approximately 6300 km
    // Allow for some variation in the algorithm implementation
    expect(distance).toBeGreaterThan(6000);
    expect(distance).toBeLessThan(6600);
  });

  test('processGeographicData handles missing coordinates', () => {
    expect(processGeographicData(1.3521, 103.8198, undefined, 151.2093)).toBeUndefined();
    expect(processGeographicData(undefined, undefined, undefined, undefined)).toBeUndefined();
  });
});

describe('Data Processing Utilities', () => {
  test('normalizeKPI normalizes values correctly', () => {
    const rawData = [10, 20, 30, 40, 50];
    const normalized = normalizeKPI(rawData);
    
    expect(normalized.length).toBe(5);
    expect(normalized[0]).toBe(0);    // Min should be 0
    expect(normalized[4]).toBe(1);    // Max should be 1
    expect(normalized[2]).toBe(0.5);  // Middle should be 0.5
  });
  
  test('deriveLaneCode creates consistent lane codes', () => {
    expect(deriveLaneCode('New York', 'Los Angeles')).toBe('NEWYORK-LOSANGELES');
    expect(deriveLaneCode('NEW YORK', 'LOS ANGELES')).toBe('NEWYORK-LOSANGELES');
    expect(deriveLaneCode('new york', 'los angeles')).toBe('NEWYORK-LOSANGELES');
  });
});
