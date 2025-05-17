
// Replace line 28:
export function compareShipments(shipment: any, existingShipment: any): boolean {
  return existingShipment && shipment.request_reference === existingShipment.request_reference;
}

// Replace line 32-33:
export function compareShipmentTimestamps(shipment: any, existingShipment: any): number {
  const timestamps = [new Date(shipment.date_of_collection || 0), new Date(existingShipment.date_of_collection || 0)];
  return (shipment.request_reference || '').localeCompare(existingShipment.request_reference || '');
}
