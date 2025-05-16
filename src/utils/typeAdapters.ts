
import { Shipment as UIShipment, CountryPerformance as UICountryPerformance, ShipmentMetrics, CarrierPerformance } from '@/types/deeptrack';
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
    freight_carrier: shipment.freight_carrier || shipment.carrier?.toString() || '',
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
      parseFloat(shipment.weight_kg) : (shipment.weight_kg || 0),
    // Add other missing required fields with defaults
    initial_quote_awarded: shipment.initial_quote_awarded || '',
    final_quote_awarded_freight_forwader_Carrier: shipment.final_quote_awarded_freight_forwader_Carrier || '',
    comments: shipment.comments || '',
    date_of_arrival_destination: shipment.date_of_arrival_destination || '',
    forwarder_quotes: shipment.forwarder_quotes || {}
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
    totalVolume: metrics.totalVolume || 0,
    totalCost: metrics.totalCost || 0,
    // Add the additional properties needed by components
    forwarderPerformance: metrics.forwarderPerformance || {},
    topForwarder: metrics.topForwarder || "DHL Express",
    carrierCount: metrics.carrierCount || 8,
    topCarrier: metrics.topCarrier || "Kenya Airways"
  } as ShipmentMetrics;
}

/**
 * Converts any shipment object to a valid UI Shipment with all required fields
 */
export function ensureCompleteShipment(shipment: Partial<UIShipment>): UIShipment {
  return {
    carrier: shipment.carrier || '',
    date_of_collection: shipment.date_of_collection || new Date().toISOString(),
    request_reference: shipment.request_reference || `SR-${Date.now()}`,
    cargo_description: shipment.cargo_description || '',
    item_category: shipment.item_category || '',
    origin_country: shipment.origin_country || '',
    origin_longitude: shipment.origin_longitude || 0,
    origin_latitude: shipment.origin_latitude || 0,
    destination_country: shipment.destination_country || '',
    destination_longitude: shipment.destination_longitude || 0,
    destination_latitude: shipment.destination_latitude || 0,
    weight_kg: shipment.weight_kg || 0,
    volume_cbm: shipment.volume_cbm || 0,
    initial_quote_awarded: shipment.initial_quote_awarded || '',
    final_quote_awarded_freight_forwader_Carrier: shipment.final_quote_awarded_freight_forwader_Carrier || '',
    comments: shipment.comments || '',
    date_of_arrival_destination: shipment.date_of_arrival_destination || '',
    delivery_status: shipment.delivery_status || 'pending',
    mode_of_shipment: shipment.mode_of_shipment || 'air',
    forwarder_quotes: shipment.forwarder_quotes || {},
    freight_carrier: shipment.freight_carrier || shipment.carrier?.toString() || '',
    // Additional fields
    id: shipment.id || `${Date.now()}`,
    status: shipment.status || shipment.delivery_status || 'pending',
    created_at: shipment.created_at || new Date().toISOString(),
    updated_at: shipment.updated_at || new Date().toISOString(),
    data_validated: shipment.data_validated || false
  } as UIShipment;
}
