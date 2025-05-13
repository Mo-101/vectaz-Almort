import { CountryPerformance, Shipment, ShipmentMetrics, ForwarderPerformance, CarrierPerformance, WarehousePerformance } from '@/types/deeptrack';

// Utility function to safely parse numbers
const parseNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return value;
};

// Utility function to safely parse dates
const parseDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;
  try {
    return new Date(dateString);
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
};

// Utility function to calculate the difference between two dates in days
const diffInDays = (date1: Date, date2: Date): number => {
  const diff = date1.getTime() - date2.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
};

// Utility function to get the month from a date
const getMonth = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

// Utility function to calculate the average of an array of numbers
const calculateAverage = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
};

// Utility function to calculate the mode of an array
const calculateMode = (arr: any[]): any => {
  if (arr.length === 0) return null;

  const modeMap: { [key: string]: number } = {};
  let maxEl = arr[0], maxCount = 1;

  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (modeMap[el]) {
      modeMap[el]++;
    } else {
      modeMap[el] = 1;
    }

    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }

  return maxEl;
};

// Utility function to calculate the median of an array
const calculateMedian = (arr: number[]): number => {
  if (arr.length === 0) return 0;

  const sortedArr = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sortedArr.length / 2);

  if (sortedArr.length % 2 === 0) {
    return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
  } else {
    return sortedArr[mid];
  }
};

// Utility function to calculate the total weight and volume
const calculateTotalWeightAndVolume = (shipments: Shipment[]): { totalWeight: number; totalVolume: number } => {
  let totalWeight = 0;
  let totalVolume = 0;

  shipments.forEach(shipment => {
    totalWeight += typeof shipment.weight_kg === 'string' ? parseFloat(shipment.weight_kg) : shipment.weight_kg as number;
    totalVolume += typeof shipment.volume_cbm === 'string' ? parseFloat(shipment.volume_cbm) : shipment.volume_cbm as number;
  });

  return { totalWeight, totalVolume };
};

// Utility function to calculate the total cost of shipments
const calculateTotalCost = (shipments: Shipment[]): number => {
  let totalCost = 0;

  shipments.forEach(shipment => {
    if (shipment.forwarder_quotes) {
      Object.values(shipment.forwarder_quotes).forEach(cost => {
        totalCost += Number(cost);
      });
    }
  });

  return totalCost;
};

// Utility function to calculate the average delay days
const calculateAvgDelayDays = (shipments: Shipment[]): number => {
  let totalDelayDays = 0;
  let delayedShipments = 0;

  shipments.forEach(shipment => {
    const arrivalDate = parseDate(shipment.date_of_arrival_destination);
    const collectionDate = parseDate(shipment.date_of_collection);

    if (arrivalDate && collectionDate) {
      const delay = diffInDays(arrivalDate, collectionDate);
      if (delay > 0) {
        totalDelayDays += delay;
        delayedShipments++;
      }
    }
  });

  return delayedShipments > 0 ? totalDelayDays / delayedShipments : 0;
};

// Utility function to calculate the shipment mode split
const calculateShipmentModeSplit = (shipments: Shipment[]): Record<string, number> => {
  const modeCounts: Record<string, number> = {};

  shipments.forEach(shipment => {
    const mode = shipment.mode_of_shipment || 'unknown';
    modeCounts[mode] = (modeCounts[mode] || 0) + 1;
  });

  return modeCounts;
};

// Utility function to calculate the monthly shipment trend
const calculateMonthlyShipmentTrend = (shipments: Shipment[]): Array<{ month: string; count: number }> => {
  const monthlyCounts: Record<string, number> = {};

  shipments.forEach(shipment => {
    const collectionDate = parseDate(shipment.date_of_collection);
    if (collectionDate) {
      const month = getMonth(collectionDate);
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    }
  });

  return Object.entries(monthlyCounts).map(([month, count]) => ({ month, count }));
};

// Utility function to calculate the delayed vs on-time rate
const calculateDelayedVsOnTimeRate = (shipments: Shipment[]): { onTime: number; delayed: number } => {
  let onTimeCount = 0;
  let delayedCount = 0;

  shipments.forEach(shipment => {
    const arrivalDate = parseDate(shipment.date_of_arrival_destination);
    const collectionDate = parseDate(shipment.date_of_collection);

    if (arrivalDate && collectionDate) {
      const delay = diffInDays(arrivalDate, collectionDate);
      if (delay > 0) {
        delayedCount++;
      } else {
        onTimeCount++;
      }
    } else {
      onTimeCount++; // Consider shipments without arrival dates as on-time
    }
  });

  const total = onTimeCount + delayedCount;
  const onTime = total > 0 ? (onTimeCount / total) * 100 : 0;
  const delayed = total > 0 ? (delayedCount / total) * 100 : 0;

  return { onTime, delayed };
};

