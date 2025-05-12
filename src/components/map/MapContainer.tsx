
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { Loader, AlertTriangle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapContainerProps, MapContainerRef } from './types';
import { initializeMap, setupMapEnvironment, setupGlobeRotation } from './utils/MapInitializer';
import { useMapInteractions } from './hooks/useMapInteractions';
import { useMapRef } from './hooks/useMapRef';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Using forwardRef to properly handle the ref
const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(({ 
  routes, 
  countries = [],
  isLoading = false, 
  onMapLoaded, 
  onRouteClick,
  onCountryClick
}, ref) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Custom hook to manage map ref and exposed methods
  const { mapRef, jumpToLocation, toggleTerrain, showInfoAtLocation, errorState } = useMapRef();
  
  // Use custom hook for map interactions
  const { setUserInteracting, clearAllMarkers, error: interactionError } = useMapInteractions(
    mapRef,
    routes,
    countries,
    onRouteClick,
    onCountryClick
  );
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    jumpToLocation,
    toggleTerrain,
    showInfoAtLocation,
    mapRef: mapRef.current
  }), [jumpToLocation, toggleTerrain, showInfoAtLocation, mapRef]);

  // Initialize map - with performance optimization and error handling
  useEffect(() => {
    if (!mapContainerRef.current || isLoading || mapRef.current) return;
    
    try {
      // Create a new map instance
      const map = initializeMap(mapContainerRef.current);
      mapRef.current = map;

      // Setup event handlers
      map.on('load', () => {
        console.log('Mapbox map loaded');
        
        try {
          // Setup map environment (atmosphere, fog, terrain)
          setupMapEnvironment(map);

          // Setup globe rotation and user interaction
          setupGlobeRotation(map, setUserInteracting);

          setMapInitialized(true);
          if (onMapLoaded) onMapLoaded();
        } catch (error) {
          console.error("Error during map initialization:", error);
          setInitError(error instanceof Error ? error : new Error("Failed to initialize map components"));
          // Still set mapInitialized to true so the app can continue
          setMapInitialized(true);
          if (onMapLoaded) onMapLoaded();
        }
      });
      
      // Handle map errors
      map.on('error', (e) => {
        console.error("Mapbox Error:", e.error);
        setInitError(e.error || new Error("Unknown map error"));
      });
    } catch (error) {
      console.error("Failed to create map:", error);
      setInitError(error instanceof Error ? error : new Error("Failed to create map"));
    }
    
    // Cleanup function
    return () => {
      clearAllMarkers();
      
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.error("Error removing map:", error);
        }
        mapRef.current = null;
      }
    };
  }, [isLoading, onMapLoaded]);

  // Combine all errors for display
  const displayError = useMemo(() => {
    // Extract error messages as strings from the different error sources
    const initErrorMessage = initError?.message || null;
    const errorStateMessage = errorState?.message || null;
    const interactionErrorMessage = interactionError?.message || null;
    
    return initErrorMessage || errorStateMessage || interactionErrorMessage;
  }, [initError, errorState, interactionError]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0c1220] to-[#162037]">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-primary/80 text-sm">Initializing secure map environment...</p>
          </div>
        </div>
      ) : (
        <>
          <div ref={mapContainerRef} className="absolute inset-0" />
          
          {displayError && (
            <Alert variant="destructive" className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-background/90 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Map Error</AlertTitle>
              <AlertDescription className="text-xs">{displayError}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
});

MapContainer.displayName = 'MapContainer';

// Memoize the component to prevent unnecessary rerenders
export default React.memo(MapContainer);
