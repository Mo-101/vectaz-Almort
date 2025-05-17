
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

// Decision engine implementation
export const decisionEngine = {
  // Sample decision engine methods to be implemented
  calculateTopsis: (request: DecisionRequest): DecisionResult => {
    // This is a placeholder implementation
    // In a real application, implement the actual TOPSIS algorithm
    
    const scores = request.alternativeNames?.map((_, index) => 0.5 + Math.random() * 0.5) || [];
    const maxIndex = scores.reduce((maxIdx, score, idx, arr) => 
      score > arr[maxIdx] ? idx : maxIdx, 0);
    
    return {
      topAlternative: {
        index: maxIndex,
        name: request.alternativeNames?.[maxIndex] || `Alternative ${maxIndex}`,
        score: scores[maxIndex]
      },
      allScores: scores,
      executionTime: 15 + Math.random() * 50,
      consistencyRatio: 0.05 + Math.random() * 0.05
    };
  },
  
  calculateAHP: (request: DecisionRequest): DecisionResult => {
    // Placeholder for AHP implementation
    const scores = request.alternativeNames?.map((_, index) => 0.5 + Math.random() * 0.5) || [];
    const maxIndex = scores.reduce((maxIdx, score, idx, arr) => 
      score > arr[maxIdx] ? idx : maxIdx, 0);
    
    return {
      topAlternative: {
        index: maxIndex,
        name: request.alternativeNames?.[maxIndex] || `Alternative ${maxIndex}`,
        score: scores[maxIndex]
      },
      allScores: scores,
      executionTime: 15 + Math.random() * 50,
      consistencyRatio: 0.05 + Math.random() * 0.05
    };
  }
};

// Export interface for utility functions for operations
export const mathOps = {
  safelyAddNumber,
  safelyAddRandomOffset,
  
  // Additional utility functions for matrix operations
  normalizeVector: (vector: number[]): number[] => {
    const sum = vector.reduce((sum, val) => sum + val, 0);
    return vector.map(val => val / sum);
  },
  
  // Matrix multiplication
  multiplyMatrices: (matrixA: number[][], matrixB: number[][]): number[][] => {
    // Implementation would go here
    return [[]]; // Placeholder return
  }
};
