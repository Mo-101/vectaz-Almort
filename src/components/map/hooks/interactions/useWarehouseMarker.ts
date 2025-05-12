
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { addNairobiWarehouse } from '../../utils/WarehouseMarkers';
import { useToast } from '@/hooks/use-toast';

export const useWarehouseMarker = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>
) => {
  const warehouseMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();

  const setupWarehouseMarker = () => {
    if (!mapRef.current) return;
    
    try {
      if (warehouseMarkerRef.current) {
        warehouseMarkerRef.current.remove();
      }
      
      // Add the Nairobi warehouse marker
      warehouseMarkerRef.current = addNairobiWarehouse(mapRef.current);
      
      // Notify that warehouse has been added
      toast({
        title: "Nairobi Hub",
        description: "Primary OSL Warehouse marker added to map",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to add warehouse marker", error);
    }
  };

  const clearWarehouseMarker = () => {
    try {
      if (warehouseMarkerRef.current) {
        warehouseMarkerRef.current.remove();
        warehouseMarkerRef.current = null;
      }
    } catch (error) {
      console.error("Error cleaning up warehouse marker:", error);
    }
  };

  return {
    setupWarehouseMarker,
    clearWarehouseMarker,
    warehouseMarkerRef
  };
};
