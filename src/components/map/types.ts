
import { Route } from '@/types/deeptrack';

export interface CountryMarker {
  name: string;
  coordinates: [number, number];
  status?: string;
}

export interface MapContainerProps {
  routes: Route[];
  countries?: CountryMarker[];
  isLoading?: boolean;
  onMapLoaded?: () => void;
  onRouteClick?: (routeIndex: number | null) => void;
  onCountryClick?: (country: string) => void;
}

export interface MapContainerRef {
  jumpToLocation: (lat: number, lng: number, name: string) => void;
  toggleTerrain: (show3D: boolean) => void;
  showInfoAtLocation: (lat: number, lng: number, content: string) => void;
}
