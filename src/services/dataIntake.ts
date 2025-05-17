// Data Intake service for loading and validating DeepCAL base data
// Ensures data quality and provenance tracking

import { Shipment, ForwarderPerformance } from "@/types/deeptrack";
import { calculateForwarderPerformance } from "@/utils/analyticsUtils";
import { logAuditTrail } from './auditLogger';
import { adaptShipmentsForEngine } from "@/utils/typeAdapters";

// Metadata for tracked datasets
interface DatasetMetadata {
  version: string;
  hash: string;
  timestamp: string;
  rowCount: number;
  validationStatus: 'valid' | 'invalid';
}

// Cache of loaded base data
const dataCache: Record<string, {
  data: Shipment[],
  hash: string,
  timestamp: string
}> = {};

// Simple hash function for data versioning
function calculateHash(data: any[]): string {
  const jsonString = JSON.stringify(data);
  let hash = 0;
  
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return 'sha256-' + Math.abs(hash).toString(16);
}

// Validate required fields in the dataset
export function validateDataset(data: Shipment[]): boolean {
  // Ensure we have data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("Dataset validation failed: No data or invalid format");
    return false;
  }
  
  // Check required fields on each shipment
  const requiredFields = [
    'request_reference',
    'origin_country',
    'destination_country',
    'weight_kg',
    'delivery_status'
  ];
  
  const isValid = data.every(item => 
    requiredFields.every(field => field in item && item[field] !== null)
  );
  
  if (!isValid) {
    console.error("Dataset validation failed: Missing required fields");
  }
  
  return isValid;
}

// Load base data with version tracking
export async function loadBaseData(version: string = "latest"): Promise<{
  dataset: Shipment[],
  hash: string,
  metadata: DatasetMetadata
}> {
  // Check if we already have this version cached
  if (dataCache[version]) {
    console.log(`Using cached dataset version: ${version}`);
    return {
      dataset: dataCache[version].data,
      hash: dataCache[version].hash,
      metadata: {
        version,
        hash: dataCache[version].hash,
        timestamp: dataCache[version].timestamp,
        rowCount: dataCache[version].data.length,
        validationStatus: 'valid'
      }
    };
  }
  
  // In a real system, this would load from a database or API
  // For this implementation, we'll use the data from our module
  const shipmentData = await import("@/services/deepEngine").then(module => {
    // Reset the module's data state
    if (typeof module.loadMockData === 'function') {
      module.loadMockData();
    }
    
    // Use reflection to access the shipmentData
    return (module as any).shipmentData || [];
  });
  
  // Calculate a hash for this dataset
  const hash = calculateHash(shipmentData);
  const timestamp = new Date().toISOString();
  
  // Cache the data
  dataCache[version] = {
    data: shipmentData,
    hash,
    timestamp
  };
  
  // Also cache as "latest"
  dataCache["latest"] = {
    data: shipmentData,
    hash,
    timestamp
  };
  
  // Log the data load operation
  logAuditTrail(
    'loadBaseData',
    { version, requestedRowCount: shipmentData.length },
    { loadedRowCount: shipmentData.length, hash },
    {},
    version,
    hash
  );
  
  return {
    dataset: shipmentData,
    hash,
    metadata: {
      version,
      hash,
      timestamp,
      rowCount: shipmentData.length,
      validationStatus: 'valid'
    }
  };
}

// Convert shipment data to forwarder performance data
export function deriveForwarderPerformance(shipmentData: Shipment[]): ForwarderPerformance[] {
  // Use the adapter to convert UI shipments to engine shipments first
  const engineShipments = adaptShipmentsForEngine(shipmentData);
  // Then use the utility function to calculate forwarder performance
  return calculateForwarderPerformance(engineShipments);
}

// Get available data versions
export function getAvailableVersions(): string[] {
  return Object.keys(dataCache).filter(key => key !== 'latest');
}

// Get metadata for all datasets
export function getAllDatasetMetadata(): Record<string, DatasetMetadata> {
  const result: Record<string, DatasetMetadata> = {};
  
  Object.entries(dataCache).forEach(([version, { data, hash, timestamp }]) => {
    if (version !== 'latest') {
      result[version] = {
        version,
        hash,
        timestamp,
        rowCount: data.length,
        validationStatus: 'valid'
      };
    }
  });
  
  return result;
}
