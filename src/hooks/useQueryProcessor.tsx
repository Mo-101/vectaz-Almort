
import { useState, useEffect, useMemo } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { Route } from '@/types/deeptrack';
import { adaptShipmentsForEngine } from '@/utils/typeAdapters';

export const useRouteProcessor = () => {
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  const [routes, setRoutes] = useState<Route[]>([]);

  // Use useMemo to process data only when dependencies change
  const processedRoutes = useMemo(() => {
    if (!isDataLoaded || shipmentData.length === 0) {
      return [];
    }
    
    // Process shipment data into routes for the map
    return shipmentData.map((shipment, index) => {
      // Ensure weight is a number
      let weight: number = 0;
      if (typeof shipment.weight_kg === 'string') {
        weight = parseFloat(shipment.weight_kg) || 0;
      } else if (typeof shipment.weight_kg === 'number') {
        weight = shipment.weight_kg;
      }
      
      // Ensure coordinates are numbers
      const originLat = typeof shipment.origin_latitude === 'string' 
        ? parseFloat(shipment.origin_latitude) 
        : shipment.origin_latitude;
        
      const originLng = typeof shipment.origin_longitude === 'string' 
        ? parseFloat(shipment.origin_longitude) 
        : shipment.origin_longitude;
        
      const destLat = typeof shipment.destination_latitude === 'string' 
        ? parseFloat(shipment.destination_latitude) 
        : shipment.destination_latitude;
        
      const destLng = typeof shipment.destination_longitude === 'string' 
        ? parseFloat(shipment.destination_longitude) 
        : shipment.destination_longitude;
      
      // Only create routes with complete data
      if (!originLat || !originLng || !destLat || !destLng) {
        // Skip shipments with incomplete location data
        return null;
      }
      
      return {
        origin: {
          lat: originLat,
          lng: originLng,
          name: shipment.origin_country || 'Unknown Origin',
          isOrigin: true
        },
        destination: {
          lat: destLat,
          lng: destLng,
          name: shipment.destination_country || 'Unknown Destination',
          isOrigin: false
        },
        weight: weight,
        shipmentCount: 1,
        deliveryStatus: shipment.delivery_status || 'Unknown',
        id: shipment.request_reference || `shipment-${index}`
      };
    }).filter(route => route !== null) as Route[];
  }, [isDataLoaded, shipmentData]);

  useEffect(() => {
    setRoutes(processedRoutes);
  }, [processedRoutes]);

  return { routes };
};

export default useRouteProcessor;
