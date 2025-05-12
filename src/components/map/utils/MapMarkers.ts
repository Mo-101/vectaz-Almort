
import mapboxgl from 'mapbox-gl';
import { Route } from '@/types/route';
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
 * Creates an enhanced country popup with DeepCAL insights
 */
export const createEnhancedCountryPopup = (
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
    
    // Generate DeepCAL insight for this country
    const insight = generateCountryInsight(country.name);
    
    // Generate mock metrics (in a real app, these would come from actual data)
    const totalShipments = Math.floor(Math.random() * 20) + 5;
    const avgCost = (Math.random() * 400 + 200).toFixed(2);
    const carriers = ["Kenya Airways", "DHL", "Maersk", "Ethiopian Airlines"];
    const primaryCarrier = carriers[Math.floor(Math.random() * carriers.length)];
    
    return new mapboxgl.Popup({
      closeButton: true,
      className: 'deepcal-country-popup',
      maxWidth: '300px'
    })
      .setLngLat([country.coordinates[1], country.coordinates[0]])
      .setHTML(`
        <div class="country-insight p-3">
          <h3 class="font-bold text-primary mb-2">${country.name}</h3>
          
          <div class="stats grid grid-cols-2 gap-2 text-xs mb-3">
            <div>
              <span class="text-muted-foreground">Shipments:</span>
              <span class="text-foreground font-medium">${totalShipments}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Status:</span>
              <span class="text-mostar-green font-medium">Delivered</span>
            </div>
            <div>
              <span class="text-muted-foreground">Primary Carrier:</span>
              <span class="text-foreground font-medium">${primaryCarrier}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Avg. Cost:</span>
              <span class="text-foreground font-medium">$${avgCost}/kg</span>
            </div>
          </div>
          
          <div class="insight-box bg-blue-950/40 p-2 rounded border border-blue-500/20 text-xs">
            <div class="font-medium mb-1 text-mostar-light-blue">DeepCAL Insight</div>
            <p>${insight}</p>
          </div>
        </div>
      `)
      .addTo(map);
  } catch (error) {
    console.error(`Failed to create popup for country ${country?.name || 'unknown'}:`, error);
    throw error; // Re-throw for the caller to handle
  }
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

/**
 * Generate DeepCAL insights for countries
 */
function generateCountryInsight(countryName: string): string {
  const insights = [
    `Route to ${countryName} is 43% cheaper via Nairobi than alternative routes, even accounting for symbolic fairness.`,
    `DeepCAL analysis shows ${countryName} shipments arrive 2.5 days faster on average than regional peers.`,
    `${countryName} demonstrates high shipment resilience (94%) compared to neighboring routes (76%). Consider increasing capacity.`,
    `Symbolic model suggests ${countryName}'s emerging infrastructure would benefit from increased air freight over sea freight.`,
    `Routes to ${countryName} demonstrated consistent reliability despite regional weather disruptions. Strong performance.`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}
