
import { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { spinGlobe } from '../../utils/MapInitializer';

export const useGlobeSpin = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>
) => {
  const [userInteracting, setUserInteracting] = useState(false);
  const [spinEnabled] = useState(true);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGlobeSpin = () => {
    try {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      
      spinIntervalRef.current = setInterval(() => {
        if (mapRef.current) {
          spinGlobe(mapRef.current, userInteracting, spinEnabled);
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to start globe spinning", error);
    }
  };

  const stopGlobeSpin = () => {
    try {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
    } catch (error) {
      console.error("Error cleaning up spin interval:", error);
    }
  };

  return {
    userInteracting,
    setUserInteracting,
    startGlobeSpin,
    stopGlobeSpin,
    spinEnabled
  };
};
