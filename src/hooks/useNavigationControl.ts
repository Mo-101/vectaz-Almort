import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAnalyticsData } from './useAnalyticsData';
import { useBaseDataStore } from '@/store/baseState';

// Define access control levels for various routes
export enum AccessLevel {
  PUBLIC = 'public',     // Anyone can access
  VALIDATED = 'validated', // Only with validated data
  RESTRICTED = 'restricted'  // Special permission needed
}

// Define route access rules
const routeAccessRules: Record<string, { 
  accessLevel: AccessLevel,
  dataValidationRequired: boolean,
  minShipmentCount?: number
}> = {
  '/': { 
    accessLevel: AccessLevel.PUBLIC, 
    dataValidationRequired: false 
  },
  '/forms': { 
    accessLevel: AccessLevel.VALIDATED, 
    dataValidationRequired: true 
  },
  '/deepcal': { 
    accessLevel: AccessLevel.VALIDATED, 
    dataValidationRequired: true,
    minShipmentCount: 5
  },
  '/oracle': { 
    accessLevel: AccessLevel.VALIDATED, 
    dataValidationRequired: true 
  },
  '/training': { 
    accessLevel: AccessLevel.VALIDATED, 
    dataValidationRequired: true 
  },
};

/**
 * Hook to control navigation based on data validation status
 * Ensures users only access pages with properly validated data
 */
export const useNavigationControl = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shipmentLocations } = useAnalyticsData();
  const { shipmentData } = useBaseDataStore();
  const [validationComplete, setValidationComplete] = useState(false);
  
  // Check data validation status and restrict access if needed
  useEffect(() => {
    const validateAccess = () => {
      const currentPath = location.pathname;
      const rule = routeAccessRules[currentPath] || { accessLevel: AccessLevel.PUBLIC, dataValidationRequired: false };
      
      // Check if the current route requires data validation
      if (rule.dataValidationRequired) {
        // Verify that we have validated shipment data
        const hasValidShipments = shipmentData.length > 0 && shipmentData.some(s => s.data_validated);
        
        // Check if we have enough shipments for this route (if specified)
        const hasMinimumShipments = rule.minShipmentCount 
          ? shipmentData.length >= rule.minShipmentCount
          : true;
          
        // Check if we have valid location data for map-based routes
        const hasValidLocations = shipmentLocations.length > 0;
        
        // If data validation is required but conditions aren't met, redirect to home
        if (!hasValidShipments || !hasMinimumShipments || !hasValidLocations) {
          console.warn('Navigation blocked: Data validation required for this route');
          navigate('/', { 
            state: { 
              redirectReason: 'data_validation_required',
              originalPath: currentPath
            }
          });
        }
      }
      
      // Mark validation as complete
      setValidationComplete(true);
    };
    
    validateAccess();
  }, [location.pathname, navigate, shipmentData, shipmentLocations]);
  
  return { validationComplete };
};
