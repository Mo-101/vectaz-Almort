
import { Shipment as UIShipment, CountryPerformance as UICountryPerformance, ShipmentMetrics } from '@/types/deeptrack';
import { Shipment as EngineShipment, CountryPerformance as EngineCountryPerformance } from '@/core/base_engine/types/deeptrack';

/**
 * Adapts UI Shipment type to Engine Shipment type
 * This resolves the type compatibility issues between the different Shipment interfaces
 */
export function adaptShipmentForEngine(shipment: UIShipment): EngineShipment {
  // Force-cast with required properties (and type checking)
  return {
    ...shipment,
    // Ensure required properties exist even if they're optional in the UI type
    freight_carrier: shipment.freight_carrier || '',
    // Convert all string coordinates to numbers
    origin_longitude: typeof shipment.origin_longitude === 'string' ? 
      parseFloat(shipment.origin_longitude) : (shipment.origin_longitude || 0),
    origin_latitude: typeof shipment.origin_latitude === 'string' ? 
      parseFloat(shipment.origin_latitude) : (shipment.origin_latitude || 0),
    destination_longitude: typeof shipment.destination_longitude === 'string' ? 
      parseFloat(shipment.destination_longitude) : (shipment.destination_longitude || 0),
    destination_latitude: typeof shipment.destination_latitude === 'string' ? 
      parseFloat(shipment.destination_latitude) : (shipment.destination_latitude || 0),
    weight_kg: typeof shipment.weight_kg === 'string' ? 
      parseFloat(shipment.weight_kg) : (shipment.weight_kg || 0)
  } as EngineShipment;
}

/**
 * Adapts array of UI Shipments to Engine Shipments
 */
export function adaptShipmentsForEngine(shipments: UIShipment[]): EngineShipment[] {
  return shipments.map(adaptShipmentForEngine);
}

/**
 * Adapts Engine CountryPerformance to UI CountryPerformance
 */
export function adaptCountryPerformanceForUI(countryPerf: EngineCountryPerformance): UICountryPerformance {
  return {
    ...countryPerf,
    // Add required properties for UI type
    totalWeight: countryPerf.totalWeight || 0,
    totalVolume: countryPerf.totalVolume || 0,
    totalCost: countryPerf.totalCost || 0,
    avgDelayDays: countryPerf.avgDelayDays || 0
  } as UICountryPerformance;
}

/**
 * Adapts array of Engine CountryPerformance to UI CountryPerformance
 */
export function adaptCountryPerformancesForUI(countryPerfs: EngineCountryPerformance[]): UICountryPerformance[] {
  return countryPerfs.map(adaptCountryPerformanceForUI);
}

/**
 * Ensures ShipmentMetrics has required fields
 */
export function ensureCompleteMetrics(metrics: Partial<ShipmentMetrics>): ShipmentMetrics {
  return {
    totalShipments: metrics.totalShipments || 0,
    avgTransitTime: metrics.avgTransitTime || 0,
    avgCostPerKg: metrics.avgCostPerKg || 0,
    resilienceScore: metrics.resilienceScore || 0,
    shipmentsByMode: metrics.shipmentsByMode || {},
    monthlyTrend: metrics.monthlyTrend || [],
    delayedVsOnTimeRate: metrics.delayedVsOnTimeRate || { onTime: 0, delayed: 0 },
    shipmentStatusCounts: metrics.shipmentStatusCounts || { active: 0, completed: 0, failed: 0 },
    noQuoteRatio: metrics.noQuoteRatio || 0,
    disruptionProbabilityScore: metrics.disruptionProbabilityScore || 0,
    totalWeight: metrics.totalWeight || 0,
    totalVolume: metrics.totalVolume || 0
  } as ShipmentMetrics;
}
