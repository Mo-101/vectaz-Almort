
/**
 * Forwarder Score Module
 * 
 * This module calculates performance scores for forwarders using the
 * Neutrosophic AHP and TOPSIS methods.
 */
import { ForwarderScore as ForwarderScoreType } from './types';
import { traceCalculation } from '@/utils/debugCalculations';

/**
 * Calculate Neutrosophic values for a forwarder based on performance metrics
 * @param costScore Cost efficiency (higher is better)
 * @param timeScore Time efficiency (higher is better)
 * @param reliabilityScore Reliability performance (higher is better)
 */
export function calculateNeutrosophicValues(
  costScore: number,
  timeScore: number, 
  reliabilityScore: number
) {
  // Map the performance metrics to Neutrosophic components
  // T (Truth): Primarily based on reliability (on-time delivery)
  // I (Indeterminacy): Primarily based on time performance variability
  // F (Falsity): Primarily based on cost inefficiency (1 - costScore)
  
  const T = reliabilityScore;
  
  // For indeterminacy, we'll use a function of time performance
  // Lower time scores indicate more variability/uncertainty
  const I = 1 - timeScore * 0.8; // Scale to keep some uncertainty even with good time performance
  
  // For falsity, we'll use inverse of cost performance (higher cost = higher falsity)
  const F = 1 - costScore * 0.9; // Scale to acknowledge that even good options have some falsity
  
  return {
    T: parseFloat(T.toFixed(2)),
    I: parseFloat(I.toFixed(2)),
    F: parseFloat(F.toFixed(2))
  };
}

/**
 * Normalize a value between min and max to a 0-1 scale
 */
export const normalize = (value: number, min: number, max: number): number => {
  if (max === min) return 0.5; // Handle edge case
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

/**
 * Calculate forwarder scores based on weighted criteria
 * @param forwarderData Array of forwarder performance data
 * @param weights User preference weights for each criterion
 * @returns Array of forwarder scores
 */
export function calculateForwarderScores(
  forwarderData: Array<{
    forwarder: string;
    costScore: number;
    timeScore: number;
    reliabilityScore: number;
  }>,
  weights: { cost: number; time: number; reliability: number }
): ForwarderScoreType[] {
  // Trace the calculation for debugging
  traceCalculation('calculateForwarderScores', {
    inputData: forwarderData,
    weights: weights
  }, null, { logToConsole: true });
  
  // Normalize weights to ensure they sum to 1
  const totalWeight = weights.cost + weights.time + weights.reliability;
  const normalizedWeights = {
    cost: weights.cost / totalWeight,
    time: weights.time / totalWeight,
    reliability: weights.reliability / totalWeight
  };
  
  // Calculate scores for each forwarder
  const scores = forwarderData.map(forwarder => {
    // Calculate neutrosophic values
    const neutrosophic = calculateNeutrosophicValues(
      forwarder.costScore,
      forwarder.timeScore,
      forwarder.reliabilityScore
    );
    
    // Calculate weighted score
    const score = (
      normalizedWeights.cost * forwarder.costScore +
      normalizedWeights.time * forwarder.timeScore +
      normalizedWeights.reliability * forwarder.reliabilityScore
    );
    
    return {
      forwarder: forwarder.forwarder,
      score,
      costPerformance: forwarder.costScore,
      timePerformance: forwarder.timeScore,
      reliabilityPerformance: forwarder.reliabilityScore,
      neutrosophic
    };
  });
  
  // Sort scores by highest score first
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  // Trace the calculation output for debugging
  traceCalculation('calculateForwarderScores', {
    inputData: forwarderData,
    weights: weights
  }, sortedScores, { logToConsole: true });
  
  return sortedScores;
}
