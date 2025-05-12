
import { useState, useEffect, useMemo } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { Route } from '@/types/deeptrack';

// Sample routes to use as fallback when data loading fails
const sampleRoutes: Route[] = [
  {
    origin: {
      lat: 1.2404475,
      lng: 36.990054,
      name: "Kenya",
      isOrigin: true
    },
    destination: {
      lat: -1.9441,
      lng: 30.0619,
      name: "Rwanda",
      isOrigin: false
    },
    weight: 120,
    shipmentCount: 1,
    deliveryStatus: "air"
  },
  {
    origin: {
      lat: 1.2404475,
      lng: 36.990054,
      name: "Kenya",
      isOrigin: true
    },
    destination: {
      lat: 9.0765,
      lng: 7.3986,
      name: "Nigeria",
      isOrigin: false
    },
    weight: 85,
    shipmentCount: 1,
    deliveryStatus: "sea"
  }
];

export const useRouteProcessor = () => {
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  const [routes, setRoutes] = useState<Route[]>([]);

  // Use useMemo to process data only when dependencies change
  const processedRoutes = useMemo(() => {
    // If system didn't load the data from API, use our sample routes
    if (!isDataLoaded || !shipmentData || shipmentData.length === 0) {
      console.log("Using sample routes as fallback");
      return sampleRoutes;
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
      
      return {
        origin: {
          lat: shipment.origin_latitude,
          lng: shipment.origin_longitude,
          name: shipment.origin_country,
          isOrigin: true
        },
        destination: {
          lat: shipment.destination_latitude,
          lng: shipment.destination_longitude,
          name: shipment.destination_country,
          isOrigin: false
        },
        weight: weight,
        shipmentCount: 1,
        deliveryStatus: shipment.delivery_status
      };
    });
  }, [isDataLoaded, shipmentData]);

  useEffect(() => {
    setRoutes(processedRoutes);
  }, [processedRoutes]);

  return { routes };
};

export default useRouteProcessor;
