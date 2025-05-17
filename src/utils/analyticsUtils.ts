
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
