
import { useState, useMemo, useEffect } from 'react';
import { Route } from '@/types/deeptrack';
import { useMapErrors } from './useMapErrors';
import { useBaseDataStore } from '@/store/baseState';

export const useMapMarkers = (routes: Route[]) => {
  const [countryMarkers, setCountryMarkers] = useState<Array<{
    name: string;
    coordinates: [number, number];
    status: string;
  }>>([]);
  
  const { shipmentData } = useBaseDataStore();
  const { handleMapError } = useMapErrors();
  
  // Generate country markers from actual shipment data
  const markers = useMemo(() => {
    try {
      // Get unique destination countries
      const uniqueCountries = new Map();
      
      if (!shipmentData || shipmentData.length === 0) {
        return [];
      }
      
      shipmentData.forEach(shipment => {
        if (
          shipment.destination_country && 
          shipment.destination_latitude && 
          shipment.destination_longitude
        ) {
          uniqueCountries.set(shipment.destination_country, {
            name: shipment.destination_country,
            coordinates: [shipment.destination_longitude, shipment.destination_latitude] as [number, number],
            status: shipment.delivery_status || 'Unknown'
          });
        }
      });
      
      return Array.from(uniqueCountries.values());
    } catch (error) {
      handleMapError("MARKER_INIT_FAIL", "Failed to initialize destination markers", error);
      return [];
    }
  }, [shipmentData, handleMapError]);
  
  // Set country markers using the memoized value
  useEffect(() => {
    try {
      setCountryMarkers(markers);
    } catch (error) {
      handleMapError("MARKER_SET_FAIL", "Failed to set country markers", error);
    }
  }, [markers, handleMapError]);

  // Limit routes to a reasonable number for performance
  const limitedRoutes = useMemo(() => {
    try {
      // Only display routes with complete data
      const goodRoutes = routes.filter(route => 
        route.origin?.lat && 
        route.origin?.lng && 
        route.destination?.lat && 
        route.destination?.lng
      );
      
      // Return all routes but limit if there are too many
      return goodRoutes.length > 20 ? goodRoutes.slice(0, 20) : goodRoutes;
    } catch (error) {
      handleMapError("ROUTE_LIMIT_FAIL", "Failed to limit routes", error);
      return [];
    }
  }, [
    routes,
    handleMapError
  ]);

  return {
    countryMarkers,
    limitedRoutes
  };
};
