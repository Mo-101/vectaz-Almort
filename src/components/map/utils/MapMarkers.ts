
import mapboxgl from 'mapbox-gl';
import { Route } from '@/types/deeptrack';
import { CountryMarker } from '../types';

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
        
        // Inner marker with status color
        const innerMarker = document.createElement('div');
        const statusClass = route.deliveryStatus === 'Delivered' ? 'green' : 
                            route.deliveryStatus === 'In Transit' ? 'yellow' : 'red';
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
        
        // Inner marker with status color if available
        const innerMarker = document.createElement('div');
        const statusClass = status === 'Delivered' ? 'green' : 
                            status === 'In Transit' ? 'yellow' : 
                            status === 'Delayed' ? 'red' : 'blue';
        
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
 * Creates a default country popup
 */
export const createCountryPopup = (
  map: mapboxgl.Map,
  country: CountryMarker
): mapboxgl.Popup => {
  try {
    // Validate map and country
    if (!map) {
      throw new Error("Map is not initialized");
    }
    
    if (!country || !country.coordinates || !Array.isArray(country.coordinates) || country.coordinates.length !== 2) {
      throw new Error(`Invalid country data for popup: ${country?.name || 'unknown'}`);
    }
    
    return new mapboxgl.Popup({
      closeButton: true,
      className: 'country-popup',
      maxWidth: '250px'
    })
      .setLngLat([country.coordinates[1], country.coordinates[0]])
      .setHTML(`
        <div class="country-info p-2">
          <h3 class="font-bold text-primary">${country.name}</h3>
          <p class="text-sm mt-1">Destination country</p>
        </div>
      `)
      .addTo(map);
  } catch (error) {
    console.error(`Failed to create popup for country ${country?.name || 'unknown'}:`, error);
    throw error; // Re-throw for the caller to handle
  }
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
