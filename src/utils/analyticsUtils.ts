
import { format, parseISO, differenceInDays, addMonths, startOfMonth, isValid } from 'date-fns';
import { Shipment, ForwarderPerformance, CountryPerformance, ShipmentMetrics, CarrierPerformance } from '@/core/base_engine/types/deeptrack';
import { safelyAddRandomOffset, safelyAddNumber } from '@/core/base_engine/ts/engine';

/**
 * Calculate monthly shipment trend from raw shipment data
 */
export function calculateMonthlyShipmentTrend(
  shipments: Shipment[]
): Array<{ month: string; count: number }> {
  // Get the date range
  let minDate: Date | null = null;
  let maxDate: Date | null = null;
  
  // Extract valid dates from shipment data
  const validDates: Date[] = shipments
    .map(s => {
      try {
        const date = parseISO(s.date_of_collection);
        return isValid(date) ? date : null;
      } catch (e) {
        return null;
      }
    })
    .filter((date): date is Date => date !== null);
  
  if (validDates.length === 0) {
    // If no valid dates, return empty trend
    return [];
  }
  
  // Find min and max dates
  minDate = new Date(Math.min(...validDates.map(d => d.getTime())));
  maxDate = new Date(Math.max(...validDates.map(d => d.getTime())));
  
  // Generate monthly buckets between min and max date
  const months: { [key: string]: number } = {};
  let currentMonth = startOfMonth(minDate);
  
  while (currentMonth <= maxDate) {
    const monthKey = format(currentMonth, 'MMM yyyy');
    months[monthKey] = 0;
    currentMonth = addMonths(currentMonth, 1);
  }
  
  // Count shipments per month
  shipments.forEach(shipment => {
    try {
      const date = parseISO(shipment.date_of_collection);
      if (isValid(date)) {
        const monthKey = format(date, 'MMM yyyy');
        if (months[monthKey] !== undefined) {
          months[monthKey]++;
        }
      }
    } catch (e) {
      // Skip invalid dates
    }
  });
  
  // Convert to array and sort chronologically
  return Object.entries(months)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const aDate = parseISO(`01 ${a.month}`);
      const bDate = parseISO(`01 ${b.month}`);
      return aDate.getTime() - bDate.getTime();
    });
}

/**
 * Calculate core shipment metrics from raw shipment data
 */
