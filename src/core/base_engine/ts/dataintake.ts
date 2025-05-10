import { Shipment } from "@/types/deeptrack";

// Metadata for the loaded dataset
export interface DatasetMetadata {
  version: string;
  hash: string;
  source: string;
  timestamp: string;
}

// Data validation configuration
export interface DataValidationConfig {
  requireShape: string[];
  minRows: number;
  onSuccess: () => void;
  onFail: (error: Error) => void;
}

// Error type for boot failures
export class BootFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BootFailure";
  }
}

// Validates the data structure against required fields
const validateDataStructure = (data: any[], requiredFields: string[]): boolean => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }
  
  return data.every(item => 
    requiredFields.every(field => field in item && item[field] !== null)
  );
};

// Calculates a simple hash of the data for versioning
// In production, this would use a proper SHA256 algorithm
const calculateDataHash = (data: any[]): string => {
  const jsonString = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'sha256-' + Math.abs(hash).toString(16);
};

// Process raw data into our Shipment format
export const processRawData = (data: any[]): Shipment[] => {
  return data.map(item => {
    // Parse forwarder quotes from columns
    const forwarderQuotes: Record<string, number> = {};
    const knownForwarders = [
      'kenya_airways', 'kuehne_nagel', 'scan_global_logistics', 
      'dhl_express', 'dhl_global', 'bwosi', 'agl', 'siginon', 'frieght_in_time'
    ];
    
    knownForwarders.forEach(forwarder => {
      if (item[forwarder] && typeof item[forwarder] === 'number') {
        forwarderQuotes[forwarder] = item[forwarder];
      }
    });
    
    return {
      id: item.id || item.request_reference,
      date_of_collection: item.date_of_collection,
      request_reference: item.request_reference || item.shipment_id,
      cargo_description: item.cargo_description || '',
      item_category: item.item_category || '',
      origin_country: item.origin_country || item.origin,
      origin_longitude: parseFloat(item.origin_longitude),
      origin_latitude: parseFloat(item.origin_latitude),
      destination_country: item.destination_country || item.dest,
      destination_longitude: parseFloat(item.destination_longitude),
      destination_latitude: parseFloat(item.destination_latitude),
      freight_carrier: item.freight_carrier || item.carrier,
      carrier: item.carrier || item.freight_carrier || '',
      "carrier+cost": item["carrier+cost"] || '',
      "freight_carrier+cost": item["freight_carrier+cost"] || '',
      weight_kg: parseFloat(item.weight_kg),
      volume_cbm: parseFloat(item.volume_cbm),
      initial_quote_awarded: item.initial_quote_awarded,
      final_quote_awarded_freight_forwader_Carrier: item.final_quote_awarded_freight_forwader_Carrier,
      comments: item.comments,
      date_of_arrival_destination: item.date_of_arrival_destination,
      delivery_status: item.delivery_status,
      mode_of_shipment: item.mode_of_shipment,
      forwarder_quotes: forwarderQuotes,
      kuehne_nagel: item.kuehne_nagel || false,
      scan_global_logistics: item.scan_global_logistics || false,
      dhl_express: item.dhl_express || false,
      dhl_global: item.dhl_global || false,
      bwosi: item.bwosi || false,
      agl: item.agl || false,
      siginon: item.siginon || false,
      frieght_in_time: item.frieght_in_time || false,
      date_of_greenlight_to_pickup: item.date_of_greenlight_to_pickup || null,
    };
  });
};

// Main data validation and loading function
export const validateAndLoadData = (data: any[], config: DataValidationConfig): DatasetMetadata | null => {
  try {
    // Check minimum row count
    if (data.length < config.minRows) {
      const error = new BootFailure(`Boot halted: dataset contains only ${data.length} rows, minimum required is ${config.minRows}`);
      config.onFail(error);
      return null;
    }
    
    // Validate required fields
    if (!validateDataStructure(data, config.requireShape)) {
      const error = new BootFailure("Boot halted: data failed validation, required fields missing");
      config.onFail(error);
      return null;
    }
    
    // Process successful validation
    const metadata: DatasetMetadata = {
      version: `v1.0.0-deepbase`,
      hash: calculateDataHash(data),
      source: "deeptrack_2.csv",
      timestamp: new Date().toISOString()
    };
    
    config.onSuccess();
    return metadata;
    
  } catch (error) {
    config.onFail(error instanceof Error ? error : new Error(String(error)));
    return null;
  }
};
