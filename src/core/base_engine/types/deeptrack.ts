
export interface Shipment {
  carrier: any;
  date_of_collection: string;
  request_reference: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  origin_longitude: number;
  origin_latitude: number;
  destination_country: string;
  destination_longitude: number;
  destination_latitude: number;
  freight_carrier: string;
  weight_kg: number;
  volume_cbm: number;
  initial_quote_awarded: string;
  final_quote_awarded_freight_forwader_Carrier: string;
  comments: string;
  date_of_arrival_destination: string;
  delivery_status: string;
  mode_of_shipment: string;
  forwarder_quotes: Record<string, number>;
}

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
}

export interface RoutePerformance {
  origin: string;
  destination: string;
  avgTransitDays: number;
  avgCostPerKg: number;
  disruptionScore: number;
  reliabilityScore: number;
  totalShipments: number;
}

export interface CountryPerformance {
  country: string;
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
}

export interface ShipmentMetrics {
  totalShipments: number;
  shipmentsByMode: Record<string, number>;
  monthlyTrend: Array<{month: string, count: number}>;
  delayedVsOnTimeRate: {onTime: number, delayed: number};
  avgTransitTime: number;
  disruptionProbabilityScore: number;
  shipmentStatusCounts: {active: number, completed: number, failed: number, onTime?: number, inTransit?: number, delayed?: number, cancelled?: number, pending?: number};
  resilienceScore: number;
  noQuoteRatio: number;
  totalWeight: number;
  totalVolume: number;
  totalCost: number;
  avgCostPerKg: number;
}

export type AppSection = 'map' | 'analytics' | 'deepcal' | 'about' | 'settings';

export interface TabItem {
  id: AppSection;
  label: string;
  icon: React.ComponentType<any>;
}

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
