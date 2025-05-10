
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
