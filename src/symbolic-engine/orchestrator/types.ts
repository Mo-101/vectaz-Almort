
// types.ts - Type definitions for symbolic orchestration

import { Insight } from '../services/insightEngine';

/**
 * Input data structure for the symbolic engine
 */
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

/**
 * Output data structure from the symbolic engine
 */
export interface SymbolicResult {
  topChoice: string;
  confidence: number;
  recommendedContainer?: string;
  routeDistanceKm?: number;
  insights: Insight[];
  allScores: number[];
}

/**
 * Forwarder score type for detailed analytics
 */
export interface ForwarderScore {
  name: string;
  score: number;
  reliabilityFactor?: number;
}

/**
 * Type for lane-specific insights
 */
export interface LaneInsight {
  origin: string;
  destination: string;
  distanceKm: number;
  averageTransitDays: number;
  riskFactors: string[];
}
