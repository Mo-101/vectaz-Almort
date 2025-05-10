import { CountryPerformance, Shipment, ShipmentMetrics } from '@/types/deeptrack';

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
const calculateForwarderPerformance = (shipments: Shipment[]): Record<string, number> => {
  const forwarderPerformance: Record<string, number> = {};

  shipments.forEach(shipment => {
    if (shipment.freight_carrier) {
      forwarderPerformance[shipment.freight_carrier] = (forwarderPerformance[shipment.freight_carrier] || 0) + 1;
    }
  });

  return forwarderPerformance;
};

// Utility function to calculate carrier performance
const calculateCarrierPerformance = (shipments: Shipment[]): Record<string, number> => {
  const carrierPerformance: Record<string, number> = {};

  shipments.forEach(shipment => {
    if (shipment.carrier) {
      carrierPerformance[shipment.carrier] = (carrierPerformance[shipment.carrier] || 0) + 1;
    }
  });

  return carrierPerformance;
};

// Utility function to find the top forwarder
const findTopForwarder = (forwarderPerformance: Record<string, number>): string | undefined => {
  let topForwarder: string | undefined;
  let maxShipments = 0;

  for (const forwarder in forwarderPerformance) {
    if (forwarderPerformance[forwarder] > maxShipments) {
      topForwarder = forwarder;
      maxShipments = forwarderPerformance[forwarder];
    }
  }

  return topForwarder;
};

// Utility function to find the top carrier
const findTopCarrier = (carrierPerformance: Record<string, number>): string | undefined => {
  let topCarrier: string | undefined;
  let maxShipments = 0;

  for (const carrier in carrierPerformance) {
    if (carrierPerformance[carrier] > maxShipments) {
      topCarrier = carrier;
      maxShipments = carrierPerformance[carrier];
    }
  }

  return topCarrier;
};

// Utility function to calculate the number of unique carriers
const calculateCarrierCount = (shipments: Shipment[]): number => {
  const carriers = new Set<string>();

  shipments.forEach(shipment => {
    if (shipment.carrier) {
      carriers.add(shipment.carrier);
    }
  });

  return carriers.size;
};

// Utility function to calculate the average cost per kg
const calculateAvgCostPerKg = (shipments: Shipment[]): number => {
  let totalCost = 0;
  let totalWeight = 0;

  shipments.forEach(shipment => {
    if (shipment.forwarder_quotes) {
      Object.values(shipment.forwarder_quotes).forEach(cost => {
        totalCost += Number(cost);
      });
    }
    totalWeight += typeof shipment.weight_kg === 'string' ? parseFloat(shipment.weight_kg) : shipment.weight_kg as number;
  });

  return totalWeight > 0 ? totalCost / totalWeight : 0;
};

// Main function to calculate shipment metrics
export const calculateShipmentMetrics = (shipments: Shipment[]): ShipmentMetrics => {
  const totalShipments = shipments.length;
  const shipmentsByMode = calculateShipmentModeSplit(shipments);
  const monthlyTrend = calculateMonthlyShipmentTrend(shipments);
  const delayedVsOnTimeRate = calculateDelayedVsOnTimeRate(shipments);
  const avgTransitTime = calculateAvgTransitTime(shipments);
  const disruptionProbabilityScore = calculateDisruptionProbabilityScore(shipments);
  const shipmentStatusCounts = calculateShipmentStatusCounts(shipments);
  const resilienceScore = calculateResilienceScore(shipments);
  const noQuoteRatio = calculateNoQuoteRatio(shipments);
  const forwarderPerformance = calculateForwarderPerformance(shipments);
  const carrierPerformance = calculateCarrierPerformance(shipments);
  const topForwarder = findTopForwarder(forwarderPerformance);
  const topCarrier = findTopCarrier(carrierPerformance);
  const carrierCount = calculateCarrierCount(shipments);
  const avgCostPerKg = calculateAvgCostPerKg(shipments);

  return {
    totalShipments,
    shipmentsByMode,
    monthlyTrend,
    delayedVsOnTimeRate,
    avgTransitTime,
    disruptionProbabilityScore,
    shipmentStatusCounts,
    resilienceScore,
    noQuoteRatio,
    forwarderPerformance,
    carrierPerformance,
    topForwarder,
    topCarrier,
    carrierCount,
    avgCostPerKg,
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
      avgDelayDays
    };
  });

  return countryPerformance;
};
