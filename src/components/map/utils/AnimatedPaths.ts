
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Route } from '@/types/route';

/**
 * Creates and animates a route path between origin and destination
 */
export const createAnimatedRoutePath = (
  map: mapboxgl.Map,
  route: Route,
  onComplete?: () => void
): { line: any; marker: mapboxgl.Marker; animation: number } => {
  try {
    // Create the GeoJSON for the route line
    const routeSource: mapboxgl.GeoJSONSource = {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [route.origin.lng, route.origin.lat],
            [route.destination.lng, route.destination.lat]
          ]
        }
      }
    };
    
    // Add the line to the map
    const sourceId = `route-${Date.now()}`;
    const layerId = `layer-${sourceId}`;
    
    map.addSource(sourceId, routeSource);
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#00FFD1',
        'line-width': 2,
        'line-dasharray': [2, 4]
      }
    });

    // Create the moving vehicle icon based on mode of shipment
    const element = document.createElement('div');
    element.className = 'shipment-vehicle';
    
    // Determine shipment mode and correct icon
    const shipmentMode = route.deliveryStatus?.toLowerCase() || 'air';
    
    // Create SVG for either Ship, Plane or Truck based on shipment mode
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '24');
    svgElement.setAttribute('height', '24');
    svgElement.setAttribute('viewBox', '0 0 24 24');
    svgElement.setAttribute('fill', 'none');
    svgElement.setAttribute('stroke', '#FFFFFF');
    svgElement.setAttribute('stroke-width', '2');
    svgElement.setAttribute('stroke-linecap', 'round');
    svgElement.setAttribute('stroke-linejoin', 'round');
    
    // Path data based on shipment mode
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    if (shipmentMode.includes('air')) {
      // Plane icon path data
      pathElement.setAttribute('d', 'M22 12L18 8H7.8c-.5 0-.9.3-1.2.6L2 12l4.6 3.4c.3.2.7.6 1.2.6H18l4-4z');
    } else if (shipmentMode.includes('sea')) {
      // Ship icon path data
      pathElement.setAttribute('d', 'M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 1.3 0 1.9-.5 2.5-1 .6-.5 1.2-1 2.5-1 1.3 0 1.9.5 2.5 1');
    } else {
      // Truck icon path data
      pathElement.setAttribute('d', 'M1 3h15v13H1V3zm15 5h4l3 3v5h-7V8z');
    }
    
    svgElement.appendChild(pathElement);
    element.appendChild(svgElement);
    
    // Create marker but don't add to map yet (we'll animate it)
    const movingMarker = new mapboxgl.Marker(element);
    
    // Animation variables
    let start = performance.now();
    const duration = 5000; // 5 seconds for animation
    const turfLine = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [route.origin.lng, route.origin.lat],
          [route.destination.lng, route.destination.lat]
        ]
      }
    };
    
    const animationFrame = requestAnimationFrame(function animate(time) {
      // Calculate progress along the path
      const progress = Math.min((time - start) / duration, 1);
      const distance = turf.length(turfLine);
      const point = turf.along(turfLine, distance * progress);
      
      // Update marker position
      movingMarker.setLngLat(point.geometry.coordinates as [number, number])
        .addTo(map);
      
      // Continue animation if not complete
      if (progress < 1) {
        return requestAnimationFrame(animate);
      } else {
        // Animation complete
        if (onComplete) onComplete();
      }
    });
    
    return {
      line: routeSource.data,
      marker: movingMarker,
      animation: animationFrame
    };
  } catch (error) {
    console.error("Error creating animated route path:", error);
    throw error;
  }
};

/**
 * Cleans up animation resources
 */
export const cleanupAnimation = (
  map: mapboxgl.Map,
  sourceId: string,
  layerId: string,
  marker: mapboxgl.Marker,
  animation: number
): void => {
  try {
    // Cancel animation
    cancelAnimationFrame(animation);
    
    // Remove marker
    marker.remove();
    
    // Remove layer and source
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  } catch (error) {
    console.error("Error cleaning up animation:", error);
  }
};
