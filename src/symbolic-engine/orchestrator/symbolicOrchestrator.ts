
// symbolicOrchestrator.ts - Orchestrates the symbolic engine flow
// This file now re-exports from the modularized structure

import { runNeuroSymbolicCycle } from './engine';
import { SymbolicInput, SymbolicResult } from './types';
import { processGeographicData } from './utils';

// Re-export types and functions for backward compatibility
export { 
  runNeuroSymbolicCycle,
  processGeographicData,
  type SymbolicInput, 
  type SymbolicResult 
};
