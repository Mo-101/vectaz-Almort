
/**
 * DeepCAL Unified Engine
 * 
 * This is the main entry point for the DeepCAL engine. It exports all the functionality
 * from the various sub-modules of the engine.
 */

// Export core initialization functionality
export * from './boot';

// Export data-related functionality
export * from './data/loader';
export * from './data/sourceRegistry';

// Export decision engine functionality
export * from './decision/computeRankings';
export * from './decision/forwarderScore';

// Re-export types with care to avoid collisions
export type {
  CriteriaWeights,
  CriteriaType,
  Recommendation,
  DecisionResult
} from './decision/types';

// Export symbolic engine functionality
export * from './symbolic/orchestrator';
export * from './symbolic/logic';

// Export training functionality
export * from './training/modelTrainer';
export * from './training/sessionState';

// Export query processing functionality
export * from './query/processor';
export * from './query/metrics';
