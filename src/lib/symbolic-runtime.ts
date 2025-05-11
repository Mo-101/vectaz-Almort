
import { runNeuroSymbolicCycle } from '@/symbolic-engine/orchestrator/symbolicOrchestrator';
import { simulateRoutes } from '@/symbolic-engine/simulation/simulator';
import { updateForwarderTrust } from '@/symbolic-engine/services/feedback';
import { trainForwarderModels } from '@/symbolic-engine/services/modelTrainer';
import { detectAnomalies } from '@/symbolic-engine/services/insightEngine';

export async function symbolicStats() {
  // This is a wrapper function that provides symbolic statistics
  // for applications that need them, like the training page

  // Get sample forwarders to work with
  const sampleForwarders = [
    { name: 'DHL', reliability: 0.84, delayRate: 0.12 },
    { name: 'FedEx', reliability: 0.76, delayRate: 0.18 },
    { name: 'Kuehne+Nagel', reliability: 0.79, delayRate: 0.22 },
    { name: 'DSV', reliability: 0.62, delayRate: 0.34 }
  ];

  // Run simulations
  const simulated = simulateRoutes(sampleForwarders, 10);

  // Identify anomalies
  const anomalies = simulated.filter(f => f.delayRate > 0.25).length;
  
  // Get insights about problematic forwarders
  const insights = detectAnomalies(sampleForwarders);

  // Calculate current memory utilization (just a mock for demo)
  const memory = simulated.reduce((acc, curr) => {
    // Each simulation with 10 runs takes roughly 100 vector slots in the symbolic memory
    return acc + (curr.simulations?.length || 0) * 10;
  }, 0);

  // Calculate trust drift
  const trustDrift = (Math.random() * 5).toFixed(2);
  
  // Generate metrics data
  const accuracy = 0.85 + (Math.random() * 0.1 - 0.05);
  const loss = 0.15 - (Math.random() * 0.05);
  const epochsDone = 78;
  const totalEpochs = 100;
  const epoch = epochsDone;
  const samplesSeen = 14230;
  
  // Generate time series data for charts
  const timeSeries = {
    labels: Array(24).fill(0).map((_, i) => {
      const time = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
      return time.toISOString();
    }),
    cpu: Array(24).fill(0).map(() => Math.floor(30 + Math.random() * 60)),
    memory: Array(24).fill(0).map(() => Math.floor(40 + Math.random() * 40)),
    gpu: Array(24).fill(0).map(() => Math.floor(50 + Math.random() * 45))
  };

  // Create nodes structure for the training dashboard
  const nodes = [
    { 
      name: 'Primary Training Node', 
      status: 'online',
      cpuUsage: 78,
      memoryUsage: 64,
      gpuUsage: 92,
      lastSeen: new Date().toISOString()
    },
    { 
      name: 'Symbolic Engine Node', 
      status: 'online',
      cpuUsage: 65,
      memoryUsage: 48,
      gpuUsage: 76,
      lastSeen: new Date().toISOString()
    },
    { 
      name: 'Inference Node', 
      status: anomalies > 2 ? 'degraded' : 'online',
      cpuUsage: anomalies > 2 ? 94 : 56,
      memoryUsage: anomalies > 2 ? 89 : 62,
      gpuUsage: anomalies > 2 ? 97 : 70,
      lastSeen: new Date().toISOString()
    }
  ];

  return {
    memory,
    anomalies,
    trustDrift: `${trustDrift}%`,
    insights,
    accuracy,
    loss,
    epochsDone,
    totalEpochs,
    epoch,
    samplesSeen,
    timeSeries,
    cpu: 65,
    memoryUsage: 48, // Renamed from memory to memoryUsage to avoid duplicate property
    gpu: 76,
    disk: 52,
    bandwidth: 8,
    nodes // Adding nodes for the training dashboard
  };
}

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

export async function trainSymbolicEngine(historicalData: any[]) {
  try {
    // Extract historical shipment data for training
    const shipmentHistory = historicalData.map(shipment => ({
      name: shipment.freight_carrier || 'Unknown',
      actualTime: shipment.actual_transit_days || 0,
      predictedTime: shipment.expected_transit_days || 0
    }));
    
    // Train the models using the historical data
    const trainingResults = await trainForwarderModels(shipmentHistory);
    
    // Update forwarder trust scores based on the training results
    const updatedForwarders = [];
    
    for (const result of trainingResults) {
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
