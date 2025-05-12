
import { useState, useEffect } from 'react';
import { Route } from '@/types/route';
import { CountryMarker } from '../types';
import { useMapMarkers, useWarehouseMarker, useGlobeSpin } from './interactions';

export const useMapInteractions = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  routes: Route[],
  countries: CountryMarker[],
  onRouteClick?: (routeIndex: number | null) => void,
  onCountryClick?: (country: string) => void
) => {
  const [error, setError] = useState<Error | null>(null);

  // Use the smaller, focused hooks
  const { 
    setupRouteMarkers, 
    setupCountryMarkers, 
    clearAllMarkers,
    popupRef,
    markersRef,
    countryMarkersRef
  } = useMapMarkers(mapRef, routes, countries, onRouteClick, onCountryClick);
  
  const { 
    setupWarehouseMarker, 
    clearWarehouseMarker 
  } = useWarehouseMarker(mapRef);
  
  const {
    userInteracting,
    setUserInteracting,
    startGlobeSpin,
    stopGlobeSpin,
    spinEnabled
  } = useGlobeSpin(mapRef);

  // Add markers when routes change
  useEffect(() => {
    setupRouteMarkers();
    return () => {
      try {
        clearAllMarkers();
      } catch (error) {
        console.error("Error cleaning up route markers:", error);
      }
    };
  }, [routes, mapRef.current, onRouteClick]);

  // Add country markers when countries change
  useEffect(() => {
    setupCountryMarkers();
    return () => {
      try {
        clearAllMarkers();
        
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      } catch (error) {
        console.error("Error cleaning up country markers:", error);
      }
    };
  }, [countries, mapRef.current, onCountryClick]);

  // Add Nairobi warehouse marker
  useEffect(() => {
    setupWarehouseMarker();
    return () => {
      clearWarehouseMarker();
    };
  }, [mapRef.current]);

  // Setup globe spinning interval
  useEffect(() => {
    if (mapRef.current) {
      startGlobeSpin();
    }
    return () => {
      stopGlobeSpin();
    };
  }, [mapRef.current, userInteracting, spinEnabled]);

  return {
    setUserInteracting,
    popupRef,
    error,
    clearAllMarkers: () => {
      try {
        clearAllMarkers();
        clearWarehouseMarker();
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };
};
