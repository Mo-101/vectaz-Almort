
import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import AnalyticsLayout from '@/components/analytics/AnalyticsLayout';
import { decisionEngine } from '@/core/engine'; 
import WarehouseAnalytics from './analytics/WarehouseAnalytics';
import CountryAnalytics from './analytics/CountryAnalytics';
import ForwarderAnalytics from './analytics/ForwarderAnalytics';
import OverviewContent from './analytics/OverviewContent';
import ShipmentAnalytics from './analytics/ShipmentAnalytics'; 
import { ShipmentMetrics, ForwarderPerformance, CountryPerformance, WarehousePerformance, CarrierPerformance } from '@/types/deeptrack';
import { 
  calculateForwarderPerformance, 
  calculateCountryPerformance,
  calculateWarehousePerformance,
  calculateCarrierPerformance
} from '@/utils/analyticsUtils';
import { computeShipmentInsights } from '@/lib/analytics/shipmentTabData';
import { runNeuroSymbolicCycle } from '@/symbolic-engine/orchestrator/symbolicOrchestrator';

// Import the DeepCALSpinner from its own file
import DeepCALSpinner from './DeepCALSpinner';
import DeepCALExplainer from './analytics/DeepCALExplainer';

// Updated interface matching Core engine outputs
interface CoreMetrics {
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

const AnalyticsSection: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [coreMetrics, setCoreMetrics] = useState<CoreMetrics | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showDeepTalk, setShowDeepTalk] = useState<boolean>(false);
  const [forwarders, setForwarders] = useState<ForwarderPerformance[]>([]);
  const [carriers, setCarriers] = useState<CarrierPerformance[]>([]);
  const [countries, setCountries] = useState<CountryPerformance[]>([]);
  const [warehouses, setWarehouses] = useState<WarehousePerformance[]>([]);
  const [shipmentMetrics, setShipmentMetrics] = useState<ShipmentMetrics | null>(null);
  const [symbolicResults, setSymbolicResults] = useState<any>(null);

  // Initialize Core engine with validated data
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

      // Calculate metrics from the shipment data using the new utility function
      const metrics = computeShipmentInsights(shipmentData);
      setShipmentMetrics(metrics);

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

      setCoreMetrics({
        totalShipments: metrics.totalShipments,
        onTimeRate: metrics.delayedVsOnTimeRate.onTime / (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed),
        avgTransitDays: metrics.avgTransitTime,
        costEfficiency: metrics.avgCostPerKg,
        routeResilience: metrics.resilienceScore / 100,
        modeSplit: {
          air: metrics.shipmentsByMode['Air'] ? (metrics.shipmentsByMode['Air'] / metrics.totalShipments) * 100 : 0,
          sea: metrics.shipmentsByMode['Sea'] ? (metrics.shipmentsByMode['Sea'] / metrics.totalShipments) * 100 : 0,
          road: metrics.shipmentsByMode['Road'] ? (metrics.shipmentsByMode['Road'] / metrics.totalShipments) * 100 : 0
        }
      });

      setForwarders(forwarderPerformance);
      setCarriers(processedCarriers);
      setCountries(countryPerformance);
      setWarehouses(warehousePerformance);
      setCalculationError(null);

      // Run symbolic engine cycle with sample data for each forwarder
      runSymbolicAnalysis(forwarderPerformance);
    } catch (error) {
      console.error("Error calculating metrics:", error);
      setCalculationError(String(error));
    }
  }, [shipmentData, activeTab]);

  // Run the symbolic engine with the current data
  const runSymbolicAnalysis = (forwarderData: ForwarderPerformance[]) => {
    try {
      // Prepare sample input for symbolic engine - this would be refined in production
      const decisionMatrix = forwarderData.slice(0, 4).map(f => [
        f.reliabilityScore || 0.7,
        f.costEfficiency || 0.8, 
        f.onTimeRate || 0.75
      ]);

      // Sample weights for criteria
      const weights = [0.4, 0.3, 0.3];
      const criteriaTypes = ['benefit', 'benefit', 'benefit'];
      const alternatives = forwarderData.slice(0, 4).map(f => f.name);

      // Sample shipment details
      const sampleShipment = shipmentData[0];
      const weight = sampleShipment?.weight_kg || 14500;
      const volume = sampleShipment?.volume_cbm || 45;
      const originLat = sampleShipment?.origin_latitude || 1.3521;
      const originLng = sampleShipment?.origin_longitude || 103.8198;
      const destLat = sampleShipment?.destination_latitude || -33.8688;
      const destLng = sampleShipment?.destination_longitude || 151.2093;
      
      // Run the symbolic engine
      const result = runNeuroSymbolicCycle({
        decisionMatrix,
        weights,
        criteriaTypes,
        alternatives,
        forwarders: forwarderData.slice(0, 4).map(f => ({
          name: f.name,
          reliability: f.reliabilityScore,
          delayRate: 1 - (f.onTimeRate || 0)
        })),
        weight,
        volume,
        originLat,
        originLng,
        destLat,
        destLng
      });

      console.log("Symbolic engine result:", result);
      setSymbolicResults(result);
    } catch (error) {
      console.error("Error running symbolic analysis:", error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'deepTalk') {
      setShowDeepTalk(true);
    } else {
      setShowDeepTalk(false);
    }
  };

  // Determine the title based on the active tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'overview': return 'Analytics Overview';
      case 'shipments': return 'Shipment Analytics';
      case 'forwarders': return 'Forwarder Analytics';
      case 'countries': return 'Country Analytics';
      case 'warehouses': return 'Warehouse Analytics';
      default: return 'Analytics Dashboard';
    }
  };

  return (
    <div className="w-full h-full">
      <AnalyticsLayout 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        title={getTabTitle()}
      >
        {activeTab === 'overview' && coreMetrics && (
          <OverviewContent 
            metrics={coreMetrics}
            symbolicResults={symbolicResults}
          />
        )}
        
        {activeTab === 'shipments' && (
          <>
            <ShipmentAnalytics 
              metrics={shipmentMetrics} 
              symbolicResults={symbolicResults}
            />
            {shipmentMetrics && <DeepCALExplainer metricType="shipment" data={shipmentMetrics} />}
          </>
        )}
        
        {activeTab === 'forwarders' && (
          <>
            <ForwarderAnalytics 
              forwarders={forwarders} 
              carriers={carriers}
              symbolicResults={symbolicResults}
            />
            {forwarders.length > 0 && <DeepCALExplainer metricType="forwarder" data={forwarders[0]} />}
          </>
        )}
        
        {activeTab === 'countries' && (
          <>
            <CountryAnalytics 
              countries={countries}
              symbolicResults={symbolicResults}
            />
            {countries.length > 0 && <DeepCALExplainer metricType="country" data={countries[0]} />}
          </>
        )}
        
        {activeTab === 'warehouses' && (
          <>
            <WarehouseAnalytics 
              warehouses={warehouses}
              symbolicResults={symbolicResults}
            />
            {warehouses.length > 0 && <DeepCALExplainer metricType="warehouse" data={warehouses[0]} />}
          </>
        )}
      </AnalyticsLayout>
    </div>
  );
};

export default AnalyticsSection;
