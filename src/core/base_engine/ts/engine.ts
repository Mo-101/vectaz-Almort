
export interface MoScriptResult {
  topAlternative: {
    name: string;
    score: number;
    index?: number;
  };
  alternatives?: Array<{
    name: string;
    score: number;
  }>;
  metrics?: Record<string, any>;
  allScores?: number[];
  rawTopsisScores?: number[];
  greyGrades?: number[];
  executionTime?: number;
  consistencyRatio?: number;
}

export interface MoScript {
  id: string;
  trigger: string;
  logic: (inputs: Record<string, any>) => MoScriptResult;
  voiceLine?: (result: MoScriptResult) => string;
  sass?: boolean;
}

export interface Alternative {
  id: string;
  name: string;
  criteriaValues: number[];
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

export type CriteriaType = 'benefit' | 'cost';

export interface DecisionRequest {
  decisionMatrix: number[][];
  pairwiseMatrix: number[][];
  criteriaTypes: CriteriaType[];
  alternativeNames?: string[];
  criteriaNames?: string[];
}

export interface ForwarderEvaluation {
  name: string;
  cost: number;
  time: number;
  reliability: number;
  serviceQuality: number;
  sustainability: number;
  score: number;
}

export interface VoiceTone {
  speed: number;
  pitch: number;
  color: string;
}

// Utility functions for handling numeric operations with string or number types
export function safelyAddNumber(value1: string | number, value2: number): number {
  const numValue1 = typeof value1 === 'string' ? parseFloat(value1) : value1;
  return numValue1 + value2;
}

export function safelyAddRandomOffset(value: string | number, offsetRange: number): number {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue + (Math.random() - 0.5) * offsetRange;
}
