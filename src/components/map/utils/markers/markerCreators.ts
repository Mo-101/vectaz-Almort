
import mapboxgl from 'mapbox-gl';
import { Route } from '@/types/route';
import { CountryMarker } from '../../types';
import { createEnhancedCountryPopup, createCountryPopup } from './popupCreators';
import { generateCountryInsight } from './insightGenerator';

/**
 * Creates markers for routes on the map
 */
export const createRouteMarkers = (
  map: mapboxgl.Map,
  routes: Route[],
  onRouteClick?: (routeIndex: number | null) => void
): mapboxgl.Marker[] => {
  const markers: mapboxgl.Marker[] = [];
  
  try {
    // Validate map
    if (!map) {
      throw new Error("Map is not initialized");
    }
    
    // Add new markers for each route
    routes.forEach((route, index) => {
      try {
        const { destination } = route;
        
        // Validate destination coordinates
        if (!destination || typeof destination.lat !== 'number' || typeof destination.lng !== 'number') {
          console.warn(`Invalid destination for route ${index}:`, destination);
          return; // Skip this marker
        }
        
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'marker-container';
        
        // Inner marker - all are "Delivered" since we're using historical data
        const innerMarker = document.createElement('div');
        const statusClass = 'green'; // All historical shipments are "Delivered"
        innerMarker.className = `marker-inner destination ${statusClass}`;
        
        // Pulse effect
        const pulseEffect = document.createElement('div');
        pulseEffect.className = `marker-pulse ${statusClass}`;
        innerMarker.appendChild(pulseEffect);
        
        markerEl.appendChild(innerMarker);
        
        // Create and add the marker to the map
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([destination.lng, destination.lat])
          .addTo(map);
        
        // Click handler for the marker
        if (onRouteClick) {
          markerEl.addEventListener('click', () => {
            onRouteClick(index);
          });
        }
        
        // Store reference to the marker
        markers.push(marker);
      } catch (error) {
        console.error(`Error creating marker for route ${index}:`, error);
        // Continue with other routes
      }
    });
  } catch (error) {
    console.error("Failed to create route markers:", error);
    // Return what we have so far
  }

  return markers;
};

/**
 * Creates markers for countries on the map
 */
export const createCountryMarkers = (
  map: mapboxgl.Map,
  countries: CountryMarker[],
  onCountryClick?: (country: string) => void,
  createPopup?: (country: CountryMarker) => mapboxgl.Popup | null
): mapboxgl.Marker[] => {
  const markers: mapboxgl.Marker[] = [];
  
  try {
    // Validate map
    if (!map) {
      throw new Error("Map is not initialized");
    }
    
    // Add new markers for each country
    countries.forEach((country, index) => {
      try {
        const { name, coordinates, status } = country;
        
        // Validate coordinates
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
          console.warn(`Invalid coordinates for country ${name}:`, coordinates);
          return; // Skip this marker
        }
        
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'marker-container country-marker';
        
        // Inner marker - using "green" for delivered status
        const innerMarker = document.createElement('div');
        const statusClass = "green"; // All historical data is "Delivered"
        
        innerMarker.className = `marker-inner country ${statusClass}`;
        
        // Pulse effect for countries
        const pulseEffect = document.createElement('div');
        pulseEffect.className = `marker-pulse ${statusClass}`;
        innerMarker.appendChild(pulseEffect);
        
        markerEl.appendChild(innerMarker);
        
        // Create and add the marker to the map
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([coordinates[1], coordinates[0]])
          .addTo(map);
        
        // Click handler for the marker
        if (onCountryClick) {
          markerEl.addEventListener('click', () => {
            onCountryClick(name);
            
            if (createPopup) {
              try {
                const popup = createPopup(country);
                // Popup will automatically add itself to the map
              } catch (popupError) {
                console.error(`Error creating popup for country ${name}:`, popupError);
              }
            }
          });
        }
        
        // Store reference to the marker
        markers.push(marker);
      } catch (error) {
        console.error(`Error creating marker for country ${country.name}:`, error);
        // Continue with other countries
      }
    });
  } catch (error) {
    console.error("Failed to create country markers:", error);
    // Return what we have so far
  }

  return markers;
};

/**
 * Removes all markers from the map
 */
export const clearMarkers = (markers: mapboxgl.Marker[]): void => {
  if (!markers || !Array.isArray(markers)) return;
  
  markers.forEach(marker => {
    try {
      if (marker && typeof marker.remove === 'function') {
        marker.remove();
      }
    } catch (error) {
      console.error("Error removing marker:", error);
      // Continue with other markers
    }
  });
};

export { createEnhancedCountryPopup, createCountryPopup };
