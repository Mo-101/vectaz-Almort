
import { create } from 'zustand';
import type { Shipment } from '@/types/shipment';

interface ShipmentStore {
  shipments: Shipment[];
  traceNodes: Record<string, string>;
  setShipments: (data: Shipment[]) => void;
  getFilteredShipments: (filter: Partial<Shipment>) => Shipment[];
  registerTrace: (metricId: string, filterDesc: string) => void;
}

export const useShipmentStore = create<ShipmentStore>((set, get) => ({
  shipments: [],
  traceNodes: {},
  
  setShipments: (data) => set({ shipments: data }),
  
  getFilteredShipments: (filter) => {
    const { shipments } = get();
    return shipments.filter(shipment => 
      Object.entries(filter).every(([key, value]) => {
        const shipmentValue = shipment[key as keyof Shipment];
        return shipmentValue === value;
      })
    );
  },
  
  registerTrace: (metricId, filterDesc) => 
    set(state => ({
      traceNodes: {
        ...state.traceNodes,
        [metricId]: filterDesc
      }
    }))
}));

// Traceability initialization
export const initShipmentTraceNodes = () => {
  const store = useShipmentStore.getState();
  
  // Example trace node for "Cost Efficiency per Forwarder"
  store.registerTrace(
    'cost_efficiency_per_forwarder', 
    "store.shipments where freight_carrier = X and delivery_status = 'Delivered'"
  );
  
  // Additional trace nodes would be registered here
};
