
// types.ts - Type definitions for symbolic orchestration

import { Insight } from '../services/insightEngine';

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
