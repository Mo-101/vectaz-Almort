
import { useState, useEffect, useMemo } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { Route } from '@/types/deeptrack';

export const useRouteProcessor = () => {
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  const [routes, setRoutes] = useState<Route[]>([]);

  // Use useMemo to process data only when dependencies change
  const processedRoutes = useMemo(() => {
    if (!isDataLoaded || shipmentData.length === 0) {
      return [];
    }
    
    // Process shipment data into routes for the map
    return shipmentData.map(shipment => {
      // Ensure weight is a number
      let weight: number;
      if (typeof shipment.weight_kg === 'string') {
        weight = parseFloat(shipment.weight_kg) || 0; // Default to 0 if parsing fails
      } else {
        weight = shipment.weight_kg as number;
      }
      
      // Only create routes with complete data
      if (!shipment.origin_latitude || !shipment.origin_longitude || 
          !shipment.destination_latitude || !shipment.destination_longitude) {
        // Skip shipments with incomplete location data
        return null;
      }
      
      return {
        origin: {
          lat: shipment.origin_latitude,
          lng: shipment.origin_longitude,
          name: shipment.origin_country || 'Unknown Origin',
          isOrigin: true
        },
        destination: {
          lat: shipment.destination_latitude,
          lng: shipment.destination_longitude,
          name: shipment.destination_country || 'Unknown Destination',
          isOrigin: false
        },
        weight: weight,
        shipmentCount: 1,
        deliveryStatus: shipment.delivery_status || 'Unknown'
      };
    }).filter(route => route !== null) as Route[]; // Filter out null routes
  }, [isDataLoaded, shipmentData]);

  useEffect(() => {
    setRoutes(processedRoutes);
  }, [processedRoutes]);

  return { routes };
};

export default useRouteProcessor;
