
/**
 * Data Loader Module
 * 
 * This module is responsible for loading and validating the base data
 * from the deeptrack_3.json file.
 */
import { z } from 'zod';
import { Shipment } from '@/types/deeptrack';

// Shipment schema validation
const ShipmentSchema = z.object({
  id: z.string().optional(),
  request_reference: z.string(),
  cargo_description: z.string(),
  item_category: z.string(),
  origin_country: z.string(),
  origin_latitude: z.number(),
  origin_longitude: z.number(),
  destination_country: z.string(),
  destination_latitude: z.number(),
  destination_longitude: z.number(),
  carrier: z.string(),
  "carrier+cost": z.string().optional(),
  kuehne_nagel: z.string().optional(),
  scan_global_logistics: z.string().optional(),
  dhl_express: z.string().optional(),
  dhl_global: z.string().optional(),
  bwosi: z.string().optional(),
  agl: z.string().optional(),
  siginon: z.string().optional(),
  frieght_in_time: z.string().optional(),
  weight_kg: z.union([z.string(), z.number()]),
  volume_cbm: z.union([z.string(), z.number()]),
  initial_quote_awarded: z.string().optional(),
  final_quote_awarded_freight_forwader_Carrier: z.string().optional(),
  comments: z.string().optional(),
  date_of_collection: z.string(),
  date_of_arrival_destination: z.string().optional(),
  delivery_status: z.string().optional(),
  mode_of_shipment: z.string().optional(),
  date_of_greenlight_to_pickup: z.string().nullable().optional(),
  forwarder_quotes: z.record(z.string(), z.union([z.string(), z.number()])).optional()
});

/**
 * Load the base shipment data from the deeptrack_3.json file
 * @returns An array of validated shipment data
 */
export async function loadBaseData(): Promise<Shipment[]> {
  try {
    console.log("Loading base data from deeptrack_3.json...");
    
    // Check for cached data first
    const cached = localStorage.getItem('deepcal_base_data');
    if (cached) {
      console.log("Using cached base data");
      return JSON.parse(cached);
    }

    try {
      // Import the deeptrack data
      const deeptrackData = require('@/core/base_data/deeptrack_3.json');
      console.log(`Loaded ${deeptrackData.length} records from deeptrack_3.json`);
      
      // Validate the data against the schema
      const validated = deeptrackData.map((entry: any, i: number) => {
        // Create fallback for missing fields
        const fallback = {
          id: entry.id ?? `shipment_${i}`,
          ...entry,
        };

        // Parse and validate using zod schema
        const parsed = ShipmentSchema.safeParse(fallback);
        if (!parsed.success) {
          console.warn('❌ Invalid shipment at index', i, parsed.error);
          return null;
        }
        return parsed.data;
      }).filter(Boolean);

      // Cache validated data
      localStorage.setItem('deepcal_base_data', JSON.stringify(validated));
      console.log(`Validated ${validated.length} shipment records`);
      
      return validated as Shipment[];
    } catch (error) {
      console.error('Failed to load deeptrack_3.json:', error);
      throw new Error('Critical: Could not load base data file deeptrack_3.json');
    }
  } catch (error) {
    console.error('Failed to load shipment data:', error);
    return [];
  }
}
