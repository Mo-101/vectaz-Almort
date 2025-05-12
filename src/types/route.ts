
/**
 * Route Types
 * 
 * This file contains types related to shipping routes, points, and performance metrics.
 */

export interface MapPoint {
  lat: number;
  lng: number;
  name: string;
  isOrigin: boolean;
}

export interface Route {
  origin: MapPoint;
  destination: MapPoint;
  weight: number;
  shipmentCount: number;
  deliveryStatus?: string;
}

export interface RoutePerformance {
  origin: string;
  destination: string;
  avgTransitDays: number;
  avgCostPerKg: number;
  disruptionScore: number;
  reliabilityScore: number;
  totalShipments: number;
  historicalDelays?: number;
  weatherRiskFactor?: number;
  geopoliticalRiskScore?: number;
  infrastructureQualityScore?: number;
}

export interface RouteRiskAssessment {
  route: string; 
  riskScore: number;
  disruptionProbability: number;
  historicalDelays: number;
  weatherFactor: number;
  geopoliticalFactor: number;
}
