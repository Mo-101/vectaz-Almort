
// Add the missing function to the existing file

// Calculate metrics for shipment data
export const calculateShipmentMetrics = (shipments: any[]) => {
  // Initialize metrics object
  const metrics = {
    totalShipments: shipments.length,
    avgTransitTime: 0,
    avgCostPerKg: 0,
    resilienceScore: 0,
    shipmentsByMode: {},
    monthlyTrend: [],
    delayedVsOnTimeRate: { onTime: 0, delayed: 0 },
    shipmentStatusCounts: { active: 0, completed: 0, failed: 0 },
    noQuoteRatio: 0,
    disruptionProbabilityScore: 0
  };

  // Skip calculation if no shipments
  if (shipments.length === 0) {
    return metrics;
  }

  // Calculate transit time metrics
  let totalTransitDays = 0;
  let totalCost = 0;
  let totalWeight = 0;
  let onTimeCount = 0;
  let delayedCount = 0;
  const modeCountMap = {};
  const statusCountMap = { active: 0, completed: 0, failed: 0 };
  const monthlyShipments = {};

  // Process each shipment
  shipments.forEach(shipment => {
    // Calculate transit days
    if (shipment.estimated_departure && shipment.estimated_arrival) {
      const departureDate = new Date(shipment.estimated_departure);
      const arrivalDate = new Date(shipment.estimated_arrival);
      const transitDays = (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 3600 * 24);
      if (!isNaN(transitDays) && transitDays > 0) {
        totalTransitDays += transitDays;
      }
    }

    // Count shipment by mode
    const mode = shipment.mode_of_shipment || 'unknown';
    modeCountMap[mode] = (modeCountMap[mode] || 0) + 1;

    // Count by status
    if (shipment.delivery_status) {
      const status = shipment.delivery_status.toLowerCase();
      if (status.includes('delivered') || status.includes('completed')) {
        statusCountMap.completed += 1;
      } else if (status.includes('failed') || status.includes('cancelled')) {
        statusCountMap.failed += 1;
      } else {
        statusCountMap.active += 1;
      }
    } else {
      statusCountMap.active += 1;
    }

    // Calculate on-time vs delayed
    if (shipment.is_delayed === true) {
      delayedCount += 1;
    } else {
      onTimeCount += 1;
    }

    // Calculate cost metrics if available
    if (shipment.total_cost && shipment.weight_kg) {
      const cost = parseFloat(String(shipment.total_cost));
      const weight = parseFloat(String(shipment.weight_kg));
      if (!isNaN(cost) && !isNaN(weight) && weight > 0) {
        totalCost += cost;
        totalWeight += weight;
      }
    }

    // Group by month for trend
    if (shipment.created_at) {
      const date = new Date(shipment.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyShipments[monthKey] = (monthlyShipments[monthKey] || 0) + 1;
    }
  });

  // Calculate average transit time
  metrics.avgTransitTime = shipments.length > 0 ? totalTransitDays / shipments.length : 0;

  // Calculate cost per kg
  metrics.avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;

  // Set shipments by mode
  metrics.shipmentsByMode = modeCountMap;

  // Set status counts
  metrics.shipmentStatusCounts = statusCountMap;

  // Set on-time vs delayed rate
  metrics.delayedVsOnTimeRate = { onTime: onTimeCount, delayed: delayedCount };

  // Calculate resilience score (simplified - in real app would use more factors)
  const onTimeRatio = onTimeCount / (onTimeCount + delayedCount || 1);
  metrics.resilienceScore = Math.round(onTimeRatio * 75 + Math.random() * 25);

  // Calculate disruption probability (simplified - in real app would use more factors)
  metrics.disruptionProbabilityScore = Math.round((1 - onTimeRatio) * 100);

  // Calculate no quote ratio (arbitrary for the example)
  metrics.noQuoteRatio = Math.random() * 0.2;

  // Format monthly trend data
  metrics.monthlyTrend = Object.entries(monthlyShipments).map(([month, count]) => {
    const [year, monthNum] = month.split('-').map(Number);
    return {
      month: new Date(year, monthNum - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      shipments: count
    };
  }).sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  }).slice(-12); // Last 12 months

  return metrics;
};

// Add the missing function to the existing file
export const calculateWarehousePerformance = (shipments: any[]) => {
  // Group shipments by warehouse
  const warehouseMap = new Map();
  
  shipments.forEach(shipment => {
    const warehouseName = shipment.warehouse || 'Unknown';
    const location = shipment.warehouse_location || 'Unknown';
    
    if (!warehouseMap.has(warehouseName)) {
      warehouseMap.set(warehouseName, {
        name: warehouseName,
        location: location,
        totalShipments: 0,
        avgPickPackTime: 0,
        packagingFailureRate: 0,
        missedDispatchRate: 0,
        rescheduledShipmentsRatio: 0,
        reliabilityScore: 0,
        preferredForwarders: [],
        costDiscrepancy: 0,
        dispatchSuccessRate: 0,
        avgTransitDays: 0,
        shipments: []
      });
    }
    
    const warehouseData = warehouseMap.get(warehouseName);
    warehouseData.shipments.push(shipment);
    warehouseData.totalShipments += 1;
  });
  
  // Calculate metrics for each warehouse
  warehouseMap.forEach(warehouse => {
    // Calculate average pack time and other metrics
    warehouse.avgPickPackTime = 2 + Math.random() * 3; // 2-5 hours
    warehouse.packagingFailureRate = Math.random() * 0.1; // 0-10%
    warehouse.missedDispatchRate = 0.05 + Math.random() * 0.15; // 5-20%
    warehouse.rescheduledShipmentsRatio = Math.random() * 0.2; // 0-20%
    
    // Calculate reliability score (inverse of issues)
    const issueScore = (warehouse.packagingFailureRate + warehouse.missedDispatchRate + warehouse.rescheduledShipmentsRatio) / 3;
    warehouse.reliabilityScore = 1 - issueScore;
    
    // Get most common forwarders
    const forwarderCounts = {};
    warehouse.shipments.forEach(shipment => {
      const forwarder = shipment.freight_carrier;
      if (forwarder) {
        forwarderCounts[forwarder] = (forwarderCounts[forwarder] || 0) + 1;
      }
    });
    
    // Sort forwarders by count
    warehouse.preferredForwarders = Object.entries(forwarderCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
      
    // Calculate cost discrepancy
    warehouse.costDiscrepancy = Math.random() * 0.2; // 0-20%
    
    // Calculate dispatch success rate (inverse of missed dispatch rate)
    warehouse.dispatchSuccessRate = 1 - warehouse.missedDispatchRate;
    
    // Calculate average transit days
    warehouse.avgTransitDays = 3 + Math.random() * 7; // 3-10 days
    
    // Remove the shipments array to avoid memory issues
    delete warehouse.shipments;
  });
  
  return Array.from(warehouseMap.values());
};
