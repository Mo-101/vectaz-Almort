
import mapboxgl from 'mapbox-gl';

interface WarehouseData {
  name: string;
  coordinates: [number, number];
  details?: {
    type?: string;
    description?: string;
    status?: string;
  };
}

/**
 * Create a warehouse marker on the map
 */
export const createWarehouseMarker = (
  map: mapboxgl.Map,
  warehouse: WarehouseData
): mapboxgl.Marker => {
  try {
    // Create warehouse element with House icon
    const element = document.createElement('div');
    element.className = 'warehouse-marker';
    
    // Create SVG for the House/Warehouse icon
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '28');
    svgElement.setAttribute('height', '28');
    svgElement.setAttribute('viewBox', '0 0 24 24');
    svgElement.setAttribute('fill', 'none');
    svgElement.setAttribute('stroke', '#00FFD1');
    svgElement.setAttribute('stroke-width', '2');
    svgElement.setAttribute('stroke-linecap', 'round');
    svgElement.setAttribute('stroke-linejoin', 'round');
    
    // Warehouse icon path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 .56-1.39l8-8a2 2 0 0 1 2.83 0l8 8A2 2 0 0 1 22 8.35Z');
    
    const doorPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    doorPath.setAttribute('d', 'M12 22V9');
    
    const shelfPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shelfPath.setAttribute('d', 'M2 14h20');
    
    svgElement.appendChild(path);
    svgElement.appendChild(doorPath);
    svgElement.appendChild(shelfPath);
    element.appendChild(svgElement);
    
    // Add a pulsing effect
    const pulse = document.createElement('div');
    pulse.className = 'warehouse-pulse';
    element.appendChild(pulse);
    
    // Create and add marker
    const marker = new mapboxgl.Marker(element)
      .setLngLat(warehouse.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25, className: 'warehouse-popup' })
          .setHTML(`
            <div class="warehouse-info p-3">
              <h3 class="font-bold text-primary">${warehouse.name}</h3>
              <p class="text-sm mt-1">${warehouse.details?.description || 'Primary OSL Warehouse'}</p>
              <p class="text-xs mt-2">Location: ${warehouse.details?.type || 'Operational Hub'}</p>
            </div>
          `)
      )
      .addTo(map);
    
    return marker;
  } catch (error) {
    console.error("Error creating warehouse marker:", error);
    throw error;
  }
};

/**
 * Add the Nairobi warehouse to the map
 */
export const addNairobiWarehouse = (map: mapboxgl.Map): mapboxgl.Marker => {
  const nairobiWarehouse: WarehouseData = {
    name: "Nairobi Hub",
    coordinates: [36.990054, 1.2404475], // [longitude, latitude]
    details: {
      type: "Kenya",
      description: "Primary OSL Warehouse",
      status: "Active"
    }
  };
  
  return createWarehouseMarker(map, nairobiWarehouse);
};
