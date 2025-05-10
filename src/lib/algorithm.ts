import { Shipment } from "@/types/deeptrack";

// Function to compute forwarder rankings based on criteria weights
export const computeForwarderRankings = (shipmentData: Shipment[], criteria: { cost: number; time: number; reliability: number }) => {
  // Aggregate data for each forwarder
  const forwarderData: { [key: string]: { totalCost: number; totalTime: number; shipmentCount: number; onTimeCount: number } } = {};

  shipmentData.forEach(shipment => {
    if (!shipment.forwarder_quotes) return;

    Object.keys(shipment.forwarder_quotes).forEach(forwarder => {
      if (!forwarderData[forwarder]) {
        forwarderData[forwarder] = { totalCost: 0, totalTime: 0, shipmentCount: 0, onTimeCount: 0 };
      }

      forwarderData[forwarder].totalCost += shipment.forwarder_quotes && shipment.forwarder_quotes[forwarder] ? Number(shipment.forwarder_quotes[forwarder]) : 0;
      forwarderData[forwarder].totalTime += 1;
      forwarderData[forwarder].shipmentCount++;

      if (shipment.delivery_status === 'delivered') { // Assuming 'delivered' means on-time
        forwarderData[forwarder].onTimeCount++;
      }
    });
  });

  // Calculate average cost, average time, and on-time rate for each forwarder
  const forwarderStats = Object.entries(forwarderData).map(([forwarder, data]) => {
    const avgCost = data.shipmentCount > 0 ? data.totalCost / data.shipmentCount : 0;
    const avgTime = data.totalTime / data.shipmentCount;
    const onTimeRate = data.shipmentCount > 0 ? data.onTimeCount / data.shipmentCount : 0;

    return {
      forwarder,
      avgCost,
      avgTime,
      onTimeRate,
      shipmentCount: data.shipmentCount
    };
  });

  // Normalize the criteria
  const maxCost = Math.max(...forwarderStats.map(s => s.avgCost));
  const minCost = Math.min(...forwarderStats.map(s => s.avgCost));
  const maxTime = Math.max(...forwarderStats.map(s => s.avgTime));
  const minTime = Math.min(...forwarderStats.map(s => s.avgTime));

  // Score each forwarder based on the weighted criteria
  const scoredForwarders = forwarderStats.map(forwarder => {
    const costScore = maxCost > 0 ? 1 - (forwarder.avgCost - minCost) / (maxCost - minCost) : 0;
    const timeScore = maxTime > 0 ? 1 - (forwarder.avgTime - minTime) / (maxTime - minTime) : 0;
    const reliabilityScore = forwarder.onTimeRate;

    const finalScore =
      (criteria.cost * costScore) +
      (criteria.time * timeScore) +
      (criteria.reliability * reliabilityScore);

    return {
      name: forwarder.forwarder,
      score: finalScore,
      costScore,
      timeScore,
      reliabilityScore,
      shipments: forwarder.shipmentCount
    };
  });

  // Sort forwarders by score in descending order
  scoredForwarders.sort((a, b) => b.score - a.score);

  return scoredForwarders;
};