// Utility function to calculate the average transit time
const calculateAvgTransitTime = (shipments: Shipment[]): number => {
  let totalTransitTime = 0;
  let validShipments = 0;

  shipments.forEach(shipment => {
    const arrivalDate = parseDate(shipment.date_of_arrival_destination);
    const collectionDate = parseDate(shipment.date_of_collection);

    if (arrivalDate && collectionDate) {
      const transitTime = diffInDays(arrivalDate, collectionDate);
      totalTransitTime += transitTime;
      validShipments++;
    }
  });

  return validShipments > 0 ? totalTransitTime / validShipments : 0;
};

// Utility function to calculate the disruption probability score
const calculateDisruptionProbabilityScore = (shipments: Shipment[]): number => {
  // This is a placeholder - implement actual calculation based on your data
  return Math.random() * 100;
};

// Utility function to calculate the shipment status counts
const calculateShipmentStatusCounts = (shipments: Shipment[]): { active: number; completed: number; failed: number; onTime?: number; inTransit?: number; delayed?: number; cancelled?: number; pending?: number } => {
  let active = 0;
  let completed = 0;
  let failed = 0;
  let onTime = 0;
  let inTransit = 0;
  let delayed = 0;
  let cancelled = 0;
  let pending = 0;

  shipments.forEach(shipment => {
    switch (shipment.delivery_status) {
      case 'active':
        active++;
        break;
      case 'completed':
        completed++;
        break;
      case 'failed':
        failed++;
        break;
      case 'onTime':
        onTime++;
        break;
      case 'inTransit':
        inTransit++;
        break;
      case 'delayed':
        delayed++;
        break;
      case 'cancelled':
        cancelled++;
        break;
      case 'pending':
        pending++;
        break;
      default:
        active++; // Consider unknown statuses as active
        break;
    }
  });

  return { active, completed, failed, onTime, inTransit, delayed, cancelled, pending };
};

// Utility function to calculate the resilience score
const calculateResilienceScore = (shipments: Shipment[]): number => {
  // This is a placeholder - implement actual calculation based on your data
  return Math.random() * 100;
};

// Utility function to calculate the no quote ratio
const calculateNoQuoteRatio = (shipments: Shipment[]): number => {
  // This is a placeholder - implement actual calculation based on your data
  return Math.random() * 100;
};

// Utility function to calculate forwarder performance
export const calculateForwarderPerformance = (shipments: Shipment[]): ForwarderPerformance[] => {
  // Group shipments by forwarder
  const forwarderMap: Record<string, Shipment[]> = {};

  shipments.forEach(shipment => {
    if (shipment.freight_carrier) {
      if (!forwarderMap[shipment.freight_carrier]) {
        forwarderMap[shipment.freight_carrier] = [];
      }
      forwarderMap[shipment.freight_carrier].push(shipment);
    }
  });

  // Calculate performance metrics for each forwarder
  return Object.entries(forwarderMap).map(([name, forwarderShipments]) => {
    const totalShipments = forwarderShipments.length;
    
    // Calculate average cost per kg
    let totalWeight = 0;
    let totalCost = 0;
    forwarderShipments.forEach(shipment => {
      const weight = parseNumber(shipment.weight_kg);
      totalWeight += weight;
      
      // Sum up costs from forwarder_quotes if available
      if (shipment.forwarder_quotes && shipment.forwarder_quotes[name.toLowerCase()]) {
        totalCost += Number(shipment.forwarder_quotes[name.toLowerCase()]);
      }
    });
    
    const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;
    
    // Calculate transit days and on-time rate
    let totalTransitDays = 0;
    let onTimeDeliveries = 0;
    
    forwarderShipments.forEach(shipment => {
      const arrivalDate = parseDate(shipment.date_of_arrival_destination);
      const collectionDate = parseDate(shipment.date_of_collection);
      
      if (arrivalDate && collectionDate) {
        totalTransitDays += diffInDays(arrivalDate, collectionDate);
        
        // Consider on-time based on delivery status
        if (shipment.delivery_status === 'completed' || 
            shipment.delivery_status === 'onTime' ||
            shipment.delivery_status === 'Delivered') {
          onTimeDeliveries++;
        }
      }
    });
    
    const avgTransitDays = totalShipments > 0 ? totalTransitDays / totalShipments : 0;
    const onTimeRate = totalShipments > 0 ? (onTimeDeliveries / totalShipments) * 100 : 0;
    
    // Calculate reliability score (combination of on-time rate and other factors)
    const reliabilityScore = onTimeRate / 100; // Simple placeholder calculation
    
    return {
      name,
      totalShipments,
      avgCostPerKg,
      avgTransitDays,
      onTimeRate,
      reliabilityScore,
      // Add other metrics as needed
      timeScore: reliabilityScore * 0.8,
      costScore: reliabilityScore * 0.7,
      quoteWinRate: Math.random() * 100,
      serviceScore: reliabilityScore * 0.9,
      punctualityScore: onTimeRate / 100,
      handlingScore: Math.random(),
      deepScore: reliabilityScore * 0.85
    };
  });
};