export function calculateShipmentMetrics(shipments: Shipment[]): ShipmentMetrics {
  // Basic counts
  const totalShipments = shipments.length;
  
  // Mode of shipment distribution
  const shipmentsByMode: Record<string, number> = {};
  shipments.forEach(shipment => {
    const mode = shipment.mode_of_shipment?.toLowerCase() || 'unknown';
    shipmentsByMode[mode] = (shipmentsByMode[mode] || 0) + 1;
  });
  
  // Status counts
  const statusCounts = {
    active: 0,
    completed: 0,
    failed: 0,
    onTime: 0,
    inTransit: 0,
    delayed: 0,
    pending: 0,
    cancelled: 0
  };
  
  // Calculate transitTimes and on-time vs. delayed
  let totalTransitDays = 0;
  let totalValidTransitRecords = 0;
  let onTime = 0;
  let delayed = 0;
  
  shipments.forEach(shipment => {
    // Status tracking
    const status = shipment.delivery_status?.toLowerCase() || 'unknown';
    
    if (status === 'delivered' || status === 'completed') {
      statusCounts.completed++;
    } else if (status === 'failed' || status === 'cancelled') {
      statusCounts.failed++;
      if (status === 'cancelled') statusCounts.cancelled++;
    } else if (status === 'delayed') {
      statusCounts.delayed++;
      delayed++;
      statusCounts.active++;
    } else if (status === 'intransit' || status === 'in transit' || status === 'in-transit') {
      statusCounts.inTransit++;
      statusCounts.active++;
    } else if (status === 'pending') {
      statusCounts.pending++;
      statusCounts.active++;
    } else {
      statusCounts.active++;
    }
    
    // Transit time calculation
    try {
      if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
        const startDate = parseISO(shipment.date_of_collection);
        const endDate = parseISO(shipment.date_of_arrival_destination);
        
        if (isValid(startDate) && isValid(endDate)) {
          const transitDays = differenceInDays(endDate, startDate);
          
          if (transitDays >= 0) {
            totalTransitDays += transitDays;
            totalValidTransitRecords++;
            
            // Determine if on-time or delayed (simple heuristic)
            const expectedTransitTime = shipment.mode_of_shipment === 'air' ? 3 : 
                                       shipment.mode_of_shipment === 'road' ? 5 : 14;
                                       
            if (transitDays <= expectedTransitTime) {
              onTime++;
            } else {
              delayed++;
            }
          }
        }
      }
    } catch (e) {
      // Skip invalid dates
    }
  });
  
  // Calculate cost metrics
  let totalWeightKg = 0;
  let totalVolumeCbm = 0;
  let totalCost = 0;
  let validCostRecords = 0;
  
  shipments.forEach(shipment => {
    // Weight calculation
    const weightKg = typeof shipment.weight_kg === 'string' ? 
      parseFloat(shipment.weight_kg) : shipment.weight_kg;
    
    if (!isNaN(weightKg) && weightKg > 0) {
      totalWeightKg += weightKg;
    }
    
    // Volume calculation
    const volumeCbm = typeof shipment.volume_cbm === 'string' ? 
      parseFloat(shipment.volume_cbm) : shipment.volume_cbm;
    
    if (!isNaN(volumeCbm) && volumeCbm > 0) {
      totalVolumeCbm += volumeCbm;
    }
    
    // Cost calculation from forwarder quotes
    if (shipment.forwarder_quotes) {
      const quotes = Object.values(shipment.forwarder_quotes)
        .filter(quote => typeof quote === 'number' && quote > 0);
      
      if (quotes.length > 0) {
        // Use the minimum quote as the effective cost
        const minQuote = Math.min(...quotes);
        totalCost += minQuote;
        validCostRecords++;
      }
    }
  });
  
  // Calculate average metrics
  const avgTransitTime = totalValidTransitRecords > 0 ? 
    totalTransitDays / totalValidTransitRecords : 0;
  
  const avgCostPerKg = (totalWeightKg > 0 && validCostRecords > 0) ? 
    totalCost / totalWeightKg : 0;
  
  // Generate monthly trend
  const monthlyTrend = calculateMonthlyShipmentTrend(shipments);
  
  // Calculate a simulated disruption probability score
  const disruptionProbabilityScore = 0.2 + (Math.random() * 0.3);
  
  // Calculate a simulated resilience score
  const resilienceScore = Math.max(0.3, Math.min(1, 0.7 + (Math.random() * 0.5) - (disruptionProbabilityScore * 0.3)));
  
  // No-quote ratio (shipments without any quotes)
  const shipmentsWithoutQuotes = shipments.filter(s => 
    !s.forwarder_quotes || 
    Object.values(s.forwarder_quotes).filter(q => q && q > 0).length === 0
  ).length;
  
  const noQuoteRatio = totalShipments > 0 ? shipmentsWithoutQuotes / totalShipments : 0;
  
  return {
    totalShipments,
    shipmentsByMode,
    monthlyTrend,
    delayedVsOnTimeRate: { onTime, delayed },
    avgTransitTime,
    disruptionProbabilityScore,
    shipmentStatusCounts: statusCounts,
    resilienceScore,
    noQuoteRatio,
    totalWeight: totalWeightKg,
    totalVolume: totalVolumeCbm,
    totalCost,
    avgCostPerKg,
    // Additional properties for the UI
    forwarderPerformance: {},
    topForwarder: "DHL Express",
    carrierCount: 8,
    topCarrier: "Kenya Airways"
  };
}

/**
 * Calculate performance metrics for each forwarder
 */
