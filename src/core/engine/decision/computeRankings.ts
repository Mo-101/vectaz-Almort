
/**
 * Compute Rankings Module
 * 
 * This module contains the core algorithm for computing forwarder rankings
 * based on the AHP and TOPSIS methods.
 */
import { Shipment } from '@/types/deeptrack';
import { CriteriaWeights, Recommendation } from './types';
import { traceCalculation } from '@/utils/debugCalculations';

/**
 * Compute forwarder rankings based on shipment data and criteria weights
 * @param shipmentData Array of shipment data
 * @param weights Criteria weights for cost, time, and reliability
 * @returns Array of ranked forwarders with scores
 */
export function computeForwarderRankings(
  shipmentData: Shipment[], 
  weights: CriteriaWeights
): Recommendation[] {
  // Trace the calculation for debugging
  traceCalculation('computeForwarderRankings', { shipmentData, weights }, null);
  
  // Group shipments by forwarder
  const forwarderMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (forwarder && forwarder !== 'Hand carried' && forwarder !== 'UNHAS') {
      if (!forwarderMap.has(forwarder)) {
        forwarderMap.set(forwarder, []);
      }
      forwarderMap.get(forwarder)?.push(shipment);
    }
  });
  
  // Calculate performance metrics for each forwarder
  const forwarderPerformance = Array.from(forwarderMap.entries()).map(([name, shipments]) => {
    const totalShipments = shipments.length;
    
    // Calculate average transit days
    const completedShipments = shipments.filter(s => 
      s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
    );
    
    const transitTimes = completedShipments.map(s => {
      const collectionDate = new Date(s.date_of_collection);
      const arrivalDate = new Date(s.date_of_arrival_destination || '');
      return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
    });
    
    const avgTransitDays = transitTimes.length > 0 
      ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
      : 0;
    
    // Calculate on-time rate
    const onTimeRate = completedShipments.length / Math.max(totalShipments, 1);
    
    // Calculate reliability score
    const reliabilityScore = (onTimeRate + (completedShipments.length / Math.max(totalShipments, 1))) / 2;
    
    return {
      name,
      totalShipments,
      avgCostPerKg: calculateAvgCostPerKg(shipments),
      avgTransitDays,
      onTimeRate,
      reliabilityScore
    };
  });
  
  // Normalize weights
  const totalWeight = weights.cost + weights.time + weights.reliability;
  const normalizedWeights = {
    cost: weights.cost / totalWeight,
    time: weights.time / totalWeight,
    reliability: weights.reliability / totalWeight
  };
  
  // Construct decision matrix
  const decisionMatrix = forwarderPerformance.map(forwarder => {
    // Lower cost is better, so invert it for scoring
    const costScore = forwarder.avgCostPerKg > 0 
      ? 1 / forwarder.avgCostPerKg 
      : 1;
    
    // Lower transit time is better, so invert it for scoring
    const timeScore = forwarder.avgTransitDays > 0 
      ? 1 / forwarder.avgTransitDays 
      : 1;
    
    // Higher reliability is better
    const reliabilityScore = forwarder.reliabilityScore;
    
    return {
      forwarder: forwarder.name,
      criteria: {
        cost: costScore,
        time: timeScore,
        reliability: reliabilityScore
      }
    };
  });
  
  // Apply TOPSIS method to calculate rankings
  const rankings = applyTOPSIS(decisionMatrix, normalizedWeights, forwarderPerformance);
  
  // Trace the output for debugging
  traceCalculation('computeForwarderRankings', 
    { shipmentData, weights }, 
    rankings
  );
  
  return rankings;
}

/**
 * Calculate average cost per kg for a set of shipments
 * @param shipments Array of shipments
 * @returns Average cost per kg
 */
function calculateAvgCostPerKg(shipments: Shipment[]): number {
  const shipmentCosts = shipments.filter(s => {
    const forwarderName = s.final_quote_awarded_freight_forwader_Carrier?.toLowerCase();
    return forwarderName && s.forwarder_quotes && s.forwarder_quotes[forwarderName];
  }).map(s => {
    const forwarderName = s.final_quote_awarded_freight_forwader_Carrier?.toLowerCase() || '';
    return {
      cost: s.forwarder_quotes ? s.forwarder_quotes[forwarderName] : 0,
      weight: typeof s.weight_kg === 'string' ? parseFloat(s.weight_kg) : (s.weight_kg || 0)
    };
  });
  
  if (shipmentCosts.length === 0) return 0;
  
  const totalCost = shipmentCosts.reduce((sum, item) => {
    const cost = typeof item.cost === 'string' ? parseFloat(item.cost) : (item.cost || 0);
    return sum + cost;
  }, 0);
  
  const totalWeight = shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
  
  return totalWeight > 0 ? totalCost / totalWeight : 0;
}

