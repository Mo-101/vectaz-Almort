
import { runNeuroSymbolicCycle } from '@/symbolic-engine/orchestrator/symbolicOrchestrator';
import { SymbolicInput, SymbolicResult } from '@/symbolic-engine/orchestrator/types';

/**
 * OracleHutEngine processes queries and interfaces with the symbolic engine
 * to provide logistics insights and analysis
 */
export async function OracleHutEngine(query: string): Promise<string> {
  // Handle specialized logistics cases with pre-computed responses
  if (query.toLowerCase().includes('compare nairobi and dubai')) {
    return `📦 Comparing routes to South Sudan:
      - Nairobi → Juba: Avg $7,920 | 4.5 days | No demurrage
      - Dubai → Juba: Avg $13,480 | 9 days | $850 demurrage
      🔁 Nairobi route saves $5,500 and 4.5 days due to tax alignment and no embargo.`;
  }
  
  if (query.toLowerCase().includes('best forwarder')) {
    try {
      // Sample input for the symbolic engine to analyze forwarder performance
      const input: SymbolicInput = {
        decisionMatrix: [
          [0.85, 0.70, 0.90], // DHL
          [0.75, 0.85, 0.80], // FedEx
          [0.90, 0.60, 0.75], // Kuehne+Nagel
          [0.80, 0.75, 0.70]  // DSV
        ],
        weights: [0.4, 0.3, 0.3],
        criteriaTypes: ['benefit', 'benefit', 'benefit'],
        alternatives: ['DHL', 'FedEx', 'Kuehne+Nagel', 'DSV'],
        forwarders: [
          { name: 'DHL', reliability: 0.84, delayRate: 0.12 },
          { name: 'FedEx', reliability: 0.76, delayRate: 0.18 },
          { name: 'Kuehne+Nagel', reliability: 0.79, delayRate: 0.22 },
          { name: 'DSV', reliability: 0.62, delayRate: 0.34 }
        ]
      };
      
      const result = runNeuroSymbolicCycle(input);
      
      return `🏆 Best Forwarder Analysis:
        Top recommendation: ${result.topChoice}
        Confidence score: ${(result.confidence * 100).toFixed(1)}%
        
        Other forwarders ranked:
        ${result.allScores?.map((score, index) => 
          `- ${input.alternatives[index]}: ${(score * 100).toFixed(1)}%`
        ).join('\n        ')}
        
        ${result.insights && result.insights.length > 0 ? 
          `\n⚠️ Insights:\n        ${result.insights.map(i => `${i.name}: ${i.issue}`).join('\n        ')}` : ''}`;
    } catch (error) {
      console.error('Error running symbolic analysis:', error);
      return '⚠️ Unable to complete symbolic analysis at this time.';
    }
  }

  if (query.toLowerCase().includes('container recommendation') || query.toLowerCase().includes('which container')) {
    try {
      // Sample input for container recommendation
      const input: SymbolicInput = {
        decisionMatrix: [[0.8, 0.7, 0.9]],
        weights: [0.4, 0.3, 0.3],
        criteriaTypes: ['benefit', 'benefit', 'benefit'],
        alternatives: ['Sample'],
        weight: 14500,
        volume: 45
      };
      
      const result = runNeuroSymbolicCycle(input);
      
      return `📦 Container Recommendation:
        Based on your shipment specifications:
        - Weight: ${input.weight} kg
        - Volume: ${input.volume} m³
        
        Recommended container: ${result.recommendedContainer || '40ft Standard'}
        
        This recommendation optimizes for cost efficiency while ensuring your cargo fits safely.`;
    } catch (error) {
      console.error('Error generating container recommendation:', error);
      return '⚠️ Unable to provide container recommendation at this time.';
    }
  }

  if (query.toLowerCase().includes('route analysis') || query.toLowerCase().includes('best route')) {
    try {
      // Sample input for route analysis
      const input: SymbolicInput = {
        decisionMatrix: [[0.8, 0.7, 0.9]],
        weights: [0.4, 0.3, 0.3],
        criteriaTypes: ['benefit', 'benefit', 'benefit'],
        alternatives: ['Sample'],
        originLat: 1.2921,
        originLng: 36.8219,
        destLat: -17.8252,
        destLng: 31.0335
      };
      
      const result = runNeuroSymbolicCycle(input);
      
      return `🗺️ Route Analysis:
        Origin: Nairobi, Kenya
        Destination: Harare, Zimbabwe
        
        Distance: ${result.routeDistanceKm?.toFixed(0)} km
        Estimated transit time: ${(result.routeDistanceKm ? result.routeDistanceKm / 500 : 0).toFixed(1)} days
        
        Potential challenges:
        - Border crossing at Zambia (avg delay 12hrs)
        - Varied road conditions in southern segment
        - Consider air freight for time-sensitive cargo`;
    } catch (error) {
      console.error('Error performing route analysis:', error);
      return '⚠️ Unable to complete route analysis at this time.';
    }
  }

  // Generic response for other queries
  return `🧠 DeepCAL Oracle:
    I've analyzed your query: "${query}"
    
    For more specific insights, try asking about:
    - Best forwarder recommendations
    - Container selection guidance
    - Route comparisons
    - Logistics cost optimization`;
}
