
/**
 * Symbolic Engine Logic
 * 
 * This module contains the core logic for the symbolic engine,
 * including anomaly detection and inference.
 */

/**
 * Detect anomalies in forwarder data
 * @param forwarders Array of forwarder data with reliability and delay rates
 * @returns Array of insights about problematic forwarders
 */
export function detectAnomalies(
  forwarders: Array<{
    name: string;
    reliability: number;
    delayRate: number;
  }>
): Array<{
  forwarder: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}> {
  const insights: Array<{
    forwarder: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }> = [];
  
  forwarders.forEach(forwarder => {
    // Check for poor reliability
    if (forwarder.reliability < 0.7) {
      insights.push({
        forwarder: forwarder.name,
        message: `${forwarder.name} has low reliability at ${Math.round(forwarder.reliability * 100)}%`,
        severity: 'high'
      });
    }
    
    // Check for high delay rate
    if (forwarder.delayRate > 0.25) {
      insights.push({
        forwarder: forwarder.name,
        message: `${forwarder.name} has high delay rate at ${Math.round(forwarder.delayRate * 100)}%`,
        severity: forwarder.delayRate > 0.4 ? 'high' : 'medium'
      });
    }
    
    // Check for low reliability combined with moderate delay rate
    if (forwarder.reliability < 0.8 && forwarder.delayRate > 0.15) {
      insights.push({
        forwarder: forwarder.name,
        message: `${forwarder.name} has borderline performance issues`,
        severity: 'medium'
      });
    }
  });
  
  return insights;
}

/**
 * Update forwarder trust based on actual performance
 * @param forwarder Forwarder data
 * @param actualTime Actual transit time
 * @param predictedTime Predicted transit time
 * @returns Updated forwarder data with adjusted reliability
 */
export function updateForwarderTrust(
  forwarder: { name: string; reliability: number },
  actualTime: number,
  predictedTime: number
): { name: string; reliability: number } {
  const delta = Math.abs(actualTime - predictedTime);
  const maxAcceptableDelta = Math.max(2, predictedTime * 0.15);
  
  // Calculate reliability adjustment based on delta
  let reliabilityAdjustment = 0;
  if (delta <= maxAcceptableDelta) {
    // Within acceptable range, small positive adjustment
    reliabilityAdjustment = 0.02;
  } else if (delta <= maxAcceptableDelta * 1.5) {
    // Slightly outside acceptable range, small negative adjustment
    reliabilityAdjustment = -0.03;
  } else if (delta <= maxAcceptableDelta * 2) {
    // Moderately outside acceptable range, medium negative adjustment
    reliabilityAdjustment = -0.05;
  } else {
    // Far outside acceptable range, large negative adjustment
    reliabilityAdjustment = -0.10;
  }
  
  // Apply adjustment, ensuring reliability stays between 0 and 1
  const newReliability = Math.min(1, Math.max(0, forwarder.reliability + reliabilityAdjustment));
  
  return {
    name: forwarder.name,
    reliability: newReliability
  };
}
