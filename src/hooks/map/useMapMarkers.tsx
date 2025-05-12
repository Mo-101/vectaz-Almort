
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Route } from '@/types/deeptrack';
import { useMapErrors } from './useMapErrors';

// Sample destination markers if data isn't available
const sampleDestinations = [
  { name: "Rwanda", coordinates: [-1.9441, 30.0619], status: "Delivered" },
  { name: "Nigeria", coordinates: [9.0765, 7.3986], status: "Delivered" },
  { name: "Kenya", coordinates: [1.2404475, 36.990054], status: "Operational" }
];

export const useMapMarkers = (routes: Route[]) => {
  const [countryMarkers, setCountryMarkers] = useState<Array<{
    name: string;
    coordinates: [number, number];
    status: string;
  }>>([]);
  
  const { handleMapError } = useMapErrors();
  
  // Create markers from routes or use sample data if routes are empty
  const markers = useMemo(() => {
    try {
      if (!routes || routes.length === 0) {
        console.log("No routes data available, using sample destinations");
        return sampleDestinations;
      }
      
      // Extract unique destinations from routes
      const uniqueDestinations = new Map();
      
      routes.forEach(route => {
        const destName = route.destination.name;
        if (!uniqueDestinations.has(destName)) {
          uniqueDestinations.set(destName, {
            name: destName,
            coordinates: [route.destination.lat, route.destination.lng] as [number, number],
            status: "Delivered" // All historical data is delivered
          });
        }
      });
      
      return Array.from(uniqueDestinations.values());
    } catch (error) {
      handleMapError("MARKER_INIT_FAIL", "Failed to initialize destination markers", error);
      return sampleDestinations;
    }
  }, [routes, handleMapError]);
  
  // Set country markers using the memoized value
  useEffect(() => {
    try {
      setCountryMarkers(markers);
    } catch (error) {
      handleMapError("MARKER_SET_FAIL", "Failed to set country markers", error);
    }
  }, [markers, handleMapError]);

  // Limit routes to 3 most recent for performance - memoized with deep dependency check
  const limitedRoutes = useMemo(() => {
    try {
      if (!routes || routes.length === 0) {
        console.log("No routes data available for limiting");
        return [];
      }
      return routes.slice(0, 3);
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
