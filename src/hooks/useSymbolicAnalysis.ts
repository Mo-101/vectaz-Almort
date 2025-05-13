
import { useState, useEffect } from 'react';
import { Shipment } from '@/components/OracleHut/types/types';
import { ForwarderPerformance } from '@/types/deeptrack';
import { runNeuroSymbolicCycle } from '@/symbolic-engine/orchestrator/symbolicOrchestrator';

/**
 * Custom hook to perform symbolic analysis on shipment data
 */
export const useSymbolicAnalysis = (
  shipmentData: Shipment[],
  forwarders: ForwarderPerformance[]
) => {
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!shipmentData || shipmentData.length === 0 || !forwarders || forwarders.length === 0) {
      return;
    }

    try {
      console.log("Running symbolic analysis on data", {
        shipments: shipmentData.length,
        forwarders: forwarders.length
      });

      // Extract forwarder data for symbolic analysis
      const forwarderData = forwarders.slice(0, 4).map(f => ({
        name: f.name,
        reliability: f.reliabilityScore || 0.7,
        delayRate: 0.1 // Default value
      }));
      
      // Create input for symbolic engine
      const input = {
        decisionMatrix: forwarders.slice(0, 4).map(f => [
          f.costScore || 0.7,
          f.timeScore || 0.7,
          f.reliabilityScore || 0.7
        ]),
        weights: [0.4, 0.3, 0.3],
        criteriaTypes: ['benefit', 'benefit', 'benefit'],
        alternatives: forwarders.slice(0, 4).map(f => f.name),
        forwarders: forwarderData,
        
        // Add shipment-related data for container recommendation
        weight: 14500, // Default weight in kg
        volume: 45,    // Default volume in m³
        
        // Add route analysis data
        originLat: 1.2921,
        originLng: 36.8219,
        destLat: -17.8252,
        destLng: 31.0335,
      };
      
      // Run the symbolic engine
      const result = runNeuroSymbolicCycle(input);
      console.log("Symbolic analysis complete", result);
      
      setResults(result);
    } catch (error) {
      console.error("Error running symbolic analysis:", error);
    }
  }, [shipmentData, forwarders]);

  return results;
};
