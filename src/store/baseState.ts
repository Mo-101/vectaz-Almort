import { create } from 'zustand';
import { Shipment } from '@/types/deeptrack';
import { CriteriaWeights } from '@/core/engine';

// Define the state store interface
interface BaseDataStore {
  [x: string]: any;
  // Data state
  shipmentData: Shipment[];
  isDataLoaded: boolean;
  dataSource: string | null;
  dataVersion: string | null;
  dataHash: string | null;
  lastDataSyncedAt: Date | null;

  // User preferences
  criteriaWeights: CriteriaWeights;

  // Operations
  setShipmentData: (data: Shipment[], source: string, version: string, hash: string) => void;
  clearData: () => void;
  setCriteriaWeights: (weights: CriteriaWeights) => void;

  // Queries
  hasSyncedFrom: (source: string) => boolean;
  hasMockData: () => boolean;
  canBootEngine: () => boolean;
  validateEngineReady: () => true;
}

// Create the store
export const useBaseDataStore = create<BaseDataStore>((set, get) => ({
  // Initial state
  shipmentData: [],
  isDataLoaded: false,
  dataSource: null,
  dataVersion: null,
  dataHash: null,
  lastDataSyncedAt: null,

  criteriaWeights: {
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  },

  // Action to set shipment data
  setShipmentData: (data, source, version, hash) => set({
    shipmentData: data,
    isDataLoaded: true,
    dataSource: source,
    dataVersion: version,
    dataHash: hash,
    lastDataSyncedAt: new Date()
  }),

  // Action to clear data
  clearData: () => set({
    shipmentData: [],
    isDataLoaded: false,
    dataSource: null,
    dataVersion: null,
    dataHash: null,
    lastDataSyncedAt: null
  }),

  // Action to set criteria weights
  setCriteriaWeights: (weights) => set({
    criteriaWeights: weights
  }),

  // Query to check if data is synced from a specific source
  hasSyncedFrom: (source) => {
    const state = get();
    return state.isDataLoaded && state.dataSource === source;
  },

  // Query to check if data is mocked or sandboxed
  hasMockData: () => {
    const state = get();
    return (
      state.isDataLoaded &&
      (
        state.dataSource?.includes('mock') ||
        state.dataSource?.includes('sandbox') ||
        !state.dataVersion?.startsWith('v')
      )
    );
  },

  // Check if the engine is allowed to boot
  canBootEngine: () => {
    const state = get();
    return (
      state.isDataLoaded &&
      !state.hasMockData() &&
      state.criteriaWeights.cost > 0 && 
      state.criteriaWeights.time > 0 && 
      state.criteriaWeights.reliability > 0
    );
  },

  // Validator that throws if conditions are invalid
  validateEngineReady: () => {
    const state = get();

    if (!state.isDataLoaded) {
      throw new Error("System locked: Base data not loaded.");
    }

    if (state.hasMockData()) {
      throw new Error("DeepCAL cannot operate on mock or synthetic data.");
    }

    if (!state.canBootEngine()) {
      throw new Error("Invalid configuration: Check data version or criteria weights.");
    }

    return true;
  }
}));

// File guard function that throws error if data is not properly loaded
export const guardBaseData = () => {
  const store = useBaseDataStore.getState();
  store.validateEngineReady(); // Delegated to internal smart validator
  return true;
};
