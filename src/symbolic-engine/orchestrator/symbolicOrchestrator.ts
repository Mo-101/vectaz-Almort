
// symbolicOrchestrator.ts - Orchestrates the symbolic engine flow

import { evaluateDecision } from '../core/decisionCore';
import { detectAnomalies, Insight } from '../services/insightEngine';
import { selectContainer } from '../services/containerSelector';
import { haversineDistance } from '../utils/distanceEngine';

export interface SymbolicInput {
  decisionMatrix: number[][];
  weights: number[];
  criteriaTypes: ('benefit' | 'cost')[];
  alternatives: string[];
  forwarders?: any[];
  weight?: number;
  volume?: number;
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
}

export interface SymbolicResult {
  topChoice: string;
  confidence: number;
  recommendedContainer?: string;
  routeDistanceKm?: number;
  insights: Insight[];
  allScores: number[];
}

export function runNeuroSymbolicCycle(input: SymbolicInput): SymbolicResult {
  const matrix = input.decisionMatrix;
  const weights = input.weights;
  const types = input.criteriaTypes;
  const names = input.alternatives;

  const result = evaluateDecision(matrix, weights, types, names);

  const insights = detectAnomalies(input.forwarders || []);
  
  // Add container recommendation if weight and volume are provided
  const recommendedContainer = input.weight && input.volume 
    ? selectContainer(input.weight, input.volume) 
    : undefined;
  
  // Calculate distance if coordinates are provided
  let distance: number | undefined = undefined;
  if (input.originLat && input.originLng && input.destLat && input.destLng) {
    distance = haversineDistance(
      input.originLat, 
      input.originLng, 
      input.destLat, 
      input.destLng
    );
  }

  return {
    ...result,
    recommendedContainer,
    routeDistanceKm: distance !== undefined ? Math.round(distance) : undefined,
    insights
  };
}
