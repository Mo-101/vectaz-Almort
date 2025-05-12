
import mapboxgl from 'mapbox-gl';
import { CountryMarker } from '../../types';
import { generateCountryInsight } from './insightGenerator';

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
