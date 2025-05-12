
import { useCallback, useMemo, useState } from 'react';
import { Route } from '@/types/deeptrack';
import { useMapErrors } from './useMapErrors';

interface RouteInteractionsProps {
  limitedRoutes: Route[];
  mapContainerRef: React.MutableRefObject<any>;
}

export const useRouteInteractions = ({ limitedRoutes, mapContainerRef }: RouteInteractionsProps) => {
  const { handleMapError } = useMapErrors();
  const [lastInteractionTime, setLastInteractionTime] = useState(0);
  
  // Memoize styling options to avoid recreating on each render
  const popupStyles = useMemo(() => ({
    delivered: 'text-green-400',
    inTransit: 'text-amber-400',
    delayed: 'text-red-400'
  }), []);
  
  // Helper function to prevent rapid interactions
  const throttleInteraction = useCallback(() => {
    const now = Date.now();
    const minDelay = 300; // milliseconds
    
    if (now - lastInteractionTime < minDelay) {
      return false;
    }
    
    setLastInteractionTime(now);
    return true;
  }, [lastInteractionTime]);
  
  // Memoize the showRouteInfoOnMap function to prevent recreation on each render
  const showRouteInfoOnMap = useCallback((route: Route, index: number) => {
    try {
      if (!throttleInteraction()) return;
      
      const { origin, destination, weight, deliveryStatus } = route;
      
      if (!destination || !destination.lat || !destination.lng) {
        throw new Error(`Invalid destination coordinates for route to ${destination?.name || 'unknown'}`);
      }
      
      // Calculate once and reuse
      const riskScore = Math.floor(Math.random() * 10) + 1;
      const resilienceScore = Math.floor(Math.random() * 30) + 70;
      
      let statusComment = '';
      let statusColorClass = popupStyles.delayed;
      
      if (deliveryStatus === 'Delivered') {
        statusComment = 'Right on schedule. Someone deserves a raise.';
        statusColorClass = popupStyles.delivered;
      } else if (deliveryStatus === 'In Transit') {
        statusComment = 'Somewhere between here and there. Probably.';
        statusColorClass = popupStyles.inTransit;
      } else {
        statusComment = 'This package has seen more countries than Anthony Bourdain. Status: Lost in transit.';
      }
      
      const popupContent = `
        <div class="route-info p-3">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-[#00FFD1] flex items-center">
              <span>Route Details</span>
            </h3>
            <span class="${statusColorClass} text-xs font-medium flex items-center">
              <span class="mr-1">${deliveryStatus}</span>
              ${deliveryStatus !== 'Delivered' ? '<span class="error-flicker">●</span>' : ''}
            </span>
          </div>
          
          <div class="space-y-2 text-sm">
            <div>
              <span class="text-gray-400">Origin:</span> ${origin.name}
            </div>
            <div>
              <span class="text-gray-400">Destination:</span> ${destination.name}
            </div>
            <div>
              <span class="text-gray-400">Shipment:</span> #${1000 + index}
            </div>
            <div>
              <span class="text-gray-400">Total Weight:</span> ${weight} kg
            </div>
            
            <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-2 border-t border-[#00FFD1]/10">
              <div class="flex items-center">
                <span class="text-green-400 mr-1">⦿</span>
                <span class="text-gray-400">Resilience:</span>
                <span class="ml-1 text-green-400">${resilienceScore}%</span>
              </div>
              <div class="flex items-center">
                <span class="text-yellow-400 mr-1">⚡</span>
                <span class="text-gray-400">Risk:</span>
                <span class="ml-1 ${riskScore > 7 ? 'text-red-400' : riskScore > 4 ? 'text-amber-400' : 'text-green-400'}">
                  ${riskScore}/10
                </span>
              </div>
            </div>
            
            <div class="pt-2 text-xs italic text-gray-300">
              "${statusComment}"
            </div>
          </div>
        </div>
      `;
      
      if (mapContainerRef.current?.jumpToLocation) {
        mapContainerRef.current.jumpToLocation(destination.lat, destination.lng, destination.name);
        mapContainerRef.current.showInfoAtLocation(destination.lat, destination.lng, popupContent);
      } else {
        throw new Error("Map reference is not available for route interaction");
      }
    } catch (error) {
      handleMapError("ROUTE_INFO_FAIL", `Failed to show route information for route ${index}`, error);
    }
  }, [mapContainerRef, popupStyles, throttleInteraction, handleMapError]);

  const handleRouteClick = useCallback((routeIndex: number | null) => {
    try {
      if (routeIndex !== null && limitedRoutes[routeIndex]) {
        showRouteInfoOnMap(limitedRoutes[routeIndex], routeIndex);
      }
    } catch (error) {
      handleMapError("ROUTE_CLICK_FAIL", `Failed to handle route click at index ${routeIndex}`, error);
    }
  }, [limitedRoutes, showRouteInfoOnMap, handleMapError]);
  
  const handleJumpToLocation = useCallback((lat: number, lng: number, name: string) => {
    try {
      if (!throttleInteraction()) return;
      
      if (!lat || !lng) {
        throw new Error(`Invalid coordinates for location ${name}`);
      }
      
      if (mapContainerRef.current?.jumpToLocation) {
        mapContainerRef.current.jumpToLocation(lat, lng, name);
      } else {
        throw new Error("Map reference is not available for jumping to location");
      }
    } catch (error) {
      handleMapError("JUMP_LOCATION_FAIL", `Failed to jump to location ${name}`, error);
    }
  }, [mapContainerRef, throttleInteraction, handleMapError]);

  const handleShipmentSelect = useCallback((shipment: Route, index: number) => {
    try {
      showRouteInfoOnMap(shipment, index);
    } catch (error) {
      handleMapError("SHIPMENT_SELECT_FAIL", `Failed to select shipment at index ${index}`, error);
    }
  }, [showRouteInfoOnMap, handleMapError]);

  return {
    handleRouteClick,
    handleJumpToLocation,
    handleShipmentSelect
  };
};
