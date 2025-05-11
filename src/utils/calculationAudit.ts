
/**
 * Audit utility for DeepCAL calculations
 * This helps identify which parts of the calculation pipeline are real vs. mocked
 */

import { ForwarderScore, WeightFactors } from '@/components/deepcal/types';
import { traceCalculation, verifyCalculation } from './debugCalculations';
import { evaluateForwarders } from '@/engine/decisionCore';
import { runTopsisWithGrey } from '@/engine/topsisGrey';

// Audit the entire DeepCAL calculation pipeline
export function auditDeepCalCalculations() {
  console.group('🔍 DeepCAL Calculation Audit');
  console.log('Starting comprehensive audit of calculation components...');
  
  // Test weight variations to see if they affect results
  const baseWeights: WeightFactors = { cost: 0.4, time: 0.3, reliability: 0.3 };
  const altWeights: WeightFactors = { cost: 0.7, time: 0.1, reliability: 0.2 };
  
  // Sample shipment data for testing
  const sampleData = [
    { forwarder: "DHL Express", costScore: 0.8, timeScore: 0.9, reliabilityScore: 0.85 },
    { forwarder: "FedEx", costScore: 0.75, timeScore: 0.85, reliabilityScore: 0.9 },
    { forwarder: "UPS", costScore: 0.7, timeScore: 0.8, reliabilityScore: 0.85 }
  ];
  
  // 1. Audit forwarder evaluation
  console.group('1. Forwarder Evaluation');
  try {
    const evalTest = verifyCalculation(
      (weights) => evaluateForwarders(sampleData, weights),
      baseWeights,
      altWeights
    );
    
    console.log(`Dynamic calculation: ${evalTest.isDynamic ? '✅ YES' : '❌ NO - STATIC RESULTS'}`);
    console.log('Results with different weights:', evalTest.results);
  } catch (error) {
    console.error('Error auditing forwarder evaluation:', error);
    console.log('❌ Function may be mocked or broken');
  }
  console.groupEnd();
  
  // 2. Audit TOPSIS algorithm
  console.group('2. TOPSIS Algorithm');
  try {
    // Create different decision matrices for testing
    const matrix1 = [
      [0.8, 0.9, 0.7],
      [0.7, 0.8, 0.9],
      [0.6, 0.7, 0.8]
    ];
    const matrix2 = [
      [0.9, 0.7, 0.8],
      [0.8, 0.9, 0.7],
      [0.7, 0.8, 0.9]
    ];
    
    const topsisTest = verifyCalculation(
      (matrix) => runTopsisWithGrey(matrix, [0.4, 0.3, 0.3], ['benefit', 'benefit', 'benefit']),
      matrix1,
      matrix2
    );
    
    console.log(`Dynamic calculation: ${topsisTest.isDynamic ? '✅ YES' : '❌ NO - STATIC RESULTS'}`);
    console.log('Results with different inputs:', topsisTest.results);
  } catch (error) {
    console.error('Error auditing TOPSIS algorithm:', error);
    console.log('❌ Function may be mocked or broken');
  }
  console.groupEnd();
  
  // 3. Audit data flow from UI to calculation
  console.log('');
  console.log('UI Data Flow Check:');
  console.log('To complete this audit, add the following to your DeepCALSection component:');
  console.log(`
import { traceCalculation } from '@/utils/debugCalculations';

// Inside analyzeQuotes function:
traceCalculation('User Input', {
  quotes, sourceCountry, destCountry, shipmentWeight, shipmentMode, factors
});

// Before calling getForwarderRankings:
traceCalculation('Before Ranking Calculation', { factors });

// After getting rankings:
traceCalculation('After Ranking Calculation', { factors }, rankings);
  `);
  
  console.groupEnd();
  
  return {
    complete: true,
    message: 'Audit functions installed. Check console for results and instructions.'
  };
}
