
import { useState, useEffect } from 'react';
import { ForwarderPerformance } from '@/types/deeptrack';
import { runNeuroSymbolicCycle } from '@/symbolic-engine/orchestrator/symbolicOrchestrator';
import { Shipment } from '@/types/deeptrack';

interface SymbolicAnalysisResult {
  topChoice?: string;
  confidence?: number;
  recommendedContainer?: string;
  routeDistanceKm?: number;
  insights?: Array<{
    name: string;
    issue: string;
  }>;
  allScores?: number[];
}

export const useSymbolicAnalysis = (
  shipmentData: Shipment[], 
  forwarderData: ForwarderPerformance[]
): SymbolicAnalysisResult | null => {
  const [results, setResults] = useState<SymbolicAnalysisResult | null>(null);

  useEffect(() => {
    if (!shipmentData.length || !forwarderData.length) {
      console.warn("Insufficient data for symbolic analysis");
      return;
    }

    try {
      // Prepare sample input for symbolic engine
      const decisionMatrix = forwarderData.slice(0, 4).map(f => [
        f.reliabilityScore || 0.7,
        f.onTimeRate / 100 || 0.8, 
        f.avgTransitDays ? 1 / (f.avgTransitDays + 1) : 0.75 // Normalize transit days
      ]);

      // Sample weights for criteria
      const weights = [0.4, 0.3, 0.3];
      const criteriaTypes: ("benefit" | "cost")[] = ['benefit', 'benefit', 'benefit'];
      const alternatives = forwarderData.slice(0, 4).map(f => f.name);

      // Sample shipment details
      const sampleShipment = shipmentData[0];
      const weight = typeof sampleShipment?.weight_kg === 'string' 
        ? parseFloat(sampleShipment.weight_kg) 
        : (sampleShipment?.weight_kg || 14500);
      const volume = typeof sampleShipment?.volume_cbm === 'string'
        ? parseFloat(sampleShipment.volume_cbm)
        : (sampleShipment?.volume_cbm || 45);
      const originLat = sampleShipment?.origin_latitude || 1.3521;
      const originLng = sampleShipment?.origin_longitude || 103.8198;
      const destLat = sampleShipment?.destination_latitude || -33.8688;
      const destLng = sampleShipment?.destination_longitude || 151.2093;
      
      // Run the symbolic engine
      const result = runNeuroSymbolicCycle({
        decisionMatrix,
        weights,
        criteriaTypes,
        alternatives,
        forwarders: forwarderData.slice(0, 4).map(f => ({
          name: f.name,
          reliability: f.reliabilityScore,
          delayRate: 1 - (f.onTimeRate || 0) / 100
        })),
        weight,
        volume,
        originLat,
        originLng,
        destLat,
        destLng
      });

      console.log("Symbolic engine result:", result);
      setResults(result);
    } catch (error) {
      console.error("Error running symbolic analysis:", error);
    }
  }, [shipmentData, forwarderData]);

  return results;
};
