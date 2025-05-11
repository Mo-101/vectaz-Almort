
import { evaluateForwarders, getSampleForwarderData } from '@/utils/deepCalEngine';
import { traceCalculation } from '@/utils/debugCalculations';

// Fix for lines 196 and 197 - converting string|number to number before addition
export function fixNumberAddition(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue;
}

// Fix for line 100 and 260 - ensure carrier property is included
export function processShipmentData(shipmentData: any) {
  // Ensure carrier property exists
  return {
    ...shipmentData,
    carrier: shipmentData.carrier || shipmentData.freight_carrier || '',
    expected_delivery_date: shipmentData.expected_delivery_date || null
  };
}

// Updated getForwarderRankings function to use the real engine implementation
export function getForwarderRankings(weightFactors: { cost: number, time: number, reliability: number }) {
  // Trace the calculation for debugging
  traceCalculation('getForwarderRankings', { weightFactors }, null, { logToConsole: true });
  
  // Get sample data for now, in a real app this would be replaced with API data
  const forwarderData = getSampleForwarderData();
  
  // Use the real DeepCAL engine to evaluate and rank forwarders
  return evaluateForwarders(forwarderData, weightFactors);
}

// Adding the missing loadMockData function for dataIntake.ts
export function loadMockData() {
  console.log("Mock data loaded for DeepEngine");
  return true;
}
