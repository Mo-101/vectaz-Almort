
export interface ForwarderScore {
  forwarder: string;
  score: number;
  closeness: number;
  costPerformance: number;
  timePerformance: number;
  reliabilityPerformance: number;
  greyGrade?: number; // Added for Grey Relational Analysis
  explanation?: any;
  neutrosophic?: {
    T: number;  // Truth (on-time delivery performance)
    I: number;  // Indeterminacy (operational uncertainty)
    F: number;  // Falsity (service failures and exceptions)
  };
}

export interface WeightFactors {
  cost: number;
  time: number;
  reliability: number;
}

export interface QuoteData {
  forwarder: string;
  price: string;
  currency: string;
  transitDays: string;
  reliability: string;
}

export interface DeepCALProps {
  voicePersonality?: string;
  voiceEnabled?: boolean;
}

export interface SymbolicEngineResult {
  topChoice: string;
  confidence: number;
  recommendedContainer?: string;
  routeDistanceKm?: number;
  insights: {
    name: string;
    issue: string;
  }[];
  allScores: number[];
}