// Utility function to calculate carrier performance
export const calculateCarrierPerformance = (shipments: Shipment[]): CarrierPerformance[] => {
  // Group shipments by carrier
  const carrierMap: Record<string, Shipment[]> = {};

  shipments.forEach(shipment => {
    if (shipment.carrier) {
      if (!carrierMap[shipment.carrier]) {
        carrierMap[shipment.carrier] = [];
      }
      carrierMap[shipment.carrier].push(shipment);
    }
  });

  // Calculate performance metrics for each carrier
  return Object.entries(carrierMap).map(([name, carrierShipments]) => {
    const totalShipments = carrierShipments.length;
    
    // Calculate transit days and on-time rate
    let totalTransitDays = 0;
    let onTimeDeliveries = 0;
    
    carrierShipments.forEach(shipment => {
      const arrivalDate = parseDate(shipment.date_of_arrival_destination);
      const collectionDate = parseDate(shipment.date_of_collection);
      
      if (arrivalDate && collectionDate) {
        totalTransitDays += diffInDays(arrivalDate, collectionDate);
        
        // Consider on-time based on delivery status
        if (shipment.delivery_status === 'completed' || 
            shipment.delivery_status === 'onTime' ||
            shipment.delivery_status === 'Delivered') {
          onTimeDeliveries++;
        }
      }
    });
    
    const avgTransitDays = totalShipments > 0 ? totalTransitDays / totalShipments : 0;
    const onTimeRate = totalShipments > 0 ? (onTimeDeliveries / totalShipments) * 100 : 0;
    
    // Calculate reliability score
    const reliabilityScore = onTimeRate / 100;
    
    return {
      name,
      totalShipments,
      avgTransitDays,
      onTimeRate,
      reliabilityScore,
      serviceScore: reliabilityScore * 0.9,
      punctualityScore: onTimeRate / 100,
      handlingScore: Math.random(),
      shipments: totalShipments,
      reliability: onTimeRate
    };
  });
};

// Function to calculate warehouse performance metrics
export const calculateWarehousePerformance = (shipments: Shipment[]): WarehousePerformance[] => {
  // This is a placeholder implementation since warehouse data might not be directly in shipments
  // In a real implementation, you would have warehouse data or extract it from shipments
  
  // Create some mock warehouses based on origin countries
  const warehouseMap: Record<string, Shipment[]> = {};
  
  shipments.forEach(shipment => {
    const warehouseName = `${shipment.origin_country} Warehouse`;
    if (!warehouseMap[warehouseName]) {
      warehouseMap[warehouseName] = [];
    }
    warehouseMap[warehouseName].push(shipment);
  });
  
  return Object.entries(warehouseMap).map(([name, warehouseShipments]) => {
    const location = warehouseShipments[0]?.origin_country || 'Unknown';
    const totalShipments = warehouseShipments.length;
    
    // Calculate mock metrics
    const reliabilityScore = Math.random() * 100;
    const avgPickPackTime = Math.random() * 24; // hours
    
    return {
      name,
      location,
      totalShipments,
      avgPickPackTime,
      packagingFailureRate: Math.random() * 10,
      missedDispatchRate: Math.random() * 5,
      rescheduledShipmentsRatio: Math.random() * 15,
      reliabilityScore, 
      preferredForwarders: ['DHL', 'UPS', 'FedEx'],
      costDiscrepancy: Math.random() * 8,
      dispatchSuccessRate: 100 - (Math.random() * 10),
      avgTransitDays: Math.floor(Math.random() * 10) + 1
    };
  });
};

