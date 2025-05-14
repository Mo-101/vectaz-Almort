
import { symbolicStats } from './symbolic/stats';
import { analyzeShipmentWithSymbolic } from './symbolic/shipmentAnalysis';
import { trainSymbolicEngine } from './symbolic/training';

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
export const symbolCacheManager = {
  // Internal cache storage
  _cache: new Map<string, {data: any, timestamp: number}>(),
  
  // Get a cached result if available
  get: (key: string): any | null => {
    const cachedItem = symbolCacheManager._cache.get(key);
    if (!cachedItem) return null;
    
    // Check if cache is still valid (5 minutes)
    if (Date.now() - cachedItem.timestamp > 5 * 60 * 1000) {
      symbolCacheManager._cache.delete(key);
      return null;
    }
    
    return cachedItem.data;
  },
  
  // Store a result in cache
  set: (key: string, data: any): void => {
    symbolCacheManager._cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Limit cache size to prevent memory issues
    if (symbolCacheManager._cache.size > 100) {
      // Delete oldest entries
      const keysIter = symbolCacheManager._cache.keys();
      for (let i = 0; i < 20; i++) {
        const oldKey = keysIter.next().value;
        if (oldKey) symbolCacheManager._cache.delete(oldKey);
      }
    }
  },
  
  // Clear all cached results
  clear: (): void => {
    symbolCacheManager._cache.clear();
  }
};
