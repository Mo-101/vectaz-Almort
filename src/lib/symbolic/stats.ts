
import { detectAnomalies } from '@/symbolic-engine/services/insightEngine';
import { simulateRoutes } from '@/symbolic-engine/simulation/simulator';

/**
 * Provides symbolic statistics for applications that need them, like the training page
 */
export async function symbolicStats() {
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
    memoryUsage: 48,
    gpu: 76,
    disk: 52,
    bandwidth: 8,
    nodes
  };
}
