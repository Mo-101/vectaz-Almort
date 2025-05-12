import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from '@/types/route';
import { createAnimatedRoutePath, cleanupAnimation } from '../../utils/AnimatedPaths';

interface RouteAnimation {
  sourceId: string;
  layerId: string;
  marker: mapboxgl.Marker;
  animation: number;
}

export const useRouteAnimations = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  routes: Route[]
) => {
  // Keep track of all active animations
  const animationsRef = useRef<RouteAnimation[]>([]);
  
  // Setup animated route paths
  const setupRouteAnimations = () => {
    if (!mapRef.current || routes.length === 0) return;
    
    try {
      // Clear any existing animations first
      clearRouteAnimations();
      
      // Limit animations to prevent performance issues
      const maxAnimations = 5;
      const routesToAnimate = routes.slice(0, maxAnimations);
      
      // Create an animated path for each route
      routesToAnimate.forEach((route, index) => {
        const sourceId = `animated-route-${index}-${Date.now()}`;
        const layerId = `layer-${sourceId}`;
        
        const { line, marker, animation } = createAnimatedRoutePath(
          mapRef.current!,
          route,
          () => {
            console.log(`Animation complete for route ${index}`);
          }
        );
        
        animationsRef.current.push({
          sourceId,
          layerId,
          marker,
          animation
        });
      });
      
      console.log(`Created ${animationsRef.current.length} route animations`);
    } catch (error) {
      console.error("Error setting up route animations:", error);
    }
  };
  
  // Clear all route animations
  const clearRouteAnimations = () => {
    if (!mapRef.current) return;
    
    try {
      // Clean up each animation
      animationsRef.current.forEach(({ sourceId, layerId, marker, animation }) => {
        cleanupAnimation(mapRef.current!, sourceId, layerId, marker, animation);
      });
      
      // Reset the animations array
      animationsRef.current = [];
    } catch (error) {
      console.error("Error clearing route animations:", error);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRouteAnimations();
    };
  }, []);
  
  return {
    setupRouteAnimations,
    clearRouteAnimations,
  };
};
