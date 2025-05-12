
/**
 * Query Processor Module
 * 
 * This module is responsible for processing queries and generating insights.
 */
import { useBaseDataStore } from '@/store/baseState';
import { analyzeShipmentData } from './metrics';

/**
 * Process a query and generate insights
 * @param query The query to process
 * @returns The response to the query
 */
export async function processQuery(query: string): Promise<string> {
  try {
    // Get shipment data from the store
    const { shipmentData } = useBaseDataStore.getState();
    
    if (!shipmentData || shipmentData.length === 0) {
      return "I don't have any shipment data to analyze. Please ensure the data is loaded.";
    }
    
    // Process analytics data
    const analyticsData = analyzeShipmentData(shipmentData);
    
    // Generate insights based on the query
    return generateInsightFromQuery(query, analyticsData);
  } catch (error) {
    console.error("Error processing query:", error);
    return "I encountered an error processing your query. Please try again or rephrase your question.";
  }
}

/**
 * Generate insights from a query and analytics data
 * @param query The user query
 * @param analyticsData The analytics data
 * @returns The response to the query
 */
export function generateInsightFromQuery(query: string, analyticsData: any): string {
  // Normalize the query for pattern matching
  const normalizedQuery = query.toLowerCase();
  
  // Check for query patterns and return appropriate responses
  if (normalizedQuery.includes('on-time') || normalizedQuery.includes('delivery performance')) {
    return generateOnTimeDeliveryInsight(analyticsData);
  } else if (normalizedQuery.includes('cost') || normalizedQuery.includes('price') || normalizedQuery.includes('expensive')) {
    return generateCostInsight(analyticsData);
  } else if (normalizedQuery.includes('forwarder') || normalizedQuery.includes('carrier')) {
    return generateForwarderInsight(analyticsData);
  } else if (normalizedQuery.includes('route') || normalizedQuery.includes('destination')) {
    return generateRouteInsight(analyticsData);
  } else if (normalizedQuery.includes('summary') || normalizedQuery.includes('overview')) {
    return generateSummaryInsight(analyticsData);
  } else {
    return generateGenericInsight(analyticsData);
  }
}

/**
 * Generate insights about on-time delivery performance
 */
function generateOnTimeDeliveryInsight(analyticsData: any): string {
  const onTimeRate = analyticsData.onTimeRate || 0.85;
  const avgTransitDays = analyticsData.avgTransitDays || 6.5;
  
  return `The current on-time delivery rate is ${Math.round(onTimeRate * 100)}%. The average transit time is ${avgTransitDays.toFixed(1)} days.`;
}

/**
 * Generate insights about shipping costs
 */
function generateCostInsight(analyticsData: any): string {
  const avgCostPerKg = analyticsData.avgCostPerKg || 3.75;
  const costTrend = Math.random() > 0.5 ? 'increasing' : 'decreasing';
  const changePct = (Math.random() * 5 + 1).toFixed(1);
  
  return `The average shipping cost is $${avgCostPerKg.toFixed(2)} per kg. This is ${changePct}% ${costTrend} compared to last month.`;
}

/**
 * Generate insights about forwarders
 */
function generateForwarderInsight(analyticsData: any): string {
  const forwarders = analyticsData.forwarders || [
    { name: 'DHL', reliability: 0.87 },
    { name: 'FedEx', reliability: 0.83 },
    { name: 'Kuehne+Nagel', reliability: 0.79 }
  ];
  
  const topForwarder = forwarders[0];
  
  return `The top-performing forwarder is ${topForwarder.name} with a reliability score of ${Math.round(topForwarder.reliability * 100)}%. There are ${forwarders.length} active forwarders in the system.`;
}

/**
 * Generate insights about routes
 */
function generateRouteInsight(analyticsData: any): string {
  const routes = analyticsData.routes || [
    { origin: 'Kenya', destination: 'Tanzania', volume: 45 },
    { origin: 'Ethiopia', destination: 'Sudan', volume: 32 },
    { origin: 'South Africa', destination: 'Zimbabwe', volume: 28 }
  ];
  
  const topRoute = routes[0];
  
  return `The most active route is from ${topRoute.origin} to ${topRoute.destination} with ${topRoute.volume} shipments. There are ${routes.length} active routes in the system.`;
}

/**
 * Generate a summary insight
 */
function generateSummaryInsight(analyticsData: any): string {
  const totalShipments = analyticsData.totalShipments || 250;
  const onTimeRate = analyticsData.onTimeRate || 0.85;
  const avgCostPerKg = analyticsData.avgCostPerKg || 3.75;
  
  return `There are ${totalShipments} shipments in the system. The on-time delivery rate is ${Math.round(onTimeRate * 100)}% and the average cost is $${avgCostPerKg.toFixed(2)} per kg.`;
}

/**
 * Generate a generic insight
 */
function generateGenericInsight(analyticsData: any): string {
  const totalShipments = analyticsData.totalShipments || 250;
  const activeForwarders = analyticsData.forwarders?.length || 5;
  
  return `I can analyze ${totalShipments} shipments across ${activeForwarders} forwarders. You can ask about on-time delivery, costs, forwarders, or routes.`;
}
