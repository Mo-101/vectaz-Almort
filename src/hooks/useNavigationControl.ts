
// Replace line 62 with this check that doesn't rely on data_validated:
const canAccessSection = !requiresValidation || 
  (shipmentData && shipmentData.length > 0 && shipmentData.some(s => s.delivery_status === "delivered"));
