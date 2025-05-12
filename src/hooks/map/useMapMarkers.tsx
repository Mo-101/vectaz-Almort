
import { useState, useMemo, useEffect, useCallback } from 'react';
import { getDestinationMarkers, getRandomStatus } from '@/utils/mapUtils';
import { Route } from '@/types/deeptrack';
import { useMapErrors } from './useMapErrors';

export const useMapMarkers = (routes: Route[]) => {
  const [countryMarkers, setCountryMarkers] = useState<Array<{
    name: string;
    coordinates: [number, number];
    status: string;
  }>>([]);
  
  const { handleMapError } = useMapErrors();
  
  // Memoize marker initialization to avoid recalculation
  const markers = useMemo(() => {
    try {
      return getDestinationMarkers().map(country => ({
        ...country,
        status: getRandomStatus()
      }));
    } catch (error) {
      handleMapError("MARKER_INIT_FAIL", "Failed to initialize destination markers", error);
      return [];
    }
  }, [handleMapError]);
  
  // Set country markers using the memoized value - with useCallback
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
      return routes.slice(0, 3);
    } catch (error) {
      handleMapError("ROUTE_LIMIT_FAIL", "Failed to limit routes", error);
      return [];
    }
    // Use a stringified version to ensure proper dependency tracking for complex objects
  }, [
    JSON.stringify(routes.map(route => route.origin.name + route.destination.name)),
    handleMapError
  ]);

  return {
    countryMarkers,
    limitedRoutes
  };
};
