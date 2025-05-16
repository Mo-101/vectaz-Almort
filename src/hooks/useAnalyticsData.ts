import { useEffect } from 'react';
import { useShipmentStore } from '@/store/shipmentStore';
import { useBaseDataStore } from '@/store/baseState';
import { useAnalyticsStore } from '@/store/analyticsStore';

/**
 * Hook to provide analytics data for components
 * Automatically syncs with shipment data from the store
 */
export const useAnalyticsData = () => {
  const baseDataStore = useBaseDataStore();
  const shipmentStore = useShipmentStore();
  const analyticsStore = useAnalyticsStore();
  
  // Compute analytics whenever shipment data changes, with data validation
  useEffect(() => {
    // Try to use shipments from baseDataStore first (as it's the source of truth)
    // Fall back to shipmentStore if needed
    const shipments = baseDataStore.shipmentData.length > 0 
      ? baseDataStore.shipmentData 
      : shipmentStore.shipments;
    
    if (shipments.length > 0) {
      // Data validation before processing
      const validatedShipments = shipments.filter(shipment => {
        // Verify required fields exist and have valid values
        const hasValidOrigin = !!shipment.origin_country && 
          !!shipment.origin_latitude && 
          !!shipment.origin_longitude && 
          !isNaN(parseFloat(String(shipment.origin_latitude))) && 
          !isNaN(parseFloat(String(shipment.origin_longitude)));
          
        const hasValidDestination = !!shipment.destination_country && 
          !!shipment.destination_latitude && 
          !!shipment.destination_longitude && 
          !isNaN(parseFloat(String(shipment.destination_latitude))) && 
          !isNaN(parseFloat(String(shipment.destination_longitude)));
        
        // Verify other critical fields
        const hasValidIdentifier = !!shipment.id || !!shipment.tracking_number;
        const hasValidTimestamps = !!shipment.created_at || !!shipment.estimated_departure;
        
        // Validate numeric values
        const hasValidMetrics = 
          (shipment.total_value === undefined || !isNaN(parseFloat(String(shipment.total_value)))) &&
          (shipment.weight === undefined || !isNaN(parseFloat(String(shipment.weight))));
        
        return hasValidIdentifier && hasValidOrigin && hasValidDestination && hasValidTimestamps && hasValidMetrics;
      });
      
      console.log(`Validated ${validatedShipments.length} of ${shipments.length} shipments`);
      analyticsStore.computeAnalytics(validatedShipments);
    }
  }, [baseDataStore.shipmentData, shipmentStore.shipments]);
  
  return {
    isLoading: analyticsStore.isLoading,
    lastUpdated: analyticsStore.lastUpdated,
    shipmentsByMonth: analyticsStore.shipmentsByMonth,
    shipmentLocations: analyticsStore.shipmentLocations,
    activeForwarders: analyticsStore.activeForwarders,
    metrics: analyticsStore.shipmentMetrics,
    
    // Provide a method to manually refresh analytics
    refreshAnalytics: () => {
      const shipments = baseDataStore.shipmentData.length > 0 
        ? baseDataStore.shipmentData 
        : shipmentStore.shipments;
      
      if (shipments.length > 0) {
        analyticsStore.computeAnalytics(shipments);
      }
    }
  };
};
