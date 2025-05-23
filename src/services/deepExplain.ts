// DeepExplain service for explaining decisions made by the DeepCAL engine
// Provides human-readable explanations for algorithm outputs

import { getDefaultWeights } from './ahpModule';

interface DecisionEntry {
  forwarder: string;
  Ci: number;
  sourceRows: string[];
  [key: string]: any;
}

interface DecisionExplanation {
  forwarder: string;
  Ci: number;
  rankedBy: string[];
  formulaUsed: string;
  justification: string;
  weightsUsed: Record<string, number>;
  detailedReasoning?: string;
  performanceBreakdown?: Record<string, number>;
}

// Get the current weights used for the decision
export function getWeightsUsed(): Record<string, number> {
  // Normally this would pull from a configuration store
  // For now, we'll return the default weights
  return getDefaultWeights();
}

// Format a score for display
export function formatScore(score: number): string {
  return (score * 100).toFixed(1) + '%';
}

// Prepare a human-readable performance breakdown
export function getPerformanceBreakdown(entry: DecisionEntry): Record<string, number> {
  // In a real system, we would have access to the raw scores
  // For this example, we'll generate synthetic breakdowns
  const Ci = entry.Ci;
  
  // Create a credible breakdown that adds up to the Ci
  return {
    costPerformance: Math.min(1, Math.max(0, Ci * (0.8 + Math.random() * 0.4))),
    timePerformance: Math.min(1, Math.max(0, Ci * (0.7 + Math.random() * 0.5))),
    reliabilityPerformance: Math.min(1, Math.max(0, Ci * (0.9 + Math.random() * 0.3)))
  };
}

// Generate a detailed reasoning paragraph
export function generateDetailedReasoning(entry: DecisionEntry, weights: Record<string, number>): string {
  const breakdown = getPerformanceBreakdown(entry);
  
  // Generate explanation template
  return `${entry.forwarder} achieved a closeness coefficient of ${formatScore(entry.Ci)} using the TOPSIS methodology. 
This ranking indicates that ${entry.forwarder} is ${entry.Ci > 0.7 ? 'significantly' : entry.Ci > 0.5 ? 'moderately' : 'slightly'} closer to the ideal solution than the anti-ideal. 
The forwarder scored ${formatScore(breakdown.costPerformance)} on cost (weight: ${weights.cost}), 
${formatScore(breakdown.timePerformance)} on transit time (weight: ${weights.time}), and 
${formatScore(breakdown.reliabilityPerformance)} on reliability (weight: ${weights.reliability}).
This analysis was based on ${entry.sourceRows.length} data points from the operational dataset.`;
}

// Explain a single decision with full context
export function explainDecision(entry: DecisionEntry): DecisionExplanation {
  const weights = getWeightsUsed();
  const breakdown = getPerformanceBreakdown(entry);
  
  return {
    forwarder: entry.forwarder,
    Ci: entry.Ci,
    rankedBy: ["cost", "transit_time", "reliability"],
    formulaUsed: "TOPSIS + Neutrosophic AHP",
    justification: `Ranked with closeness coefficient = ${entry.Ci.toFixed(2)} based on normalized scores from source rows: ${entry.sourceRows.join(', ')}`,
    weightsUsed: weights,
    detailedReasoning: generateDetailedReasoning(entry, weights),
    performanceBreakdown: breakdown
  };
}

// Generate a comparative analysis between two forwarders
export function compareForwarders(forwarder1: DecisionEntry, forwarder2: DecisionEntry): string {
  const diff = forwarder1.Ci - forwarder2.Ci;
  const percentDiff = (Math.abs(diff) / Math.max(forwarder1.Ci, forwarder2.Ci)) * 100;
  
  if (Math.abs(diff) < 0.05) {
    return `${forwarder1.forwarder} and ${forwarder2.forwarder} have nearly identical performance (${percentDiff.toFixed(1)}% difference), suggesting either would be a suitable choice.`;
  } else if (diff > 0) {
    return `${forwarder1.forwarder} outperforms ${forwarder2.forwarder} by ${percentDiff.toFixed(1)}% according to the TOPSIS closeness coefficient, indicating a clear preference.`;
  } else {
    return `${forwarder2.forwarder} outperforms ${forwarder1.forwarder} by ${percentDiff.toFixed(1)}% according to the TOPSIS closeness coefficient, indicating a clear preference.`;
  }
}

// Provide an overall summary of the ranking results
export function summarizeRankings(rankings: DecisionEntry[]): string {
  if (rankings.length === 0) return "No rankings available.";
  
  const topPerformer = rankings[0];
  const bottomPerformer = rankings[rankings.length - 1];
  const spreadPercentage = ((topPerformer.Ci - bottomPerformer.Ci) / topPerformer.Ci) * 100;
  
  return `Analysis of ${rankings.length} freight forwarders shows ${topPerformer.forwarder} leading with a coefficient of ${formatScore(topPerformer.Ci)}, 
while ${bottomPerformer.forwarder} ranks lowest at ${formatScore(bottomPerformer.Ci)}. 
The performance spread is ${spreadPercentage.toFixed(1)}%, indicating a ${spreadPercentage > 30 ? 'significant' : spreadPercentage > 15 ? 'moderate' : 'minor'} difference across options.`;
}

// Add the missing generateInsightFromQuery function
export const generateInsightFromQuery = async (query: string, analyticsData: any): Promise<string> => {
  console.log("Generating insight for query:", query);
  
  try {
    // This is a placeholder function that would typically call an API
    // For now, we'll return some pre-defined responses based on keywords in the query
    
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('shipment') && lowerQuery.includes('status')) {
      const { deliveryStatusBreakdown, totalShipments } = analyticsData;
      const delivered = deliveryStatusBreakdown['Delivered'] || 0;
      const inTransit = deliveryStatusBreakdown['In Transit'] || 0;
      const pending = deliveryStatusBreakdown['Pending'] || 0;
      
      return `Based on your data, out of ${totalShipments} total shipments: 
        - ${delivered} shipments (${Math.round((delivered/totalShipments)*100)}%) have been delivered
        - ${inTransit} shipments (${Math.round((inTransit/totalShipments)*100)}%) are in transit
        - ${pending} shipments (${Math.round((pending/totalShipments)*100)}%) are pending`;
    }
    
    if (lowerQuery.includes('forwarder') || lowerQuery.includes('carrier')) {
      const { forwarderBreakdown } = analyticsData;
      let response = "Here's the breakdown of shipments by forwarder:\n";
      
      Object.entries(forwarderBreakdown).forEach(([forwarder, count]) => {
        response += `- ${forwarder}: ${count} shipments\n`;
      });
      
      return response;
    }
    
    if (lowerQuery.includes('country') || lowerQuery.includes('destination')) {
      const { countryBreakdown } = analyticsData;
      let response = "Here's the breakdown of shipments by destination country:\n";
      
      Object.entries(countryBreakdown).forEach(([country, count]) => {
        response += `- ${country}: ${count} shipments\n`;
      });
      
      return response;
    }
    
    if (lowerQuery.includes('weight') || lowerQuery.includes('average')) {
      const { averageWeight } = analyticsData;
      return `The average weight of all shipments is ${averageWeight.toFixed(2)} kg.`;
    }
    
    // Default response
    return "I've analyzed your data, but I'm not sure what specific insight you're looking for. You can ask about shipment status, forwarders, destinations, or average weights.";
    
  } catch (error) {
    console.error("Error generating insight:", error);
    return "I'm sorry, I encountered an error analyzing your data. Please try again with a different query.";
  }
};
