
import React, { useEffect, useState } from 'react';
import { ShipmentMetrics } from '@/types/deeptrack';
import ShipmentMetricsCards from './shipment/ShipmentMetricsCards';
import MonthlyTrendChart from './shipment/MonthlyTrendChart';
import ShipmentStatusChart from './shipment/ShipmentStatusChart';
import ShipmentModeChart from './shipment/ShipmentModeChart';
import OnTimePerformanceChart from './shipment/OnTimePerformanceChart';
import ShipmentInsights from './shipment/ShipmentInsights';
import ShipmentResilienceChart from './shipment/ShipmentResilienceChart';
import { useBaseDataStore } from '@/store/baseState';
import { computeShipmentInsights } from '@/lib/analytics/shipmentTabData';
import SymbolicRecommendations from './symbolic/SymbolicRecommendations';
import EnhancedShipmentMetrics from './shipment/EnhancedShipmentMetrics';
import ShipmentRouteMap from './shipment/ShipmentRouteMap';
import ShipmentTimeTrends from './shipment/ShipmentTimeTrends';

interface ShipmentAnalyticsProps {
  metrics?: ShipmentMetrics;
  symbolicResults?: any;
}

const ShipmentAnalytics: React.FC<ShipmentAnalyticsProps> = ({ metrics: propMetrics, symbolicResults }) => {
  const { shipmentData } = useBaseDataStore();
  const [computedMetrics, setComputedMetrics] = useState<ShipmentMetrics | null>(null);
  
  // Compute metrics from shipment data when it changes
  useEffect(() => {
    if (shipmentData && shipmentData.length > 0) {
      const metrics = computeShipmentInsights(shipmentData);
      setComputedMetrics(metrics);
    }
  }, [shipmentData]);
  
  // Use provided metrics or computed metrics
  const displayMetrics = propMetrics || computedMetrics;
  
  if (!displayMetrics) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mostar-light-blue mx-auto"></div>
        <p className="mt-2 text-mostar-light-blue">Loading shipment analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <ShipmentMetricsCards metrics={displayMetrics} />
      
      {/* Enhanced Metrics Section */}
      <EnhancedShipmentMetrics metrics={displayMetrics} />
      
      {/* Symbolic Container Recommendations */}
      {symbolicResults && symbolicResults.recommendedContainer && (
        <div className="cyber-panel rounded-md p-4 mb-4">
          <SymbolicRecommendations symbolicResults={symbolicResults} />
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-panel rounded-md overflow-hidden">
          <MonthlyTrendChart monthlyTrend={displayMetrics.monthlyTrend} />
        </div>
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentStatusChart shipmentStatusCounts={displayMetrics.shipmentStatusCounts} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentModeChart shipmentsByMode={displayMetrics.shipmentsByMode} />
        </div>
        <div className="cyber-panel rounded-md overflow-hidden">
          <OnTimePerformanceChart delayedVsOnTimeRate={displayMetrics.delayedVsOnTimeRate} />
        </div>
      </div>

      {/* New Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentRouteMap metrics={displayMetrics} />
        </div>
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentTimeTrends metrics={displayMetrics} />
        </div>
      </div>
      
      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentResilienceChart metrics={displayMetrics} />
        </div>
        <div className="cyber-panel rounded-md overflow-hidden">
          <ShipmentInsights metrics={displayMetrics} />
        </div>
      </div>
    </div>
  );
};

export default ShipmentAnalytics;
