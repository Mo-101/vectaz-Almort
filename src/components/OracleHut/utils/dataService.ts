
import { Shipment, Forwarder } from '../types/types';
import { supabase } from '@/integrations/supabase/client';

// Cache mechanism to avoid frequent repeated queries
const cache: {
  shipments?: Shipment[];
  forwarders?: Forwarder[];
  lastFetch: {
    shipments?: Date;
    forwarders?: Date;
  };
} = {
  lastFetch: {}
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Get all shipments from the database or cache
 */
export async function getShipments(): Promise<Shipment[]> {
  // Check cache first
  if (
    cache.shipments && 
    cache.lastFetch.shipments && 
    (new Date().getTime() - cache.lastFetch.shipments.getTime() < CACHE_TTL)
  ) {
    console.log("Using cached shipments data");
    return cache.shipments;
  }
  
  try {
    console.log("Fetching fresh shipments from Supabase");
    const { data, error } = await supabase
      .from('shipments')
      .select('*');
      
    if (error) {
      console.error('Error fetching shipments:', error);
      return [];
    }
    
    // Update cache
    cache.shipments = data;
    cache.lastFetch.shipments = new Date();
    
    return data;
  } catch (error) {
    console.error('Failed to fetch shipments:', error);
    return [];
  }
}

/**
 * Get shipments filtered by origin country
 */
export async function getShipmentsByOrigin(origin: string): Promise<Shipment[]> {
  // Try to use cache if available
  if (cache.shipments && cache.shipments.length > 0) {
    return cache.shipments.filter(s => 
      s.origin_country && s.origin_country.toLowerCase().includes(origin.toLowerCase())
    );
  }
  
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .ilike('origin_country', `%${origin}%`);
      
    if (error) {
      console.error('Error fetching shipments by origin:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch shipments by origin ${origin}:`, error);
    return [];
  }
}

/**
 * Get shipments filtered by destination country
 */
export async function getShipmentsByDestination(destination: string): Promise<Shipment[]> {
  // Try to use cache if available
  if (cache.shipments && cache.shipments.length > 0) {
    return cache.shipments.filter(s => 
      s.destination_country && s.destination_country.toLowerCase().includes(destination.toLowerCase())
    );
  }
  
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .ilike('destination_country', `%${destination}%`);
      
    if (error) {
      console.error('Error fetching shipments by destination:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch shipments by destination ${destination}:`, error);
    return [];
  }
}

/**
 * Calculate average transit days for a set of shipments
 */
export function calculateAverageTransitDays(shipments: Shipment[]): number {
  if (!shipments || shipments.length === 0) {
    return 0;
  }
  
  const shipmentsWithDates = shipments.filter(
    s => s.estimated_delivery_date && s.created_at
  );
  
  if (shipmentsWithDates.length === 0) {
    return 0;
  }
  
  const totalDays = shipmentsWithDates.reduce((sum, shipment) => {
    const createdDate = new Date(shipment.created_at as string);
    const deliveryDate = new Date(shipment.estimated_delivery_date as string);
    
    // Calculate days difference
    const diffTime = Math.abs(deliveryDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return sum + diffDays;
  }, 0);
  
  return totalDays / shipmentsWithDates.length;
}

/**
 * Get all forwarders from the database or cache
 */
export async function getForwarders(): Promise<Forwarder[]> {
  // Check cache first
  if (
    cache.forwarders && 
    cache.lastFetch.forwarders && 
    (new Date().getTime() - cache.lastFetch.forwarders.getTime() < CACHE_TTL)
  ) {
    console.log("Using cached forwarders data");
    return cache.forwarders;
  }
  
  try {
    console.log("Fetching fresh forwarders from Supabase");
    const { data, error } = await supabase
      .from('forwarders')
      .select('*');
      
    if (error) {
      console.error('Error fetching forwarders:', error);
      return [];
    }
    
    // Update cache
    cache.forwarders = data;
    cache.lastFetch.forwarders = new Date();
    
    return data;
  } catch (error) {
    console.error('Failed to fetch forwarders:', error);
    return [];
  }
}

/**
 * Get forwarders filtered by name
 */
export async function getForwardersByName(name: string): Promise<Forwarder[]> {
  // Try to use cache if available
  if (cache.forwarders && cache.forwarders.length > 0) {
    return cache.forwarders.filter(f => 
      f.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  try {
    const { data, error } = await supabase
      .from('forwarders')
      .select('*')
      .ilike('name', `%${name}%`);
      
    if (error) {
      console.error('Error fetching forwarders by name:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch forwarders by name ${name}:`, error);
    return [];
  }
}

/**
 * Clear the data cache to force fresh data on next query
 */
export function clearCache(): void {
  cache.shipments = undefined;
  cache.forwarders = undefined;
  cache.lastFetch = {};
  console.log("Data service cache cleared");
}
