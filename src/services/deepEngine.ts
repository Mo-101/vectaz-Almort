
// Fix for lines 196 and 197 - converting string|number to number before addition
export function fixNumberAddition(value: string | number) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue;
}

// Fix for line 100 and 260 - ensure carrier property is included
export function processShipmentData(shipmentData: any) {
  // Ensure carrier property exists
  return {
    ...shipmentData,
    carrier: shipmentData.carrier || shipmentData.freight_carrier || '',
    expected_delivery_date: shipmentData.expected_delivery_date || null
  };
}

// Adding the missing getForwarderRankings function
export function getForwarderRankings(weightFactors: { cost: number, time: number, reliability: number }) {
  // This is a mock implementation - in a real app this would do more complex ranking
  return [
    {
      forwarder: "DHL Express",
      score: 0.85,
      closeness: 0.9,
      costPerformance: 0.8,
      timePerformance: 0.9,
      reliabilityPerformance: 0.85
    },
    {
      forwarder: "FedEx",
      score: 0.82,
      closeness: 0.85,
      costPerformance: 0.75,
      timePerformance: 0.85,
      reliabilityPerformance: 0.9
    },
    {
      forwarder: "UPS",
      score: 0.78,
      closeness: 0.8,
      costPerformance: 0.7,
      timePerformance: 0.8,
      reliabilityPerformance: 0.85
    }
  ];
}

// Adding the missing loadMockData function for dataIntake.ts
export function loadMockData() {
  console.log("Mock data loaded for DeepEngine");
  return true;
}
