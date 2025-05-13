
import { Shipment, ShipmentMetrics } from '@/types/deeptrack';
import { calculateShipmentMetrics } from '@/utils/analyticsUtils';

export function someFunction(value: string | number) {
  // Convert to number if it's a string
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  return numberValue + 10; // Now it's adding number + number
}

// Add the computeShipmentInsights function
export function computeShipmentInsights(shipmentData: Shipment[]): ShipmentMetrics {
  console.log(`Computing insights from ${shipmentData.length} shipments`);
  
  try {
    // Use the existing utility to calculate metrics
    const metrics = calculateShipmentMetrics(shipmentData);
    
    // Return the metrics without totalWeight, since it's not in ShipmentMetrics
    const { 
      totalShipments, 
      avgTransitTime, 
      avgCostPerKg, 
      resilienceScore, 
      shipmentsByMode, 
      monthlyTrend, 
      delayedVsOnTimeRate,
      shipmentStatusCounts,
      noQuoteRatio, 
      disruptionProbabilityScore 
    } = metrics;
    
    // Create a new object with only the properties defined in ShipmentMetrics
    const validMetrics: ShipmentMetrics = {
      totalShipments,
      avgTransitTime,
      avgCostPerKg,
      resilienceScore,
      shipmentsByMode,
      monthlyTrend,
      delayedVsOnTimeRate,
      shipmentStatusCounts,
      noQuoteRatio,
      disruptionProbabilityScore
    };
    
    return validMetrics;
  } catch (error) {
    console.error("Error computing shipment insights:", error);
    
    // Return a minimal valid metrics object to prevent UI crashes
    return {
      totalShipments: shipmentData.length,
      avgTransitTime: 0,
      avgCostPerKg: 0,
      resilienceScore: 0,
      shipmentsByMode: {},
      monthlyTrend: [],
      delayedVsOnTimeRate: { onTime: 0, delayed: 0 },
      shipmentStatusCounts: { active: 0, completed: 0, failed: 0 },
      noQuoteRatio: 0,
      disruptionProbabilityScore: 0
    };
  }
}
