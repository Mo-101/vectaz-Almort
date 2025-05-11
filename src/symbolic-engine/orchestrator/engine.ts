
// engine.ts - Core symbolic engine orchestration

import { evaluateDecision } from '../core/decisionCore';
import { detectAnomalies } from '../services/insightEngine';
import { selectContainer } from '../services/containerSelector';
import { processGeographicData } from './utils';
import { SymbolicInput, SymbolicResult } from './types';

/**
 * Core function that runs the neuro-symbolic decision cycle
 * @param input Structured symbolic input data
 * @returns Analysis results from the symbolic engine
 */
export function runNeuroSymbolicCycle(input: SymbolicInput): SymbolicResult {
  // Extract data from input
  const { 
    decisionMatrix: matrix, 
    weights, 
    criteriaTypes: types, 
    alternatives: names,
    weight,
    volume,
    originLat,
    originLng,
    destLat,
    destLng
  } = input;

  // Run the core decision evaluation
  const result = evaluateDecision(matrix, weights, types, names);

  // Generate insights from forwarder data
  const insights = detectAnomalies(input.forwarders || []);
  
  // Add container recommendation if weight and volume are provided
  const recommendedContainer = weight && volume 
    ? selectContainer(weight, volume) 
    : undefined;
  
  // Calculate distance if coordinates are provided
  const distance = processGeographicData(originLat, originLng, destLat, destLng);

  // Assemble and return the final result
  return {
    ...result,
    recommendedContainer,
    routeDistanceKm: distance,
    insights
  };
}
