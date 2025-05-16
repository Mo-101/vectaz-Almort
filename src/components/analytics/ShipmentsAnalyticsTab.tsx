import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ShipmentTrendChart from './ShipmentTrendChart';
import ShipmentLocationsMap from './ShipmentLocationsMap';
import ShipmentMetricsSummary from './ShipmentMetricsSummary';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useShipmentStore } from '@/store/shipmentStore';
import { useBaseDataStore } from '@/store/baseState';
import { syncAnalyticsWithShipments } from '@/store/analyticsStore';
import { LucideRefreshCw } from 'lucide-react';
import { CountryPerformance, Shipment, ShipmentMetrics, ForwarderPerformance, CarrierPerformance, WarehousePerformance } from '@/types/deeptrack';

interface ShipmentsAnalyticsTabProps {
  className?: string;
}

const ShipmentsAnalyticsTab: React.FC<ShipmentsAnalyticsTabProps> = ({ className }) => {
  const { refreshAnalytics, isLoading, lastUpdated } = useAnalyticsData();
  const baseDataStore = useBaseDataStore();
  const shipmentStore = useShipmentStore();
  
  // Initialize analytics when component mounts
  useEffect(() => {
    const shipments = baseDataStore.shipmentData.length > 0 
      ? baseDataStore.shipmentData 
      : shipmentStore.shipments;
    
    if (shipments.length > 0 && !lastUpdated) {
      syncAnalyticsWithShipments(shipments);
    }
  }, [baseDataStore.shipmentData, shipmentStore.shipments, lastUpdated]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Shipment Analytics</h2>
          <p className="text-gray-500 mt-1">
            Real-time insights from your shipment data
          </p>
        </div>
        
        <button
          onClick={() => refreshAnalytics()}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          <LucideRefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>
      
      {/* Last updated info */}
      {lastUpdated && (
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
      
      {/* Metrics Summary */}
      <ShipmentMetricsSummary />
      
      {/* Map and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShipmentTrendChart className="lg:col-span-1" />
        <div className="bg-white rounded-xl shadow-sm p-5 lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-4">Shipment Status Distribution</h3>
          <div className="h-64">
            {/* Placeholder for Shipment Status Distribution Chart - you can implement this as another component */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-400">Status distribution chart will appear here</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shipment Locations Map */}
      <ShipmentLocationsMap height="500px" />
      
      {/* Additional insights section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Top Performing Forwarders</h3>
          <div className="h-64">
            {/* Placeholder for Top Forwarders Chart - you can implement this as another component */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-400">Forwarder performance chart will appear here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Cost Analysis</h3>
          <div className="h-64">
            {/* Placeholder for Cost Analysis Chart - you can implement this as another component */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-400">Cost analysis chart will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShipmentsAnalyticsTab;
