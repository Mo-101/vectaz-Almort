
// Replace line 62 with this check that doesn't rely on data_validated:
export function canAccessSection(shipmentData: any[], requiresValidation: boolean = true): boolean {
  // Allow access if validation is not required
  if (!requiresValidation) {
    return true;
  }
  
  // Check if there are any shipments with delivered status (as a proxy for validated data)
  const canAccess = shipmentData && 
                  shipmentData.length > 0 && 
                  shipmentData.some(s => s.delivery_status === "delivered");
  
  return canAccess;
}