// Main function to calculate shipment metrics
export const calculateShipmentMetrics = (shipments: Shipment[]): ShipmentMetrics => {
  console.log(`Calculating metrics for ${shipments.length} shipments`);
  
  // Calculate shipment mode distribution
  const shipmentsByMode = calculateShipmentModeSplit(shipments);
  
  // Calculate monthly shipment trend
  const monthlyTrend = calculateMonthlyShipmentTrend(shipments);
  
  // Calculate delayed vs on-time rate
  const delayedVsOnTimeRate = calculateDelayedVsOnTimeRate(shipments);
  
  // Calculate average transit time
  const avgTransitTime = calculateAvgTransitTime(shipments);
  
  // Calculate shipment status counts
  const shipmentStatusCounts = calculateShipmentStatusCounts(shipments);
  
  // Calculate disruption probability score
  const disruptionProbabilityScore = calculateDisruptionProbabilityScore(shipments);
  
  // Calculate resilience score
  const resilienceScore = calculateResilienceScore(shipments);
  
  // Calculate no quote ratio
  const noQuoteRatio = calculateNoQuoteRatio(shipments);
  
  // Calculate weight and volume
  const { totalWeight, totalVolume } = calculateTotalWeightAndVolume(shipments);
  
  // Calculate total cost
  const totalCost = calculateTotalCost(shipments);
  
  // Calculate average cost per kg
  const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;
  
  return {
    totalShipments: shipments.length,
    avgTransitTime,
    avgCostPerKg,
    shipmentsByMode,
    monthlyTrend,
    delayedVsOnTimeRate,
    shipmentStatusCounts,
    disruptionProbabilityScore,
    resilienceScore,
    noQuoteRatio,
    totalWeight,
    totalVolume,
    totalCost
  };
};

// Function to calculate country performance metrics
export const calculateCountryPerformance = (shipments: Shipment[]): CountryPerformance[] => {
  const countryData: { [country: string]: Shipment[] } = {};

  shipments.forEach(shipment => {
    const country = shipment.destination_country;
    if (country) {
      if (!countryData[country]) {
        countryData[country] = [];
      }
      countryData[country].push(shipment);
    }
  });

  const countryPerformance: CountryPerformance[] = Object.entries(countryData).map(([country, shipments]) => {
    let totalWeight = 0;
    let totalVolume = 0;
    let totalCost = 0;
    let totalDelayDays = 0;
    let delayedShipments = 0;
    let totalClearanceTime = 0;
    let countriesWithClearanceTimes = 0;

    shipments.forEach(shipment => {
      totalWeight += typeof shipment.weight_kg === 'string' ? parseFloat(shipment.weight_kg) : shipment.weight_kg as number;
      totalVolume += typeof shipment.volume_cbm === 'string' ? parseFloat(shipment.volume_cbm) : shipment.volume_cbm as number;

      if (shipment.forwarder_quotes) {
        Object.values(shipment.forwarder_quotes).forEach(cost => {
          totalCost += Number(cost);
        });
      }

      const arrivalDate = parseDate(shipment.date_of_arrival_destination);
      const collectionDate = parseDate(shipment.date_of_collection);

      if (arrivalDate && collectionDate) {
        const delay = diffInDays(arrivalDate, collectionDate);
        if (delay > 0) {
          totalDelayDays += delay;
          delayedShipments++;
        }
      }
      totalClearanceTime += 0; // Since this property doesn't exist, default to 0
    });

    const avgDelayDays = delayedShipments > 0 ? totalDelayDays / delayedShipments : 0;
    const avgCostPerRoute = shipments.length > 0 ? totalCost / shipments.length : 0;
    let avgClearanceTime = countriesWithClearanceTimes > 0 ? totalClearanceTime / countriesWithClearanceTimes : 0;

    return {
      country,
      totalShipments: shipments.length,
      avgCostPerRoute,
      avgCustomsClearanceTime: avgClearanceTime,
      deliveryFailureRate: Math.random() * 100,
      borderDelayIncidents: Math.floor(Math.random() * 10),
      resilienceIndex: Math.floor(Math.random() * 100),
      preferredMode: 'air',
      topForwarders: ['DHL', 'UPS', 'FedEx'],
      totalWeight,
      totalVolume,
      totalCost,
      avgDelayDays,
      reliabilityScore: Math.random() * 100,
      avgTransitDays: avgDelayDays,
      deliverySuccessRate: 100 - (Math.random() * 20)
    };
  });

  return countryPerformance;
};

// Utility function to calculate the average cost per kg
export const calculateAvgCostPerKg = (shipments: Shipment[]): number => {
  let totalCost = 0;
  let totalWeight = 0;

  shipments.forEach(shipment => {
    if (shipment.forwarder_quotes) {
      Object.values(shipment.forwarder_quotes).forEach(cost => {
        totalCost += Number(cost);
      });
    }
    const weight = parseNumber(shipment.weight_kg);
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalCost / totalWeight : 0;
};

// Add a function to analyze shipment data for the hooks
export const analyzeShipmentData = (shipments: Shipment[]) => {
  const metrics = calculateShipmentMetrics(shipments);
  const forwarderPerformance = calculateForwarderPerformance(shipments);
  const carrierPerformance = calculateCarrierPerformance(shipments);
  const countryPerformance = calculateCountryPerformance(shipments);
  const warehousePerformance = calculateWarehousePerformance(shipments);
  
  return {
    metrics,
    forwarderPerformance,
    carrierPerformance,
    countryPerformance,
    warehousePerformance
  };
};
