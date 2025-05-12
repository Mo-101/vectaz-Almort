
import { CriteriaWeights } from './decision/types';
import { loadBaseData } from './data/loader';
import { registerDataSource } from './data/sourceRegistry';
import { useBaseDataStore } from '@/store/baseState';
import { Shipment } from '@/types/deeptrack';

// Track if the system has been booted
let _systemBooted = false;

export const isSystemBooted = (): boolean => _systemBooted;

/**
 * Initialize the decision engine
 * @returns Promise that resolves to true if initialization was successful
 */
export const initDecisionEngine = async (): Promise<boolean> => {
  console.log('Initializing decision engine...');
  return true;
};

/**
 * Main boot sequence for the application
 * Loads the base data from deeptrack_3.json and initializes the engine
 */
export async function bootApp() {
  if (_systemBooted) return true;

  try {
    console.log('Starting boot sequence...');
    
    // Load the base shipment data from deeptrack_3.json
    const shipmentData = await loadBaseData();
    
    if (!shipmentData || shipmentData.length === 0) {
      throw new Error('No valid shipment data loaded from deeptrack_3.json');
    }

    // Register the data source as the base file
    registerDataSource("basefile");
    
    // Store the data in the global state
    useBaseDataStore.getState().setShipmentData(shipmentData, 'basefile', 'v1.0', 'deeptrack-lock');
    
    // Initialize the decision engine
    await initDecisionEngine();
    
    _systemBooted = true;
    console.log('Boot sequence completed successfully');
    return true;
  } catch (error) {
    console.error('Boot sequence failed:', error);
    return false;
  }
}

/**
 * Boot with specific options and data
 */
export async function bootWithOptions(
  options: {
    file: string;
    requireShape: string[];
    minRows: number;
    onSuccess?: () => void;
    onFail?: (error: Error) => void;
  },
  data: any[] = []
): Promise<boolean> {
  try {
    console.log(`Booting with ${data.length} rows from ${options.file}`);
    
    // Validate data shape
    if (options.requireShape && options.requireShape.length > 0) {
      const isValidShape = data.every(item => 
        options.requireShape.every(field => field in item)
      );
      
      if (!isValidShape) {
        const error = new Error(`Data does not match required shape: ${options.requireShape.join(', ')}`);
        if (options.onFail) options.onFail(error);
        return false;
      }
    }
    
    // Check minimum rows
    if (data.length < options.minRows) {
      const error = new Error(`Insufficient data: ${data.length} rows, minimum ${options.minRows} required`);
      if (options.onFail) options.onFail(error);
      return false;
    }
    
    // Boot the application
    await bootApp();
    
    // Call success callback if provided
    if (options.onSuccess) {
      options.onSuccess();
    }
    
    _systemBooted = true;
    return true;
  } catch (error) {
    console.error('Boot failed:', error);
    if (options.onFail) {
      options.onFail(error instanceof Error ? error : new Error(String(error)));
    }
    return false;
  }
}
