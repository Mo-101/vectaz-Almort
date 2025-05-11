
// symbolicOrchestrator.ts - Orchestrates the symbolic engine flow
// This file re-exports from the modularized structure

import { runNeuroSymbolicCycle } from './engine';
import { SymbolicInput, SymbolicResult, ForwarderScore, LaneInsight } from './types';
import { processGeographicData, normalizeKPI, deriveLaneCode } from './utils';

// Re-export types and functions for backward compatibility
export { 
  runNeuroSymbolicCycle,
  processGeographicData,
  normalizeKPI,
  deriveLaneCode,
  type SymbolicInput, 
  type SymbolicResult,
  type ForwarderScore,
  type LaneInsight
};
