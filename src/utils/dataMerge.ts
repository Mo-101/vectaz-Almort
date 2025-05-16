// Update the fields that were causing type errors
// For any instances of shipment.id or shipment.updated_at usage:

// Replace line 28:
return existingShipment && shipment.request_reference === existingShipment.request_reference;

// Replace line 32:
const timestamps = [new Date(shipment.date_of_collection || 0), new Date(existingShipment.date_of_collection || 0)];

// Replace line 33:
return (shipment.request_reference || '').localeCompare(existingShipment.request_reference || '');
