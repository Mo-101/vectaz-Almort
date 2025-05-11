
import { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { decisionEngine } from '@/core/engine';
import { 
  ShipmentMetrics, 
  ForwarderPerformance, 
  CountryPerformance, 
  WarehousePerformance, 
  CarrierPerformance 
} from '@/types/deeptrack';
import { 
  calculateForwarderPerformance, 
  calculateCountryPerformance,
  calculateWarehousePerformance,
  calculateCarrierPerformance
} from '@/utils/analyticsUtils';
import { computeShipmentInsights } from '@/lib/analytics/shipmentTabData';

// Interface for core metrics used in overview tab
export interface CoreMetrics {
  totalShipments: number;
  onTimeRate: number;
  avgTransitDays: number;
  costEfficiency: number;
  routeResilience: number;
  modeSplit: {
    air: number;
    sea: number;
    road: number;
  };
}

// Interface that contains all analytics metrics
export interface AnalyticsMetricsData {
  coreMetrics: CoreMetrics | null;
  shipmentMetrics: ShipmentMetrics | null;
  forwarders: ForwarderPerformance[];
  carriers: CarrierPerformance[];
  countries: CountryPerformance[];
  warehouses: WarehousePerformance[];
  calculationError: string | null;
}

export const useAnalyticsMetrics = (): AnalyticsMetricsData => {
  const { shipmentData } = useBaseDataStore();
  const [metricsData, setMetricsData] = useState<AnalyticsMetricsData>({
    coreMetrics: null,
    shipmentMetrics: null,
    forwarders: [],
    carriers: [],
    countries: [],
    warehouses: [],
    calculationError: null
  });

  useEffect(() => {
    if (!shipmentData || shipmentData.length === 0) {
      console.warn("No shipment data available");
      return;
    }

    try {
      // Initialize the decision engine if not already initialized
      if (!decisionEngine.isReady()) {
        decisionEngine.initialize(shipmentData);
      }

      // Calculate metrics from the shipment data
      const metrics = computeShipmentInsights(shipmentData);
      
      // Calculate forwarder, carrier, country, and warehouse performance
      const forwarderPerformance = calculateForwarderPerformance(shipmentData);
      const carrierPerformance = calculateCarrierPerformance(shipmentData);
      const countryPerformance = calculateCountryPerformance(shipmentData);
      const warehousePerformance = calculateWarehousePerformance(shipmentData);

      // Ensure carriers have required properties
      const processedCarriers = carrierPerformance.map(carrier => ({
        ...carrier,
        // Ensure required properties are present
        shipments: carrier.totalShipments,
        reliability: carrier.reliabilityScore * 100
      }));

      const coreMetrics: CoreMetrics = {
        totalShipments: metrics.totalShipments,
        onTimeRate: metrics.delayedVsOnTimeRate.onTime / 
          (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed),
        avgTransitDays: metrics.avgTransitTime,
        costEfficiency: metrics.avgCostPerKg,
        routeResilience: metrics.resilienceScore / 100,
        modeSplit: {
          air: metrics.shipmentsByMode['Air'] ? 
            (metrics.shipmentsByMode['Air'] / metrics.totalShipments) * 100 : 0,
          sea: metrics.shipmentsByMode['Sea'] ? 
            (metrics.shipmentsByMode['Sea'] / metrics.totalShipments) * 100 : 0,
          road: metrics.shipmentsByMode['Road'] ? 
            (metrics.shipmentsByMode['Road'] / metrics.totalShipments) * 100 : 0
        }
      };

      setMetricsData({
        coreMetrics,
        shipmentMetrics: metrics,
        forwarders: forwarderPerformance,
        carriers: processedCarriers,
        countries: countryPerformance,
        warehouses: warehousePerformance,
        calculationError: null
      });
    } catch (error) {
      console.error("Error calculating metrics:", error);
      setMetricsData(prev => ({
        ...prev,
        calculationError: String(error)
      }));
    }
  }, [shipmentData]);

  return metricsData;
};
