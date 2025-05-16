
import React, { useEffect, useRef, useState } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { motion, useAnimation } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Maximize2, Minimize2, Filter, RefreshCw, Pause, Play } from 'lucide-react';
import * as turf from '@turf/turf';

interface ShipmentLocationsMapProps {
  className?: string;
  height?: string;
}

const ShipmentLocationsMap: React.FC<ShipmentLocationsMapProps> = ({
  className,
  height = '400px'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const controls = useAnimation();
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const { shipmentData } = useBaseDataStore();

  const [mapInitialized, setMapInitialized] = useState(false);
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [filterMode, setFilterMode] = useState<'all' | 'origin' | 'destination' | 'volume'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationsActive, setAnimationsActive] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Create locations from real shipment data
  const shipmentLocations = React.useMemo(() => {
    if (!shipmentData || shipmentData.length === 0) return [];
    
    return shipmentData.map((item, idx) => {
      // Parse coordinates to ensure they are numbers
      const originLongitude = typeof item.origin_longitude === 'string' ? parseFloat(item.origin_longitude) : item.origin_longitude || 0;
      const originLatitude = typeof item.origin_latitude === 'string' ? parseFloat(item.origin_latitude) : item.origin_latitude || 0;
      const destinationLongitude = typeof item.destination_longitude === 'string' ? parseFloat(item.destination_longitude) : item.destination_longitude || 0;
      const destinationLatitude = typeof item.destination_latitude === 'string' ? parseFloat(item.destination_latitude) : item.destination_latitude || 0;
      
      // Parse weight to ensure it's a number
      const weight = typeof item.weight_kg === 'string' ? parseFloat(item.weight_kg) : (item.weight_kg || 0);

      return {
        name: `${item.origin_country || 'Unknown'} → ${item.destination_country || 'Unknown'}`,
        longitude: originLongitude,
        latitude: originLatitude,
        destinationLongitude: destinationLongitude,
        destinationLatitude: destinationLatitude,
        shipmentCount: 1,
        shipmentValue: weight,
        id: item.request_reference || `loc-${idx}`,
        status: item.delivery_status || 'unknown'
      };
    }).filter(loc => loc.longitude !== 0 && loc.latitude !== 0);
  }, [shipmentData]);

  // Create arc path for routes
  const createArcPath = React.useCallback((origin: [number, number], destination: [number, number], steps = 100): [number, number][] => {
    if (!origin || !destination) return [];
    
    try {
      const route = turf.lineString([origin, destination]);
      const lineDistance = turf.length(route);
      const arc: [number, number][] = [];
      
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(route, i);
        arc.push(segment.geometry.coordinates as [number, number]);
      }
      
      if (arc[arc.length - 1][0] !== destination[0] || arc[arc.length - 1][1] !== destination[1]) {
        arc.push(destination);
      }
      
      return arc;
    } catch (error) {
      console.error("Error creating arc path:", error);
      return [origin, destination];
    }
  }, []);

  const refreshAnalytics = () => {
    // This function just reloads the map with current data
    if (map.current) {
      map.current.resize();
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
    
    setIsMapLoading(true);
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: shipmentLocations.length > 0 ? 
        // Ensure coordinates are numbers
        [shipmentLocations[0].longitude, shipmentLocations[0].latitude] : 
        [0, 0],
      zoom: 2,
      projection: viewMode === '3D' ? { name: 'globe' as any } : { name: 'mercator' as any },
      interactive: true
    });
    
    map.current.on('load', () => {
      setMapInitialized(true);
      setIsMapLoading(false);
      popupRef.current = new mapboxgl.Popup({ 
        closeButton: false, 
        closeOnClick: false, 
        className: 'shipment-popup', 
        offset: 15, 
        maxWidth: '300px' 
      });
    });
    
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [viewMode, shipmentLocations]);

  // Add layers & interactions when map is initialized
  useEffect(() => {
    if (!map.current || !mapInitialized || shipmentLocations.length === 0) return;

    // Add markers for each location
    const markers: mapboxgl.Marker[] = [];
    
    shipmentLocations.forEach((location) => {
      if (location.longitude && location.latitude) {
        // Only create points for valid coordinates
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = 
          location.status === 'delivered' ? '#10b981' : 
          location.status === 'in_transit' ? '#f59e0b' : '#ef4444';
        el.style.width = '10px';
        el.style.height = '10px';
        el.style.borderRadius = '50%';
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current!);
        
        markers.push(marker);
        
        // Create popup for this marker
        el.addEventListener('mouseenter', () => {
          popupRef.current?.setLngLat([location.longitude, location.latitude])
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm">${location.name}</h3>
                <p class="text-xs">Status: ${location.status}</p>
                <p class="text-xs">Weight: ${location.shipmentValue} kg</p>
              </div>
            `)
            .addTo(map.current!);
        });
        
        el.addEventListener('mouseleave', () => {
          popupRef.current?.remove();
        });
      }
    });
    
    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [mapInitialized, shipmentLocations, filterMode]);

  const toggleFullscreen = () => {
    setIsFullscreen(f => !f);
    setTimeout(() => map.current?.resize(), 100);
  };

  const toggleAnimations = () => {
    setAnimationsActive(a => !a);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={isFullscreen ? { height: '100vh' } : { height }}
    >
      <div className="p-4 border-b flex justify-between items-center bg-gray-900 text-white">
        <h3 className="font-semibold">Global Shipment Distribution</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode(v => (v === '3D' ? '2D' : '3D'))}
            className="p-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            {viewMode}
          </button>
          <button 
            onClick={toggleAnimations}
            className="p-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            {animationsActive ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button 
            onClick={refreshAnalytics}
            className="p-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      
      <div ref={mapContainer} className="w-full h-full relative">
        {isMapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFD1]"></div>
          </div>
        )}
      </div>
      
      {/* Map stats */}
      <div className="absolute bottom-4 right-4 p-2 bg-gray-900/70 text-white text-xs rounded">
        <div>Total Routes: {shipmentLocations.length}</div>
      </div>
    </motion.div>
  );
};

export default ShipmentLocationsMap;
