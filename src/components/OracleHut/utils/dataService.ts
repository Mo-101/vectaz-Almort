
import { supabase } from '@/integrations/supabase/client';
import { Shipment, Forwarder } from '../types/types';

// Cache to store fetched data to minimize API calls
let shipmentCache: Shipment[] | null = null;
let forwarderCache: Forwarder[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache validity

/**
 * Fetch shipments from Supabase or cache if available and fresh
 */
export async function getShipments(): Promise<Shipment[]> {
  const currentTime = Date.now();
  
  // Use cache if available and not expired
  if (shipmentCache && (currentTime - lastFetchTime) < CACHE_TTL) {
    return shipmentCache;
  }
  
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*');
    
    if (error) throw error;
    
    // Update cache
    shipmentCache = data;
    lastFetchTime = currentTime;
    
    return data;
  } catch (error) {
    console.error('Error fetching shipments:', error);
    // If cache is available but expired, still use it as fallback
    if (shipmentCache) return shipmentCache;
    return [];
  }
}

/**
 * Fetch forwarders from Supabase or cache if available and fresh
 */
export async function getForwarders(): Promise<Forwarder[]> {
  const currentTime = Date.now();
  
  // Use cache if available and not expired
  if (forwarderCache && (currentTime - lastFetchTime) < CACHE_TTL) {
    return forwarderCache;
  }
  
  try {
    const { data, error } = await supabase
      .from('forwarders')
      .select('*');
    
    if (error) throw error;
    
    // Update cache
    forwarderCache = data;
    lastFetchTime = currentTime;
    
    return data;
  } catch (error) {
    console.error('Error fetching forwarders:', error);
    // If cache is available but expired, still use it as fallback
    if (forwarderCache) return forwarderCache;
    return [];
  }
}

/**
 * Filter shipments by origin country
 */
export async function getShipmentsByOrigin(origin: string): Promise<Shipment[]> {
  const shipments = await getShipments();
  return shipments.filter(
    shipment => shipment.origin_country && 
    shipment.origin_country.toLowerCase().includes(origin.toLowerCase())
  );
}

/**
 * Filter shipments by destination country
 */
export async function getShipmentsByDestination(destination: string): Promise<Shipment[]> {
  const shipments = await getShipments();
  return shipments.filter(
    shipment => shipment.destination_country && 
    shipment.destination_country.toLowerCase().includes(destination.toLowerCase())
  );
}

/**
 * Get average transit time between two locations
 */
export function calculateAverageTransitDays(shipments: Shipment[]): number {
  const shipmentsWithDates = shipments.filter(
    s => s.estimated_delivery_date && s.actual_delivery_date
  );
  
  if (shipmentsWithDates.length === 0) return 0;
  
  const totalDays = shipmentsWithDates.reduce((sum, shipment) => {
    const estDate = new Date(shipment.estimated_delivery_date!);
    const actDate = new Date(shipment.actual_delivery_date!);
    const diffTime = Math.abs(actDate.getTime() - estDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);
  
  return totalDays / shipmentsWithDates.length;
}

/**
 * Get forwarder by name
 */
export async function getForwardersByName(name: string): Promise<Forwarder[]> {
  const forwarders = await getForwarders();
  return forwarders.filter(
    forwarder => forwarder.name.toLowerCase().includes(name.toLowerCase())
  );
}
