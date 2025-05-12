
/**
 * Query Metrics Module
 * 
 * This module calculates metrics and insights from shipment data.
 */
import { Shipment } from '@/types/deeptrack';

/**
 * Analyze shipment data to generate metrics and insights
 * @param shipmentData Array of shipment data
 * @returns Object containing metrics and insights
 */
export function analyzeShipmentData(shipmentData: Shipment[]): {
  totalShipments: number;
  onTimeRate: number;
  avgTransitDays: number;
  costEfficiency: number;
  routeResilience: number;
  modeSplit: {
    air: number;
    sea: number;
    road: number;
  };
  forwarders: Array<{
    name: string;
    reliability: number;
    totalShipments: number;
  }>;
  routes: Array<{
    origin: string;
    destination: string;
    volume: number;
    avgTransitDays: number;
  }>;
} {
  // Calculate total shipments
  const totalShipments = shipmentData.length;
  
  // Calculate on-time rate (simplified)
  const completedShipments = shipmentData.filter(s => 
    s.delivery_status === 'Delivered' || s.delivery_status === 'delivered'
  );
  
  const onTimeRate = completedShipments.length / Math.max(totalShipments, 1);
  
  // Calculate average transit days
  const transitTimes = completedShipments
    .filter(s => s.date_of_collection && s.date_of_arrival_destination)
    .map(s => {
      const collectionDate = new Date(s.date_of_collection);
      const arrivalDate = new Date(s.date_of_arrival_destination || '');
      return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
    });
  
  const avgTransitDays = transitTimes.length > 0 
    ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
    : 0;
  
  // Calculate cost efficiency
  const shipmentCosts = shipmentData
    .filter(s => 
      s.forwarder_quotes && 
      s.final_quote_awarded_freight_forwader_Carrier && 
      s.final_quote_awarded_freight_forwader_Carrier.toLowerCase() in (s.forwarder_quotes || {})
    )
    .map(s => {
      const forwarderName = s.final_quote_awarded_freight_forwader_Carrier?.toLowerCase() || '';
      const cost = s.forwarder_quotes ? s.forwarder_quotes[forwarderName] : 0;
      const costValue = typeof cost === 'string' ? parseFloat(cost) : (cost || 0);
      const weight = typeof s.weight_kg === 'string' ? parseFloat(s.weight_kg) : (s.weight_kg || 0);
      
      return { cost: costValue, weight };
    });
  
  const totalCost = shipmentCosts.reduce((sum, item) => sum + item.cost, 0);
  const totalWeight = shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
  
  const costEfficiency = totalWeight > 0 ? totalCost / totalWeight : 0;
  
  // Calculate route resilience (simplified)
  const routeResilience = 0.75 + (Math.random() * 0.2); // Placeholder
  
  // Calculate mode split
  const airShipments = shipmentData.filter(s => 
    s.mode_of_shipment === 'Air' || s.mode_of_shipment === 'air'
  ).length;
  
  const seaShipments = shipmentData.filter(s => 
    s.mode_of_shipment === 'Sea' || s.mode_of_shipment === 'sea'
  ).length;
  
  const roadShipments = shipmentData.filter(s => 
    s.mode_of_shipment === 'Road' || s.mode_of_shipment === 'road'
  ).length;
  
  const modeSplit = {
    air: totalShipments > 0 ? (airShipments / totalShipments) * 100 : 0,
    sea: totalShipments > 0 ? (seaShipments / totalShipments) * 100 : 0,
    road: totalShipments > 0 ? (roadShipments / totalShipments) * 100 : 0
  };
  
  // Calculate forwarder metrics
  const forwarderMap = new Map<string, {
    totalShipments: number;
    completedShipments: number;
  }>();
  
  shipmentData.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarder) return;
    
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, {
        totalShipments: 0,
        completedShipments: 0
      });
    }
    
    const stats = forwarderMap.get(forwarder)!;
    stats.totalShipments += 1;
    
    if (shipment.delivery_status === 'Delivered' || shipment.delivery_status === 'delivered') {
      stats.completedShipments += 1;
    }
  });
  
  const forwarders = Array.from(forwarderMap.entries())
    .map(([name, stats]) => ({
      name,
      reliability: stats.totalShipments > 0 ? stats.completedShipments / stats.totalShipments : 0,
      totalShipments: stats.totalShipments
    }))
    .sort((a, b) => b.reliability - a.reliability);
  
  // Calculate route metrics
  const routeMap = new Map<string, {
    origin: string;
    destination: string;
    shipments: Shipment[];
  }>();
  
  shipmentData.forEach(shipment => {
    const origin = shipment.origin_country;
    const destination = shipment.destination_country;
    if (!origin || !destination) return;
    
    const routeKey = `${origin}-${destination}`;
    
    if (!routeMap.has(routeKey)) {
      routeMap.set(routeKey, {
        origin,
        destination,
        shipments: []
      });
    }
    
    routeMap.get(routeKey)!.shipments.push(shipment);
  });
  
  const routes = Array.from(routeMap.values())
    .map(route => {
      // Calculate average transit days for this route
      const routeTransitTimes = route.shipments
        .filter(s => s.date_of_collection && s.date_of_arrival_destination)
        .map(s => {
          const collectionDate = new Date(s.date_of_collection);
          const arrivalDate = new Date(s.date_of_arrival_destination || '');
          return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24);
        });
      
      const routeAvgTransitDays = routeTransitTimes.length > 0 
        ? routeTransitTimes.reduce((sum, days) => sum + days, 0) / routeTransitTimes.length 
        : 0;
      
      return {
        origin: route.origin,
        destination: route.destination,
        volume: route.shipments.length,
        avgTransitDays: routeAvgTransitDays
      };
    })
    .sort((a, b) => b.volume - a.volume);
  
  return {
    totalShipments,
    onTimeRate,
    avgTransitDays,
    costEfficiency,
    routeResilience,
    modeSplit,
    forwarders,
    routes
  };
}
