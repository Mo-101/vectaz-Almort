
import { evaluateForwarders, getSampleForwarderData } from '@/utils/deepCalEngine';
import { traceCalculation } from '@/utils/debugCalculations';

/**
 * Safely converts any string or number value to a number
 * @param value The value to convert
 * @returns A number representation of the value
 */
export function fixNumberAddition(value: string | number): number {
  return typeof value === 'string' ? parseFloat(value) : value;
}

/**
 * Processes shipment data to ensure required fields exist
 * @param shipmentData The shipment data to process
 * @returns Processed shipment data with required fields
 */
export function processShipmentData(shipmentData: any) {
  // Ensure carrier property exists
  return {
    ...shipmentData,
    carrier: shipmentData.carrier || shipmentData.freight_carrier || '',
    expected_delivery_date: shipmentData.expected_delivery_date || null,
    // Ensure numeric values are properly converted
    weight_kg: fixNumberAddition(shipmentData.weight_kg || 0),
    volume_cbm: fixNumberAddition(shipmentData.volume_cbm || 0),
    origin_longitude: fixNumberAddition(shipmentData.origin_longitude || 0),
    origin_latitude: fixNumberAddition(shipmentData.origin_latitude || 0),
    destination_longitude: fixNumberAddition(shipmentData.destination_longitude || 0),
    destination_latitude: fixNumberAddition(shipmentData.destination_latitude || 0)
  };
}

/**
 * Gets forwarder rankings based on weight factors
 * @param weightFactors Weight factors for cost, time, and reliability
 * @returns Ranked forwarders with scores
 */
export function getForwarderRankings(weightFactors: { cost: number, time: number, reliability: number }) {
  // Trace the calculation for debugging
  traceCalculation('getForwarderRankings', { weightFactors }, null, { logToConsole: true });
  
  // Get sample data for now, in a real app this would be replaced with API data
  const forwarderData = getSampleForwarderData();
  
  // Use the real DeepCAL engine to evaluate and rank forwarders
  return evaluateForwarders(forwarderData, weightFactors);
}

/**
 * Loads mock data for the DeepEngine
 * @returns true if data was loaded successfully
 */
export function loadMockData(): boolean {
  console.log("Mock data loaded for DeepEngine");
  return true;
}
