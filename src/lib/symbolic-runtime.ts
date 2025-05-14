
import { symbolicStats } from './symbolic/stats';
import { analyzeShipmentWithSymbolic } from './symbolic/shipmentAnalysis';
import { trainSymbolicEngine } from './symbolic/training';

// Create a cache to prevent redundant processing
const symbolCache = new Map();

/**
 * Enhanced symbolic runtime that prefers local data and uses caching
 * to prevent redundant processing and Supabase calls
 */

// Re-export all symbolic functionality from a single entry point
export {
  symbolicStats,
  analyzeShipmentWithSymbolic,
  trainSymbolicEngine
};

/**
 * Cache manager for symbolic results to reduce processing and Supabase load
 */
export const symbolCache = {
  // Get a cached result if available
  get: (key: string): any | null => {
    const cachedItem = symbolCache.get(key);
    if (!cachedItem) return null;
    
    // Check if cache is still valid (5 minutes)
    if (Date.now() - cachedItem.timestamp > 5 * 60 * 1000) {
      symbolCache.delete(key);
      return null;
    }
    
    return cachedItem.data;
  },
  
  // Store a result in cache
  set: (key: string, data: any): void => {
    symbolCache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Limit cache size to prevent memory issues
    if (symbolCache.size > 100) {
      // Delete oldest entries
      const keysIter = symbolCache.keys();
      for (let i = 0; i < 20; i++) {
        const oldKey = keysIter.next().value;
        if (oldKey) symbolCache.delete(oldKey);
      }
    }
  },
  
  // Clear all cached results
  clear: (): void => {
    symbolCache.clear();
  }
};
