
import { useRef, useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export const useMapRef = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [errorState, setErrorState] = useState<{ message: string } | null>(null);
  
  // Method to jump to a specific location on the map with useCallback
  const jumpToLocation = useCallback((lat: number, lng: number, name: string) => {
    console.log(`Jumping to location: ${name} at [${lat}, ${lng}]`);
    try {
      if (!mapRef.current) {
        throw new Error("Map is not initialized");
      }
      
      // Validate coordinates
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        throw new Error(`Invalid coordinates for ${name}: [${lat}, ${lng}]`);
      }
      
      // Fly to the location with a smoother animation and closer zoom
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 8,
        essential: true,
        duration: 2500,
        pitch: 60,
        bearing: Math.random() * 60 - 30 // Random bearing for visual interest
      });
    } catch (error) {
      console.error("Error jumping to location:", error);
      setErrorState({ message: error instanceof Error ? error.message : "Unknown error jumping to location" });
    }
  }, []);

  // Method to fly to destination at roof level
  const flyToDestination = useCallback((lat: number, lng: number, name: string) => {
    console.log(`Flying to roof level: ${name} at [${lat}, ${lng}]`);
    try {
      if (!mapRef.current) {
        throw new Error("Map is not initialized");
      }
      
      // Validate coordinates
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        throw new Error(`Invalid coordinates for ${name}: [${lat}, ${lng}]`);
      }
      
      // Fly to ground/roof level with enhanced perspective
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 18.5, // Close enough to see building details
        pitch: 60,  // Tilted view
        bearing: -20, // Slight angle
        speed: 1.2,  // Slightly faster than default
        curve: 1.8,  // More dramatic curve
        essential: true, // Respects reduced motion settings
        duration: 3000 // 3 seconds duration
      });
    } catch (error) {
      console.error("Error flying to roof level:", error);
      setErrorState({ message: error instanceof Error ? error.message : "Unknown error flying to location" });
    }
  }, []);
  
  // Method to toggle terrain with useCallback
  const toggleTerrain = useCallback((show3D: boolean) => {
    try {
      if (!mapRef.current) {
        throw new Error("Map is not initialized");
      }
      
      if (show3D) {
        mapRef.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      } else {
        mapRef.current.setTerrain(null);
      }
    } catch (error) {
      console.error("Error toggling terrain:", error);
      setErrorState({ message: error instanceof Error ? error.message : "Unknown error toggling terrain" });
    }
  }, []);
  
  // Method to show info at a location with useCallback
  const showInfoAtLocation = useCallback((lat: number, lng: number, content: string) => {
    try {
      if (!mapRef.current) {
        throw new Error("Map is not initialized");
      }
      
      // Validate coordinates
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        throw new Error(`Invalid coordinates for popup: [${lat}, ${lng}]`);
      }
      
      const popup = new mapboxgl.Popup({
        closeButton: true,
        className: 'destination-popup',
        maxWidth: '300px'
      })
        .setLngLat([lng, lat])
        .setHTML(content)
        .addTo(mapRef.current);
    } catch (error) {
      console.error("Error showing info at location:", error);
      setErrorState({ message: error instanceof Error ? error.message : "Unknown error showing popup" });
    }
  }, []);

  return {
    mapRef,
    jumpToLocation,
    flyToDestination,
    toggleTerrain,
    showInfoAtLocation,
    errorState
  };
};
