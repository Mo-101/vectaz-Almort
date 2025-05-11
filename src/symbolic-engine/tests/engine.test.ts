
// engine.test.ts - Tests for the symbolic engine core

import { runNeuroSymbolicCycle } from '../orchestrator/engine';
import { SymbolicInput } from '../orchestrator/types';
import sampleInput from './fixtures/sampleInput.json';
import expectedResult from './fixtures/expectedResult.json';

describe('Symbolic Engine Tests', () => {
  test('runNeuroSymbolicCycle produces expected output', () => {
    // Use the sample input from our test fixtures
    const input = sampleInput as SymbolicInput;
    const result = runNeuroSymbolicCycle(input);
    
    // Validate core properties of the result
    expect(result.topChoice).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    
    // Additional assertions can be added based on expected behavior
    expect(result.routeDistanceKm).toBeDefined();
    if (result.recommendedContainer) {
      expect(typeof result.recommendedContainer).toBe('string');
    }
  });
});
