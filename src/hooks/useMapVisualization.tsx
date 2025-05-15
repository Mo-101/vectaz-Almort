
import { useState, useRef, useMemo, useCallback } from 'react';
import { Route } from '@/types/deeptrack';
import { useMapMarkers } from './map/useMapMarkers';
import { useMapControls } from './map/useMapControls';
import { useRouteInteractions } from './map/useRouteInteractions';
import { useEventHandlers } from './map/useEventHandlers';
import { useMapErrors } from './map/useMapErrors';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const useMapVisualization = (routes: Route[]) => {
  const [is3DMode, setIs3DMode] = useState(false);
  const mapContainerRef = useRef<any>(null);
  
  // Use the error handling hook
  const { error: mapError, isError } = useMapErrors();
  
  // Use the smaller, focused hooks
  const { countryMarkers, limitedRoutes } = useMapMarkers(routes);
  
  const { 
    mapLoaded, 
    activeRoute, 
    handleMapLoaded, 
    handleRouteClick: baseHandleRouteClick,
    handleCountryClick 
  } = useEventHandlers();
  
  const { 
    handleRouteClick: interactionHandleRouteClick, 
    handleShipmentSelect 
  } = useRouteInteractions({ 
    limitedRoutes, 
    mapContainerRef 
  });
  
  const { 
    handleZoomIn, 
    handleZoomOut, 
    handleResetView, 
    toggle3DMode,
    isControlsEnabled,
    setControlsEnabled
  } = useMapControls({ 
    mapContainerRef, 
    is3DMode 
  });
  
  // Toggle 3D mode state with useCallback
  const handleToggle3DMode = useCallback(() => {
    setIs3DMode(prev => !prev);
    toggle3DMode();
  }, [toggle3DMode]);
  
  // Combined handleRouteClick that updates state and shows info with useCallback
  const combinedRouteClick = useCallback((routeIndex: number | null) => {
    baseHandleRouteClick(routeIndex);
    if (routeIndex !== null) {
      interactionHandleRouteClick(routeIndex);
    }
  }, [baseHandleRouteClick, interactionHandleRouteClick]);
  
  // Render error message if there's an error
  const errorDisplay = useMemo(() => {
    if (!isError || !mapError) return null;
    
    return (
      <Alert variant="destructive" className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-background/90 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Map Error ({mapError.code})</AlertTitle>
        <AlertDescription>
          {mapError.message}
        </AlertDescription>
      </Alert>
    );
  }, [isError, mapError]);

  // Memoize the return value to prevent unnecessary object creation
  return useMemo(() => ({
    mapLoaded,
    activeRoute,
    is3DMode,
    countryMarkers,
    limitedRoutes,
    mapContainerRef,
    handleMapLoaded,
    handleRouteClick: combinedRouteClick,
    handleCountryClick,
    handleShipmentSelect,
    toggle3DMode: handleToggle3DMode,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    errorDisplay,
    isError,
    isControlsEnabled,
    setControlsEnabled
  }), [
    mapLoaded,
    activeRoute,
    is3DMode,
    countryMarkers,
    limitedRoutes,
    handleMapLoaded,
    combinedRouteClick,
    handleCountryClick,
    handleShipmentSelect,
    handleToggle3DMode,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    errorDisplay,
    isError,
    isControlsEnabled,
    setControlsEnabled
  ]);
};
