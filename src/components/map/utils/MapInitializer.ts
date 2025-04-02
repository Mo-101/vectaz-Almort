
import mapboxgl from 'mapbox-gl';

// Set the Mapbox access token directly (best for development)
// In production, this should come from environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

/**
 * Initialize a new Mapbox map
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/akanimo1/cm8bw23rp00i501sbgbr258r0',
    center: [0, 20], // Center on Africa
    zoom: 2,
    pitch: 40,
    bearing: 0,
    projection: 'globe'
  });

  // Add navigation controls
  map.addControl(
    new mapboxgl.NavigationControl({
      visualizePitch: true,
    }),
    'top-right'
  );

  return map;
};

/**
 * Setup map atmosphere and terrain
 */
export const setupMapEnvironment = (map: mapboxgl.Map): void => {
  // Add atmosphere and fog for a more realistic globe view
  map.setFog({
    color: 'rgb(15, 20, 30)', // sky color
    'high-color': 'rgb(25, 35, 60)',
    'horizon-blend': 0.2,
    'space-color': 'rgb(5, 10, 20)',
    'star-intensity': 0.6
  });

  // Add terrain source only if it doesn't already exist
  if (!map.getSource('mapbox-dem')) {
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
  }
};

/**
 * Set up globe rotation
 */
export const setupGlobeRotation = (
  map: mapboxgl.Map,
  onUserInteractionChange: (interacting: boolean) => void
): void => {
  // User interaction event listeners
  map.on('mousedown', () => {
    onUserInteractionChange(true);
  });
  
  map.on('mouseup', () => {
    onUserInteractionChange(false);
  });
  
  map.on('dragstart', () => {
    onUserInteractionChange(true);
  });
  
  map.on('dragend', () => {
    onUserInteractionChange(false);
  });
  
  map.on('touchstart', () => {
    onUserInteractionChange(true);
  });
  
  map.on('touchend', () => {
    onUserInteractionChange(false);
  });
};

/**
 * Spin the globe
 */
export const spinGlobe = (
  map: mapboxgl.Map, 
  userInteracting: boolean,
  spinEnabled: boolean,
  secondsPerRevolution: number = 180,
  maxSpinZoom: number = 5
): void => {
  if (!map || !spinEnabled || userInteracting) return;
  
  const zoom = map.getZoom();
  if (zoom > maxSpinZoom) return;
  
  const distancePerSecond = 360 / secondsPerRevolution;
  const center = map.getCenter();
  center.lng -= distancePerSecond / 60;
  
  map.easeTo({
    center,
    duration: 1000,
    easing: (n) => n
  });
};
