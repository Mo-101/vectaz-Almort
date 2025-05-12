
/**
 * Decision Engine Types
 * 
 * This file contains the types used by the decision engine.
 */

export interface CriteriaWeights {
  cost: number;
  time: number;
  reliability: number;
}

export type CriteriaType = 'benefit' | 'cost';

export interface ForwarderScore {
  forwarder: string;
  score: number;
  closeness?: number;
  costPerformance: number;
  timePerformance: number;
  reliabilityPerformance: number;
  greyGrade?: number;
  neutrosophic?: {
    T: number;
    I: number;
    F: number;
  };
}

export interface Recommendation {
  forwarder: string;
  score: number;
  closeness: number;
  costPerformance: number;
  timePerformance: number;
  reliabilityPerformance: number;
  sourceRows?: number[];
  modelVersion: string;
  computedAt: string;
}

export interface DecisionResult {
  topAlternative: {
    index: number;
    name: string;
    score: number;
  };
  allScores: number[];
  rawTopsisScores?: number[];
  greyGrades?: number[];
  executionTime?: number;
  consistencyRatio?: number;
}
