
import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from '@/types/route';
import { CountryMarker } from '../types';
import { 
  createRouteMarkers, 
  createCountryMarkers, 
  createEnhancedCountryPopup, 
  clearMarkers 
} from '../utils/MapMarkers';
import { addNairobiWarehouse } from '../utils/WarehouseMarkers';
import { spinGlobe } from '../utils/MapInitializer';
import { useToast } from '@/hooks/use-toast';

export const useMapInteractions = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  routes: Route[],
  countries: CountryMarker[],
  onRouteClick?: (routeIndex: number | null) => void,
  onCountryClick?: (country: string) => void
) => {
  const [userInteracting, setUserInteracting] = useState(false);
  const [spinEnabled] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const countryMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const warehouseMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Helper function to handle errors
  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    setError(error instanceof Error ? error : new Error(String(error)));
    toast({
      title: "Map Interaction Error",
      description: message,
      variant: "destructive",
      duration: 5000,
    });
  };

  // Add markers when routes change
  useEffect(() => {
    if (!mapRef.current) return;
    
    try {
      // Clear existing markers
      clearMarkers(markersRef.current);
      markersRef.current = [];
      
      // Add new markers
      markersRef.current = createRouteMarkers(
        mapRef.current,
        routes,
        onRouteClick
      );
    } catch (error) {
      handleError("Failed to create route markers", error);
    }

    return () => {
      try {
        clearMarkers(markersRef.current);
        markersRef.current = [];
      } catch (error) {
        console.error("Error cleaning up route markers:", error);
      }
    };
  }, [routes, mapRef.current, onRouteClick, toast]);

  // Add country markers when countries change
  useEffect(() => {
    if (!mapRef.current) return;
    
    try {
      // Clear existing country markers
      clearMarkers(countryMarkersRef.current);
      countryMarkersRef.current = [];
      
      // Create a popup handler
      const handlePopup = (country: CountryMarker) => {
        try {
          // Close any existing popup
          if (popupRef.current) {
            popupRef.current.remove();
          }
          
          // Create a new popup
          popupRef.current = createEnhancedCountryPopup(mapRef.current!, country);
          return popupRef.current;
        } catch (error) {
          handleError(`Failed to create popup for country ${country.name}`, error);
          return null;
        }
      };
      
      // Add new markers
      countryMarkersRef.current = createCountryMarkers(
        mapRef.current,
        countries,
        onCountryClick,
        handlePopup
      );
    } catch (error) {
      handleError("Failed to create country markers", error);
    }

    return () => {
      try {
        clearMarkers(countryMarkersRef.current);
        countryMarkersRef.current = [];
        
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      } catch (error) {
        console.error("Error cleaning up country markers:", error);
      }
    };
  }, [countries, mapRef.current, onCountryClick, toast]);

  // Add Nairobi warehouse marker
  useEffect(() => {
    if (!mapRef.current) return;
    
    try {
      if (warehouseMarkerRef.current) {
        warehouseMarkerRef.current.remove();
      }
      
      // Add the Nairobi warehouse marker
      warehouseMarkerRef.current = addNairobiWarehouse(mapRef.current);
      
      // Notify that warehouse has been added
      toast({
        title: "Nairobi Hub",
        description: "Primary OSL Warehouse marker added to map",
        duration: 3000,
      });
    } catch (error) {
      handleError("Failed to add warehouse marker", error);
    }
    
    return () => {
      try {
        if (warehouseMarkerRef.current) {
          warehouseMarkerRef.current.remove();
          warehouseMarkerRef.current = null;
        }
      } catch (error) {
        console.error("Error cleaning up warehouse marker:", error);
      }
    };
  }, [mapRef.current, toast]);

  // Setup globe spinning interval
  useEffect(() => {
    const startGlobeSpin = () => {
      try {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
        }
        
        spinIntervalRef.current = setInterval(() => {
          if (mapRef.current) {
            spinGlobe(mapRef.current, userInteracting, spinEnabled);
          }
        }, 1000);
      } catch (error) {
        handleError("Failed to start globe spinning", error);
      }
    };
    
    if (mapRef.current) {
      startGlobeSpin();
    }
    
    return () => {
      try {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
          spinIntervalRef.current = null;
        }
      } catch (error) {
        console.error("Error cleaning up spin interval:", error);
      }
    };
  }, [mapRef.current, userInteracting, spinEnabled, toast]);

  return {
    setUserInteracting,
    popupRef,
    error,
    clearAllMarkers: () => {
      try {
        clearMarkers(markersRef.current);
        clearMarkers(countryMarkersRef.current);
        if (warehouseMarkerRef.current) {
          warehouseMarkerRef.current.remove();
        }
        markersRef.current = [];
        countryMarkersRef.current = [];
        warehouseMarkerRef.current = null;
        
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      } catch (error) {
        handleError("Failed to clear all markers", error);
      }
    }
  };
};
