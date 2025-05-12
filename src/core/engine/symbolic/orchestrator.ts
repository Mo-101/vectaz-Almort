
/**
 * Symbolic Engine Orchestrator
 * 
 * This module orchestrates the symbolic engine flow, coordinating
 * between different symbolic reasoning components.
 */
import { detectAnomalies } from './logic';

/**
 * Input type definition for the neuro-symbolic cycle
 */
export interface SymbolicInput {
  decisionMatrix: number[][];
  weights: number[];
  criteriaTypes: ("benefit" | "cost")[];
  alternatives: string[];
  forwarders?: Array<{
    name: string;
    reliability: number;
    delayRate: number;
  }>;
  weight?: number;
  volume?: number;
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
}

/**
 * Result type definition for the neuro-symbolic cycle
 */
export interface SymbolicResult {
  topAlternative: {
    name: string;
    score: number;
  };
  alternatives?: Array<{
    name: string;
    score: number;
  }>;
  recommendedContainer?: {
    type: string;
    capacity: string;
    dimensions: string;
  };
  routeDistanceKm?: number;
  insights?: Array<{
    forwarder: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface ForwarderScore {
  name: string;
  score: number;
  reliability: number;
}

export interface LaneInsight {
  origin: string;
  destination: string;
  congestion: number;
  risk: number;
}

/**
 * Process geographic data to calculate distance
 */
export function processGeographicData(
  originLat?: number,
  originLng?: number,
  destLat?: number,
  destLng?: number
): number | undefined {
  if (!originLat || !originLng || !destLat || !destLng) {
    return undefined;
  }
  
  // Calculate distance using Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = (destLat - originLat) * Math.PI / 180;
  const dLng = (destLng - originLng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(originLat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Normalize a KPI value
 */
export function normalizeKPI(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/**
 * Derive a lane code from origin and destination
 */
export function deriveLaneCode(origin: string, destination: string): string {
  return `${origin.substring(0, 3)}_${destination.substring(0, 3)}`.toUpperCase();
}

/**
 * Select appropriate container based on weight and volume
 */
export function selectContainer(weight?: number, volume?: number): {
  type: string;
  capacity: string;
  dimensions: string;
} | undefined {
  if (!weight || !volume) return undefined;
  
  if (weight > 20000 || volume > 33) {
    return {
      type: "40ft High Cube",
      capacity: "26,000 kg",
      dimensions: "12.0m x 2.35m x 2.69m"
    };
  } else if (weight > 10000 || volume > 25) {
    return {
      type: "40ft Standard",
      capacity: "26,000 kg",
      dimensions: "12.0m x 2.35m x 2.38m"
    };
  } else {
    return {
      type: "20ft Standard",
      capacity: "24,000 kg",
      dimensions: "5.9m x 2.35m x 2.38m"
    };
  }
}

/**
 * Main function to run the neuro-symbolic decision cycle
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
    destLng,
    forwarders
  } = input;

  // Run the decision evaluation
  const result = evaluateDecision(matrix, weights, types, names);

  // Generate insights from forwarder data
  const insights = forwarders ? detectAnomalies(forwarders) : undefined;
  
  // Add container recommendation if weight and volume are provided
  const recommendedContainer = selectContainer(weight, volume);
  
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

/**
 * Evaluate a decision based on a matrix, weights, and criteria types
 */
function evaluateDecision(
  matrix: number[][],
  weights: number[],
  types: ("benefit" | "cost")[],
  names: string[]
): {
  topAlternative: { name: string; score: number };
  alternatives: Array<{ name: string; score: number }>;
} {
  // Normalize the decision matrix
  const normalizedMatrix = normalizeMatrix(matrix, types);
  
  // Apply weights to the normalized matrix
  const weightedMatrix = applyWeights(normalizedMatrix, weights);
  
  // Calculate scores for each alternative
  const scores = calculateScores(weightedMatrix, types, matrix.length);
  
  // Create named alternatives with scores
  const alternatives = scores.map((score, i) => ({
    name: names[i],
    score: Math.round(score * 100) / 100
  }));
  
  // Sort alternatives by score
  alternatives.sort((a, b) => b.score - a.score);
  
  return {
    topAlternative: alternatives[0],
    alternatives
  };
}

/**
 * Normalize a decision matrix
 */
function normalizeMatrix(matrix: number[][], types: ("benefit" | "cost")[]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;
  const normalizedMatrix = Array(m).fill(0).map(() => Array(n).fill(0));
  
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < m; i++) {
      sum += matrix[i][j] * matrix[i][j];
    }
    const sqrt = Math.sqrt(sum);
    
    for (let i = 0; i < m; i++) {
      normalizedMatrix[i][j] = matrix[i][j] / sqrt;
    }
  }
  
  return normalizedMatrix;
}

/**
 * Apply weights to a normalized matrix
 */
function applyWeights(matrix: number[][], weights: number[]): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;
  const weightedMatrix = Array(m).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      weightedMatrix[i][j] = matrix[i][j] * weights[j];
    }
  }
  
  return weightedMatrix;
}

/**
 * Calculate scores for alternatives based on a weighted normalized matrix
 */
function calculateScores(matrix: number[][], types: ("benefit" | "cost")[], m: number): number[] {
  const n = matrix[0].length;
  
  // Find ideal and anti-ideal solutions
  const idealSolution = Array(n).fill(0);
  const antiIdealSolution = Array(n).fill(0);
  
  for (let j = 0; j < n; j++) {
    const values = matrix.map(row => row[j]);
    if (types[j] === 'benefit') {
      idealSolution[j] = Math.max(...values);
      antiIdealSolution[j] = Math.min(...values);
    } else {
      idealSolution[j] = Math.min(...values);
      antiIdealSolution[j] = Math.max(...values);
    }
  }
  
  // Calculate separation measures
  const idealSeparation = Array(m).fill(0);
  const antiIdealSeparation = Array(m).fill(0);
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      idealSeparation[i] += Math.pow(matrix[i][j] - idealSolution[j], 2);
      antiIdealSeparation[i] += Math.pow(matrix[i][j] - antiIdealSolution[j], 2);
    }
    idealSeparation[i] = Math.sqrt(idealSeparation[i]);
    antiIdealSeparation[i] = Math.sqrt(antiIdealSeparation[i]);
  }
  
  // Calculate relative closeness to the ideal solution
  const relativeCloseness = Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    relativeCloseness[i] = antiIdealSeparation[i] / (idealSeparation[i] + antiIdealSeparation[i]);
  }
  
  return relativeCloseness;
}
