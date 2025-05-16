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

// For line 139:
weight: typeof shipment.weight_kg === 'string' 
  ? parseFloat(shipment.weight_kg as string) + offsetWeight 
  : (shipment.weight_kg as number) + offsetWeight,

// For line 224:
origin_longitude: typeof shipment.origin_longitude === 'string' 
  ? parseFloat(shipment.origin_longitude as string) + (Math.random() - 0.5) * 0.1 
  : (shipment.origin_longitude as number) + (Math.random() - 0.5) * 0.1,

// For line 225:
origin_latitude: typeof shipment.origin_latitude === 'string' 
  ? parseFloat(shipment.origin_latitude as string) + (Math.random() - 0.5) * 0.1 
  : (shipment.origin_latitude as number) + (Math.random() - 0.5) * 0.1,

// For line 236:
destination_longitude: typeof shipment.destination_longitude === 'string' 
  ? parseFloat(shipment.destination_longitude as string) + (Math.random() - 0.5) * 0.05 
  : (shipment.destination_longitude as number) + (Math.random() - 0.5) * 0.05,
