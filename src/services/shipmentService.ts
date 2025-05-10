
import { supabase } from '@/integrations/supabase/client';
import { storePendingOperation } from '@/utils/offlineCache';
import type { Shipment } from '@/types/deeptrack';

export const addShipment = async (shipment: Omit<Shipment, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const shipmentData = {
      ...shipment,
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

    // Convert response to match our Shipment type
    return {
      ...data[0],
      request_reference: data[0].id, // Use ID as request reference if none exists
      cargo_description: '',
      item_category: '',
      carrier: data[0].freight_carrier || ''
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
  
  // Convert database records to match our Shipment type
  return data.map(record => ({
    ...record,
    request_reference: record.id,
    cargo_description: '',
    item_category: '',
    carrier: record.freight_carrier || ''
  })) as Shipment[];
};
