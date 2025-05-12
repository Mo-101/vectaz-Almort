
/**
 * Shipment Types
 * 
 * This file contains types related to shipments and their attributes.
 */

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
  expected_delivery_date?: string | null;
  status?: string;
  created_at?: string;
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
    onTime?: number;
    inTransit?: number;
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
  destinationCountryCount?: number;
  originCountryCount?: number;
  avgValuePerShipment?: number;
  documentationAccuracy?: number;
  costVariance?: number;
  leadTimeVariance?: number;
  onTimeInFullRate?: number;
  totalShipmentValue?: number;
  capacityUtilization?: number;
  totalDistance?: number;
  avgDistance?: number;
  routeRiskAssessment?: Record<string, number>;
  carbonFootprint?: number;
  performanceByRegion?: Record<string, number>;
  weatherImpactScore?: number;
  outlierShipments?: number;
  routeCount?: number;
}

export interface ShipmentPerformanceTrend {
  period: string;
  transitTime: number;
  onTimeRate: number;
  cost: number;
  disruptions?: number;
  shipmentCount?: number;
}

export interface CSVShipment {
  origin_country: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_country: string;
  destination_latitude: number;
  destination_longitude: number;
}
