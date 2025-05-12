
/**
 * Location Types
 * 
 * This file contains types related to countries, warehouses, and their performance metrics.
 */

export interface CountryPerformance {
  totalWeight: number;
  totalVolume: number;
  totalCost: number;
  avgDelayDays: number;
  forwarder?(forwarder: any): unknown;
  country: string;
  name?: string;
  totalShipments: number;
  avgCostPerRoute: number;
  avgCustomsClearanceTime: number;
  deliveryFailureRate: number;
  borderDelayIncidents: number;
  resilienceIndex: number;
  preferredMode: string;
  topForwarders: string[];
  reliabilityScore?: number;
  avgTransitDays?: number;
  deliverySuccessRate?: number;
  currentStatusSummary?: string;
  tradingVolumeChange?: number;
  customsComplianceRate?: number;
  logisticsPerformanceIndex?: number;
  portCongestionLevel?: 'low' | 'medium' | 'high';
  lastMilePerformance?: number;
}

export interface WarehousePerformance {
  name: string;
  location: string;
  totalShipments: number;
  avgPickPackTime: number;
  packagingFailureRate: number;
  missedDispatchRate: number;
  rescheduledShipmentsRatio: number;
  reliabilityScore: number;
  preferredForwarders: string[];
  costDiscrepancy: number;
  dispatchSuccessRate?: number;
  avgTransitDays?: number;
  capacityUtilization?: number;
  laborEfficiency?: number;
  inventoryAccuracy?: number;
  equipmentDowntime?: number;
  energyEfficiency?: number;
  processingThroughput?: number;
}