export function calculateForwarderPerformance(shipments: Shipment[]): ForwarderPerformance[] {
  // Group shipments by forwarder
  const forwarderShipments: Record<string, Shipment[]> = {};
  const forwarderQuoteWins: Record<string, number> = {};
  const forwarderQuoteOpportunities: Record<string, number> = {};
  
  // Track unique forwarders from both awarded shipments and quotes
  const uniqueForwarders = new Set<string>();
  
  shipments.forEach(shipment => {
    // Track awarded shipments
    if (shipment.freight_carrier) {
      const forwarder = shipment.freight_carrier.toString();
      uniqueForwarders.add(forwarder);
      
      if (!forwarderShipments[forwarder]) {
        forwarderShipments[forwarder] = [];
      }
      forwarderShipments[forwarder].push(shipment);
      
      // Track quote wins
      forwarderQuoteWins[forwarder] = (forwarderQuoteWins[forwarder] || 0) + 1;
    }
    
    // Track all quote opportunities
    if (shipment.forwarder_quotes) {
      Object.entries(shipment.forwarder_quotes).forEach(([forwarder, quote]) => {
        if (quote && quote > 0) {
          uniqueForwarders.add(forwarder);
          forwarderQuoteOpportunities[forwarder] = (forwarderQuoteOpportunities[forwarder] || 0) + 1;
        }
      });
    }
  });
  
  // Calculate performance metrics for each forwarder
  return Array.from(uniqueForwarders).map(forwarder => {
    const forwarderData = forwarderShipments[forwarder] || [];
    const totalShipments = forwarderData.length;
    
    // Calculate transit days
    let totalTransitDays = 0;
    let validTransitRecords = 0;
    
    forwarderData.forEach(shipment => {
      try {
        if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
          const startDate = parseISO(shipment.date_of_collection);
          const endDate = parseISO(shipment.date_of_arrival_destination);
          
          if (isValid(startDate) && isValid(endDate)) {
            const transitDays = differenceInDays(endDate, startDate);
            if (transitDays >= 0) {
              totalTransitDays += transitDays;
              validTransitRecords++;
            }
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    // Calculate on-time performance
    let onTimeCount = 0;
    forwarderData.forEach(shipment => {
      try {
        if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
          const startDate = parseISO(shipment.date_of_collection);
          const endDate = parseISO(shipment.date_of_arrival_destination);
          
          if (isValid(startDate) && isValid(endDate)) {
            const transitDays = differenceInDays(endDate, startDate);
            const expectedTransitTime = shipment.mode_of_shipment === 'air' ? 3 : 
                                      shipment.mode_of_shipment === 'road' ? 5 : 14;
                                      
            if (transitDays <= expectedTransitTime) {
              onTimeCount++;
            }
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    // Calculate cost performance
    let totalCost = 0;
    let totalWeight = 0;
    
    forwarderData.forEach(shipment => {
      // Use the awarded quote for this forwarder
      if (shipment.forwarder_quotes && shipment.forwarder_quotes[forwarder]) {
        const cost = shipment.forwarder_quotes[forwarder];
        if (cost > 0) {
          totalCost += cost;
        }
      }
      
      // Add weight
      const weightKg = typeof shipment.weight_kg === 'string' ? 
        parseFloat(shipment.weight_kg) : shipment.weight_kg;
      
      if (!isNaN(weightKg) && weightKg > 0) {
        totalWeight += weightKg;
      }
    });
    
    const avgTransitDays = validTransitRecords > 0 ? totalTransitDays / validTransitRecords : 0;
    const onTimeRate = totalShipments > 0 ? onTimeCount / totalShipments : 0;
    const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;
    
    // Calculate quote win rate
    const opportunities = forwarderQuoteOpportunities[forwarder] || 0;
    const wins = forwarderQuoteWins[forwarder] || 0;
    const quoteWinRate = opportunities > 0 ? wins / opportunities : 0;
    
    // Calculate simulated scores
    const reliabilityScore = Math.min(1, Math.max(0.5, onTimeRate * 0.7 + Math.random() * 0.3));
    const costScore = avgCostPerKg > 0 ? 
      Math.min(1, Math.max(0.5, 1 - (avgCostPerKg / 100))) : 0.5;
    const timeScore = avgTransitDays > 0 ? 
      Math.min(1, Math.max(0.5, 1 - (avgTransitDays / 14))) : 0.5;
    
    // Calculate DeepScore (weighted average of reliability, cost, time)
    const deepScore = (reliabilityScore * 0.4) + (costScore * 0.3) + (timeScore * 0.3);
    
    return {
      name: forwarder,
      totalShipments,
      avgCostPerKg,
      avgTransitDays,
      onTimeRate,
      reliabilityScore,
      deepScore,
      costScore,
      timeScore,
      quoteWinRate
    };
  });
}

/**
 * Calculate performance metrics for carriers
 */
export function calculateCarrierPerformance(shipments: Shipment[]): CarrierPerformance[] {
  // Group shipments by carrier
  const carrierShipments: Record<string, Shipment[]> = {};
  
  // Track unique carriers
  const uniqueCarriers = new Set<string>();
  
  shipments.forEach(shipment => {
    // Track carrier shipments
    const carrier = (shipment.carrier || shipment.freight_carrier || 'Unknown').toString();
    uniqueCarriers.add(carrier);
    
    if (!carrierShipments[carrier]) {
      carrierShipments[carrier] = [];
    }
    carrierShipments[carrier].push(shipment);
  });
  
  // Calculate performance metrics for each carrier
  return Array.from(uniqueCarriers).map(carrier => {
    const carrierData = carrierShipments[carrier] || [];
    const totalShipments = carrierData.length;
    
    // Calculate transit days
    let totalTransitDays = 0;
    let validTransitRecords = 0;
    
    carrierData.forEach(shipment => {
      try {
        if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
          const startDate = parseISO(shipment.date_of_collection);
          const endDate = parseISO(shipment.date_of_arrival_destination);
          
          if (isValid(startDate) && isValid(endDate)) {
            const transitDays = differenceInDays(endDate, startDate);
            if (transitDays >= 0) {
              totalTransitDays += transitDays;
              validTransitRecords++;
            }
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    // Calculate on-time performance
    let onTimeCount = 0;
    carrierData.forEach(shipment => {
      try {
        if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
          const startDate = parseISO(shipment.date_of_collection);
          const endDate = parseISO(shipment.date_of_arrival_destination);
          
          if (isValid(startDate) && isValid(endDate)) {
            const transitDays = differenceInDays(endDate, startDate);
            const expectedTransitTime = shipment.mode_of_shipment === 'air' ? 3 : 
                                      shipment.mode_of_shipment === 'road' ? 5 : 14;
                                      
            if (transitDays <= expectedTransitTime) {
              onTimeCount++;
            }
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    // Calculate cost performance
    let totalCost = 0;
    let totalWeight = 0;
    
    carrierData.forEach(shipment => {
      // Use any cost data available
      if (shipment.forwarder_quotes) {
        const quotes = Object.values(shipment.forwarder_quotes)
          .filter(quote => typeof quote === 'number' && quote > 0);
        
        if (quotes.length > 0) {
          // Use the average quote
          const avgQuote = quotes.reduce((sum, q) => sum + q, 0) / quotes.length;
          totalCost += avgQuote;
        }
      }
      
      // Add weight
      const weightKg = typeof shipment.weight_kg === 'string' ? 
        parseFloat(shipment.weight_kg) : shipment.weight_kg;
      
      if (!isNaN(weightKg) && weightKg > 0) {
        totalWeight += weightKg;
      }
    });
    
    const avgTransitDays = validTransitRecords > 0 ? totalTransitDays / validTransitRecords : 0;
    const onTimeRate = totalShipments > 0 ? onTimeCount / totalShipments : 0;
    const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;
    
    // Calculate simulated scores
    const reliabilityScore = Math.min(1, Math.max(0.5, onTimeRate * 0.7 + Math.random() * 0.3));
    
    // Additional metrics for carriers
    const serviceScore = 0.6 + (Math.random() * 0.4);
    const punctualityScore = 0.5 + (Math.random() * 0.5);
    const handlingScore = 0.7 + (Math.random() * 0.3);
    
    // Calculate DeepScore
    const deepScore = (reliabilityScore * 0.3) + (serviceScore * 0.3) + 
                     (punctualityScore * 0.2) + (handlingScore * 0.2);
    
    return {
      name: carrier,
      totalShipments,
      avgCostPerKg,
      avgTransitDays,
      onTimeRate,
      reliabilityScore,
      deepScore,
      shipments: totalShipments,
      reliability: reliabilityScore,
      // Additional metrics for UI display
      serviceScore,
      punctualityScore,
      handlingScore
    };
  });
}

/**
 * Calculate performance metrics for countries
 */
export function calculateCountryPerformance(shipments: Shipment[]): CountryPerformance[] {
  // Group shipments by country
  const countryShipments: Record<string, Shipment[]> = {};
  
  // Track unique countries (both origin and destination)
  const uniqueCountries = new Set<string>();
  
  shipments.forEach(shipment => {
    // Track origin countries
    if (shipment.origin_country) {
      uniqueCountries.add(shipment.origin_country);
      
      if (!countryShipments[shipment.origin_country]) {
        countryShipments[shipment.origin_country] = [];
      }
      countryShipments[shipment.origin_country].push(shipment);
    }
    
    // Track destination countries
    if (shipment.destination_country) {
      uniqueCountries.add(shipment.destination_country);
      
      if (!countryShipments[shipment.destination_country]) {
        countryShipments[shipment.destination_country] = [];
      }
      countryShipments[shipment.destination_country].push(shipment);
    }
  });
  
  // Calculate performance metrics for each country
  return Array.from(uniqueCountries).map(country => {
    const countryData = countryShipments[country] || [];
    const totalShipments = countryData.length;
    
    // Calculate transit metrics
    let totalTransitDays = 0;
    let validTransitRecords = 0;
    let delayedShipments = 0;
    let totalDelayDays = 0;
    
    countryData.forEach(shipment => {
      try {
        if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
          const startDate = parseISO(shipment.date_of_collection);
          const endDate = parseISO(shipment.date_of_arrival_destination);
          
          if (isValid(startDate) && isValid(endDate)) {
            const transitDays = differenceInDays(endDate, startDate);
            
            if (transitDays >= 0) {
              totalTransitDays += transitDays;
              validTransitRecords++;
              
              // Check if delayed
              const expectedTransitTime = shipment.mode_of_shipment === 'air' ? 3 : 
                                        shipment.mode_of_shipment === 'road' ? 5 : 14;
                                        
              if (transitDays > expectedTransitTime) {
                delayedShipments++;
                totalDelayDays += (transitDays - expectedTransitTime);
              }
            }
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    // Calculate cost performance
    let totalCostPerRoute = 0;
    let validCostRecords = 0;
    let totalWeight = 0;
    let totalVolume = 0;
    let totalCost = 0;
    
    countryData.forEach(shipment => {
      // Cost calculations
      if (shipment.forwarder_quotes) {
        const quotes = Object.values(shipment.forwarder_quotes)
          .filter(quote => typeof quote === 'number' && quote > 0);
        
        if (quotes.length > 0) {
          // Use the minimum quote as the effective cost
          const minQuote = Math.min(...quotes);
          totalCostPerRoute += minQuote;
          totalCost += minQuote;
          validCostRecords++;
        }
      }
      
      // Weight calculations
      const weightKg = typeof shipment.weight_kg === 'string' ? 
        parseFloat(shipment.weight_kg) : shipment.weight_kg;
      
      if (!isNaN(weightKg) && weightKg > 0) {
        totalWeight += weightKg;
      }
      
      // Volume calculations
      const volumeCbm = typeof shipment.volume_cbm === 'string' ? 
        parseFloat(shipment.volume_cbm) : shipment.volume_cbm;
      
      if (!isNaN(volumeCbm) && volumeCbm > 0) {
        totalVolume += volumeCbm;
      }
    });
    
    // Calculate averages
    const avgTransitDays = validTransitRecords > 0 ? totalTransitDays / validTransitRecords : 0;
    const avgCostPerRoute = validCostRecords > 0 ? totalCostPerRoute / validCostRecords : 0;
    const deliveryFailureRate = totalShipments > 0 ? delayedShipments / totalShipments : 0;
    const avgDelayDays = delayedShipments > 0 ? totalDelayDays / delayedShipments : 0;
    
    // Calculate simulated metrics
    const avgCustomsClearanceTime = Math.random() * 2 + 0.5; // 0.5 to 2.5 days
    const borderDelayIncidents = Math.floor(Math.random() * (totalShipments * 0.2));
    const resilienceIndex = Math.min(1, Math.max(0.3, 0.8 - (deliveryFailureRate * 0.5) + (Math.random() * 0.2)));
    
    // Calculate preferred mode (just pick the most common one)
    const modeCounts: Record<string, number> = {};
    countryData.forEach(shipment => {
      if (shipment.mode_of_shipment) {
        const mode = shipment.mode_of_shipment.toLowerCase();
        modeCounts[mode] = (modeCounts[mode] || 0) + 1;
      }
    });
    
    // Find the mode with the highest count
    const preferredMode = Object.entries(modeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([mode]) => mode)[0] || 'air';
    
    // Get top forwarders for this country
    const forwarderCounts: Record<string, number> = {};
    countryData.forEach(shipment => {
      if (shipment.freight_carrier) {
        const forwarder = shipment.freight_carrier.toString();
        forwarderCounts[forwarder] = (forwarderCounts[forwarder] || 0) + 1;
      }
    });
    
    // Get top 3 forwarders
    const topForwarders = Object.entries(forwarderCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([forwarder]) => forwarder);
    
    return {
      country,
      totalShipments,
      avgCostPerRoute,
      avgCustomsClearanceTime,
      deliveryFailureRate,
      borderDelayIncidents,
      resilienceIndex,
      preferredMode,
      topForwarders,
      // Additional metrics for UI
      reliabilityScore: 1 - deliveryFailureRate,
      avgTransitDays,
      deliverySuccessRate: 1 - deliveryFailureRate,
      totalWeight,
      totalVolume,
      totalCost,
      avgDelayDays
    };
  });
}
