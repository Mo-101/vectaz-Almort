
import { supabase } from '@/integrations/supabase/client';
import { storePendingOperation } from '@/utils/offlineCache';
import type { Shipment } from '@/types/deeptrack';

export const addShipment = async (shipment: Omit<Shipment, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Convert the shipment data to match the database structure
    const shipmentData = {
      // Required fields for the database
      id: undefined, // Let Supabase generate this
      request_reference: shipment.request_reference || `REQ-${Date.now()}`,
      destination_country: shipment.destination_country,
      destination_latitude: shipment.destination_latitude,
      destination_longitude: shipment.destination_longitude,
      origin_country: shipment.origin_country,
      origin_latitude: shipment.origin_latitude,
      origin_longitude: shipment.origin_longitude,
      weight_kg: typeof shipment.weight_kg === 'string' ? parseFloat(shipment.weight_kg as string) : shipment.weight_kg,
      volume_cbm: typeof shipment.volume_cbm === 'string' ? parseFloat(shipment.volume_cbm as string) : shipment.volume_cbm,
      date_of_collection: shipment.date_of_collection,
      freight_carrier: shipment.freight_carrier || shipment.carrier || '',
      
      // Optional fields with fallbacks
      delivery_status: shipment.status || shipment.delivery_status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('shipments')
      .insert([shipmentData])
      .select();

    if (error) {
      await storePendingOperation('addShipment', shipment);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from insert operation');
    }

    // Convert database response to match our Shipment type
    return {
      id: data[0].id,
      request_reference: shipment.request_reference || data[0].id,
      cargo_description: shipment.cargo_description || '',
      item_category: shipment.item_category || '',
      carrier: data[0].freight_carrier || '',
      freight_carrier: data[0].freight_carrier || '',
      weight_kg: shipment.weight_kg || 0,
      volume_cbm: shipment.volume_cbm || 0,
      date_of_collection: shipment.date_of_collection || new Date().toISOString(),
      origin_country: data[0].origin_country,
      origin_latitude: data[0].origin_latitude,
      origin_longitude: data[0].origin_longitude,
      destination_country: data[0].destination_country,
      destination_latitude: data[0].destination_latitude,
      destination_longitude: data[0].destination_longitude,
      delivery_status: data[0].delivery_status,
      date_of_greenlight_to_pickup: shipment.date_of_greenlight_to_pickup || null,
      // Add other fields with reasonable defaults
      "carrier+cost": shipment["carrier+cost"] || '',
      "freight_carrier+cost": shipment["freight_carrier+cost"] || '',
      kuehne_nagel: false,
      scan_global_logistics: false,
      dhl_express: false,
      dhl_global: false,
      bwosi: false,
      agl: false,
      siginon: false,
      frieght_in_time: false,
      // Include any other required fields from the Shipment type
      created_at: data[0].created_at,
      updated_at: data[0].updated_at,
    } as Shipment;
  } catch (error) {
    console.error('Failed to add shipment:', error);
    throw error;
  }
};

export const getShipments = async () => {
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  if (!data) return [];
  
  // Convert database records to match our Shipment type
  return data.map(record => ({
    id: record.id,
    request_reference: record.request_reference || record.id,
    cargo_description: '',
    item_category: '',
    carrier: record.freight_carrier || '',
    freight_carrier: record.freight_carrier || '',
    weight_kg: 0,
    volume_cbm: 0,
    date_of_collection: record.date_of_collection || '',
    origin_country: record.origin_country,
    origin_latitude: record.origin_latitude,
    origin_longitude: record.origin_longitude,
    destination_country: record.destination_country,
    destination_latitude: record.destination_latitude,
    destination_longitude: record.destination_longitude,
    delivery_status: record.delivery_status,
    date_of_greenlight_to_pickup: null,
    // Add defaults for required fields
    "carrier+cost": '',
    "freight_carrier+cost": '',
    kuehne_nagel: false,
    scan_global_logistics: false,
    dhl_express: false,
    dhl_global: false,
    bwosi: false,
    agl: false,
    siginon: false,
    frieght_in_time: false,
    created_at: record.created_at,
    updated_at: record.updated_at,
    // Any additional fields from the Shipment type
  })) as Shipment[];
};
