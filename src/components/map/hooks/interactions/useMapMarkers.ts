
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from '@/types/route';
import { CountryMarker } from '../../types';
import { 
  createRouteMarkers, 
  createCountryMarkers,
  createEnhancedCountryPopup,
  clearMarkers 
} from '../../utils/MapMarkers';
import { useToast } from '@/hooks/use-toast';

export const useMapMarkers = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  routes: Route[],
  countries: CountryMarker[],
  onRouteClick?: (routeIndex: number | null) => void,
  onCountryClick?: (country: string) => void
) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const countryMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const { toast } = useToast();
  
  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    toast({
      title: "Map Interaction Error",
      description: message,
      variant: "destructive",
      duration: 5000,
    });
  };

  const setupRouteMarkers = () => {
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
  };

  const setupCountryMarkers = () => {
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
  };

  const clearAllMarkers = () => {
    try {
      clearMarkers(markersRef.current);
      clearMarkers(countryMarkersRef.current);
      markersRef.current = [];
      countryMarkersRef.current = [];
      
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    } catch (error) {
      handleError("Failed to clear all markers", error);
    }
  };

  return {
    setupRouteMarkers,
    setupCountryMarkers,
    clearAllMarkers,
    popupRef
  };
};
