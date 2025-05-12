
/**
 * Forwarder Types
 * 
 * This file contains types related to forwarders and their performance metrics.
 */

export interface ForwarderPerformance {
  name: string;
  totalShipments: number;
  avgCostPerKg: number;
  avgTransitDays: number;
  onTimeRate: number;
  reliabilityScore: number;
  deepScore?: number;
  costScore?: number;
  timeScore?: number;
  quoteWinRate?: number;
  serviceScore?: number;
  punctualityScore?: number;
  handlingScore?: number;
  shipments?: number;
  reliability?: number;
  id?: string;
  performanceTrend?: 'up' | 'down' | 'stable';
  failureRate?: number;
  documentationAccuracy?: number;
  customerSatisfaction?: number;
  costEfficiencyRatio?: number;
  leadTimeVariance?: number;
  routeResilienceScore?: number;
}

export interface CarrierPerformance {
  name: string;
  totalShipments: number;
  avgTransitDays: number;
  onTimeRate: number;
  reliabilityScore: number;
  serviceScore?: number;
  punctualityScore?: number;
  handlingScore?: number;
  shipments: number;
  reliability: number;
  lastMonthPerformance?: number;
  performance3MonthTrend?: 'up' | 'down' | 'stable';
  capacityUtilization?: number;
  disruptionFrequency?: number;
  routeEfficiency?: number;
}
