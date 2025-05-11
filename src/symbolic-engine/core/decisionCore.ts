
// decisionCore.ts - Symbolic Neutrosophic-Grey AHP-TOPSIS decision engine

import { runTopsisWithGrey } from '../services/topsisGrey';

export function evaluateDecision(
  decisionMatrix: number[][], 
  weights: number[], 
  criteriaTypes: ('benefit' | 'cost')[], 
  alternatives: string[]
) {
  const result = runTopsisWithGrey(decisionMatrix, weights, criteriaTypes);
  const topIndex = result.topAlternative.index;
  return {
    topChoice: alternatives[topIndex] || `Option ${topIndex + 1}`,
    confidence: result.topAlternative.score,
    allScores: result.allScores
  };
}
