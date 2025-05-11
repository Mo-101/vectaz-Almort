
import { runNeuroSymbolicCycle } from '@/symbolic-engine/orchestrator/symbolicOrchestrator';

/**
 * Analyzes shipment data using the symbolic engine
 * @param shipmentData Array of shipment data objects 
 * @returns Analysis results or null if analysis fails
 */
export async function analyzeShipmentWithSymbolic(shipmentData: any[]) {
  if (!shipmentData || shipmentData.length === 0) {
    return null;
  }

  // Extract information from the most recent shipment for analysis
  const recentShipment = shipmentData[0];
  
  // Create sample decision matrix for symbolic analysis
  const decisionMatrix = [
    [0.85, 0.70, 0.90], // DHL
    [0.75, 0.85, 0.80], // FedEx
    [0.90, 0.60, 0.75], // Kuehne+Nagel
    [0.80, 0.75, 0.70]  // DSV
  ];
  
  const weights = [0.4, 0.3, 0.3];
  const criteriaTypes: ("benefit" | "cost")[] = ['benefit', 'benefit', 'benefit'];
  const alternatives = ['DHL', 'FedEx', 'Kuehne+Nagel', 'DSV'];
  
  const weight = recentShipment?.weight_kg || 14500;
  const volume = recentShipment?.volume_cbm || 45;
  
  // Use sample coordinates if shipment data doesn't have them
  const originLat = recentShipment?.origin_latitude || 1.3521;
  const originLng = recentShipment?.origin_longitude || 103.8198;
  const destLat = recentShipment?.destination_latitude || -33.8688;
  const destLng = recentShipment?.destination_longitude || 151.2093;
  
  // Prepare forwarder data for analysis
  const forwarders = [
    { name: 'DHL', reliability: 0.84, delayRate: 0.12 },
    { name: 'FedEx', reliability: 0.76, delayRate: 0.18 },
    { name: 'Kuehne+Nagel', reliability: 0.79, delayRate: 0.22 },
    { name: 'DSV', reliability: 0.62, delayRate: 0.34 }
  ];
  
  // Run the symbolic engine cycle
  try {
    const result = runNeuroSymbolicCycle({
      decisionMatrix,
      weights,
      criteriaTypes,
      alternatives,
      forwarders,
      weight,
      volume,
      originLat,
      originLng,
      destLat,
      destLng
    });
    
    return result;
  } catch (error) {
    console.error('Error in symbolic analysis:', error);
    return null;
  }
}
