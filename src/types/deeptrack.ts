
export interface Shipment {
  id?: string;
  request_reference: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_country: string;
  destination_latitude: number;
  destination_longitude: number;
  carrier: string;
  "carrier+cost"?: string;
  "freight_carrier+cost"?: string;
  freight_carrier?: string;
  kuehne_nagel?: string | number | boolean;
  scan_global_logistics?: string | number | boolean;
  dhl_express?: string | number | boolean;
  dhl_global?: string | number | boolean;
  bwosi?: string | number | boolean;
  agl?: string | number | boolean;
  siginon?: string | number | boolean;
  frieght_in_time?: string | number | boolean;
  weight_kg: string | number;
  volume_cbm: string | number;
  initial_quote_awarded?: string;
  final_quote_awarded_freight_forwader_Carrier?: string;
  comments?: string;
  date_of_collection: string;
  date_of_arrival_destination?: string;
  delivery_status?: string;
  mode_of_shipment?: string;
  date_of_greenlight_to_pickup?: string | null;
  forwarder_quotes?: Record<string, number>;
  updated_at?: string;
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
  serviceScore?: number;
  punctualityScore?: number;
  handlingScore?: number;
  shipments?: number;
  reliability?: number;
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
  monthlyTrend: Array<{ month: string; count: number }>;
  delayedVsOnTimeRate: { onTime: number; delayed: number };
  avgTransitTime: number;
  disruptionProbabilityScore: number;
  shipmentStatusCounts: {
    active: number;
    completed: number;
    failed: number;
    onTime: number;
    inTransit: number;
    delayed?: number;
    cancelled?: number;
    pending?: number;
  };
  resilienceScore: number;
  noQuoteRatio: number;
  forwarderPerformance?: Record<string, number>;
  carrierPerformance?: Record<string, number>;
  topForwarder?: string;
  topCarrier?: string;
  carrierCount?: number;
  avgCostPerKg: number;
}

export type AppSection = 'map' | 'analytics' | 'deepcal' | 'about' | 'settings' | 'forms';

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

export type TrendDirection = 'up' | 'down' | 'neutral';

interface KPIResults {
  onTimeRate: number;
  avgTransitDays: number;
  modeSplit: {
    air: number;
    sea: number;
    road: number;
  };
}

export interface HistoricalTrends {
  totalShipments?: { change: number; direction: TrendDirection };
  onTimeRate?: { baseline: number; change: number };
}

export interface ShipmentAnalyticsProps {
  metrics: ShipmentMetrics;
}

export interface CSVShipment {
  origin_country: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_country: string;
  destination_latitude: number;
  destination_longitude: number;
}