/**
 * Apply the TOPSIS method to rank alternatives
 */
function applyTOPSIS(
  decisionMatrix: Array<{
    forwarder: string;
    criteria: {
      cost: number;
      time: number;
      reliability: number;
    };
  }>,
  weights: CriteriaWeights,
  forwarderPerformance: Array<{
    name: string;
    totalShipments: number;
    avgCostPerKg: number;
    avgTransitDays: number;
    onTimeRate: number;
    reliabilityScore: number;
  }>
): Recommendation[] {
  // Get criteria keys
  const criteriaKeys: (keyof CriteriaWeights)[] = ['cost', 'time', 'reliability'];
  
  // Create normalized decision matrix
  const normalizedMatrix = decisionMatrix.map(alternative => {
    const normalizedCriteria: Record<string, number> = {};
    
    criteriaKeys.forEach(criterion => {
      const values = decisionMatrix.map(alt => alt.criteria[criterion]);
      const sumOfSquares = values.reduce((sum, val) => sum + val * val, 0);
      const normalizationFactor = Math.sqrt(sumOfSquares);
      
      normalizedCriteria[criterion] = normalizationFactor > 0 
        ? alternative.criteria[criterion] / normalizationFactor 
        : 0;
    });
    
    return {
      forwarder: alternative.forwarder,
      normalizedCriteria
    };
  });
  
  // Calculate weighted normalized decision matrix
  const weightedMatrix = normalizedMatrix.map(alternative => {
    const weightedCriteria: Record<string, number> = {};
    
    criteriaKeys.forEach(criterion => {
      weightedCriteria[criterion] = alternative.normalizedCriteria[criterion] * weights[criterion];
    });
    
    return {
      forwarder: alternative.forwarder,
      weightedCriteria
    };
  });
  
  // Find ideal and negative-ideal solutions
  const idealSolution: Record<string, number> = {};
  const negativeIdealSolution: Record<string, number> = {};
  
  criteriaKeys.forEach(criterion => {
    const values = weightedMatrix.map(alt => alt.weightedCriteria[criterion]);
    idealSolution[criterion] = Math.max(...values);
    negativeIdealSolution[criterion] = Math.min(...values);
  });
  
  // Calculate separation measures
  const separationMeasures = weightedMatrix.map(alternative => {
    // Distance to ideal solution
    let idealDistance = 0;
    let negativeIdealDistance = 0;
    
    criteriaKeys.forEach(criterion => {
      const value = alternative.weightedCriteria[criterion];
      idealDistance += Math.pow(value - idealSolution[criterion], 2);
      negativeIdealDistance += Math.pow(value - negativeIdealSolution[criterion], 2);
    });
    
    idealDistance = Math.sqrt(idealDistance);
    negativeIdealDistance = Math.sqrt(negativeIdealDistance);
    
    // Calculate relative closeness to ideal solution
    const closeness = negativeIdealDistance / (idealDistance + negativeIdealDistance);
    
    return {
      forwarder: alternative.forwarder,
      idealDistance,
      negativeIdealDistance,
      closeness
    };
  });
  
  // Calculate final scores and prepare recommendations
  const rankings = forwarderPerformance.map((forwarder, index) => {
    const separationMeasure = separationMeasures.find(s => s.forwarder === forwarder.name) || {
      forwarder: forwarder.name,
      idealDistance: 0,
      negativeIdealDistance: 0,
      closeness: 0
    };
    
    return {
      forwarder: forwarder.name,
      score: separationMeasure.closeness,
      closeness: separationMeasure.closeness,
      costPerformance: decisionMatrix[index]?.criteria.cost || 0,
      timePerformance: decisionMatrix[index]?.criteria.time || 0,
      reliabilityPerformance: decisionMatrix[index]?.criteria.reliability || 0,
      modelVersion: 'unified-v1.0',
      computedAt: new Date().toISOString()
    };
  });
  
  return rankings.sort((a, b) => b.score - a.score);
}
