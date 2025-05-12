
/**
 * Analytics Types
 * 
 * This file contains types related to analytics, metrics, and trends.
 */

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface HistoricalTrends {
  totalShipments?: { change: number; direction: TrendDirection };
  onTimeRate?: { baseline: number; change: number };
}

export interface ShipmentAnalyticsProps {
  metrics: import('./shipment').ShipmentMetrics;
}

export interface EnhancedMetric {
  value: number;
  previousValue?: number;
  trend?: TrendDirection;
  trendValue?: number;
  status?: 'good' | 'warning' | 'critical';
  target?: number;
  unit?: string;
}

export interface ShipmentEnhancedMetrics {
  valuePerShipment: EnhancedMetric;
  costVariance: EnhancedMetric;
  documentAccuracy: EnhancedMetric;
  onTimeDeliveryRate: EnhancedMetric;
  containerUtilization: EnhancedMetric;
  carbonFootprint: EnhancedMetric;
  leadTimeVariance: EnhancedMetric;
  routeRiskAssessment: EnhancedMetric;
}

export interface KPIResults {
  onTimeRate: number;
  avgTransitDays: number;
  modeSplit: {
    air: number;
    sea: number;
    road: number;
  };
}
