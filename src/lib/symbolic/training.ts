
import { trainForwarderModels as trainModels } from '@/symbolic-engine/services/modelTrainer';
import { updateForwarderTrust } from '@/symbolic-engine/services/feedback';

/**
 * Trains the symbolic engine using historical shipment data
 * @param historicalData Array of historical shipment data objects
 * @returns Training results including updated trust scores
 */
export async function trainSymbolicEngine(historicalData: any[]) {
  try {
    // Extract historical shipment data for training
    const shipmentHistory = historicalData.map(shipment => ({
      name: shipment.freight_carrier || 'Unknown',
      actualTime: shipment.actual_transit_days || 0,
      predictedTime: shipment.expected_transit_days || 0
    }));
    
    // Train the models using the historical data - use true to force using historical data
    const trainingResults = await trainModels(true);
    
    // Update forwarder trust scores based on the training results
    const updatedForwarders = [];
    
    for (const result of trainingResults.deltas) {
      const { name, delta } = result;
      
      // Create a sample forwarder with initial trust
      const sampleForwarder = {
        name,
        reliability: 0.8 // Start with a default reliability score
      };
      
      // Update the forwarder's trust based on the delta between actual and predicted times
      const updatedForwarder = updateForwarderTrust(
        sampleForwarder,
        shipmentHistory.find(s => s.name === name)?.actualTime || 0,
        shipmentHistory.find(s => s.name === name)?.predictedTime || 0
      );
      
      updatedForwarders.push(updatedForwarder);
    }
    
    return {
      trainingCompleted: true,
      forwardersUpdated: updatedForwarders.length,
      trustScores: updatedForwarders.map(f => ({
        name: f.name,
        reliability: Math.round(f.reliability * 100)
      }))
    };
  } catch (error) {
    console.error('Error training symbolic engine:', error);
    return {
      trainingCompleted: false,
      error: String(error)
    };
  }
}
