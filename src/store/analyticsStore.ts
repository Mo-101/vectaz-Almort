import { create } from 'zustand';
import type { Shipment, ShipmentMetrics } from '@/types/deeptrack';
import { 
  calculateMonthlyShipmentTrend, 
  calculateShipmentMetrics,
  calculateForwarderPerformance,
  calculateCountryPerformance,
  calculateCarrierPerformance
} from '@/utils/analyticsUtils';

export interface ShipmentLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  shipmentCount: number;
  shipmentValue: number;
}

interface AnalyticsStore {
  // Analytics state
  shipmentsByMonth: Array<{ month: string; count: number }>;
  shipmentLocations: ShipmentLocation[];
  activeForwarders: number;
  shipmentMetrics: ShipmentMetrics | null;
  isLoading: boolean;
  lastUpdated: Date | null;
  
  // Actions
  computeAnalytics: (shipments: Shipment[]) => void;
  clearAnalytics: () => void;
}

// Helper function to extract location data from shipments
const extractShipmentLocations = (shipments: Shipment[]): ShipmentLocation[] => {
  const locationMap = new Map<string, ShipmentLocation>();
  
  shipments.forEach(shipment => {
    // Extract origin location
    if (shipment.origin_country && shipment.origin_latitude && shipment.origin_longitude) {
      const locationKey = `${shipment.origin_latitude}-${shipment.origin_longitude}`;
      
      if (!locationMap.has(locationKey)) {
        locationMap.set(locationKey, {
          id: locationKey,
          name: shipment.origin_country,
          latitude: typeof shipment.origin_latitude === 'string' ? parseFloat(shipment.origin_latitude) : shipment.origin_latitude,
          longitude: typeof shipment.origin_longitude === 'string' ? parseFloat(shipment.origin_longitude) : shipment.origin_longitude,
          shipmentCount: 0,
          shipmentValue: 0
        });
      }
      
      const location = locationMap.get(locationKey)!;
      location.shipmentCount += 1;
      
      // Add shipment value if available
      if (shipment.forwarder_quotes) {
        const quoteValues = Object.values(shipment.forwarder_quotes);
        if (quoteValues.length > 0) {
          const avgQuote = quoteValues.reduce((sum, val) => sum + parseFloat(val.toString()), 0) / quoteValues.length;
          location.shipmentValue += avgQuote;
        }
      }
    }
    
    // Extract destination location
    if (shipment.destination_country && shipment.destination_latitude && shipment.destination_longitude) {
      const locationKey = `${shipment.destination_latitude}-${shipment.destination_longitude}`;
      
      if (!locationMap.has(locationKey)) {
        locationMap.set(locationKey, {
          id: locationKey,
          name: shipment.destination_country,
          latitude: typeof shipment.destination_latitude === 'string' ? parseFloat(shipment.destination_latitude) : shipment.destination_latitude,
          longitude: typeof shipment.destination_longitude === 'string' ? parseFloat(shipment.destination_longitude) : shipment.destination_longitude,
          shipmentCount: 0,
          shipmentValue: 0
        });
      }
      
      const location = locationMap.get(locationKey)!;
      location.shipmentCount += 1;
      
      // Add shipment value if available
      if (shipment.forwarder_quotes) {
        const quoteValues = Object.values(shipment.forwarder_quotes);
        if (quoteValues.length > 0) {
          const avgQuote = quoteValues.reduce((sum, val) => sum + parseFloat(val.toString()), 0) / quoteValues.length;
          location.shipmentValue += avgQuote;
        }
      }
    }
  });
  
  return Array.from(locationMap.values());
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  // Initial state
  shipmentsByMonth: [],
  shipmentLocations: [],
  activeForwarders: 0,
  shipmentMetrics: null,
  isLoading: false,
  lastUpdated: null,
  
  // Compute analytics from shipment data
  computeAnalytics: (shipments) => {
    set({ isLoading: true });
    
    // Use setTimeout to prevent UI blocking for large datasets
    setTimeout(() => {
      try {
        // Calculate monthly trend data
        const monthlyTrend = calculateMonthlyShipmentTrend(shipments);
        
        // Extract location data
        const locations = extractShipmentLocations(shipments);
        
        // Calculate shipment metrics
        const metrics = calculateShipmentMetrics(shipments);
        
        // Count unique forwarders
        const uniqueForwarders = new Set(
          shipments.map(s => s.freight_carrier).filter(Boolean)
        );
        
        set({
          shipmentsByMonth: monthlyTrend,
          shipmentLocations: locations,
          activeForwarders: uniqueForwarders.size,
          shipmentMetrics: metrics,
          isLoading: false,
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error('Error computing analytics:', error);
        set({ isLoading: false });
      }
    }, 0);
  },
  
  // Clear analytics data
  clearAnalytics: () => set({
    shipmentsByMonth: [],
    shipmentLocations: [],
    activeForwarders: 0,
    shipmentMetrics: null,
    lastUpdated: null
  })
}));

// Hook to sync analytics with shipment data
export const syncAnalyticsWithShipments = (shipments: Shipment[]) => {
  const store = useAnalyticsStore.getState();
  store.computeAnalytics(shipments);
};
