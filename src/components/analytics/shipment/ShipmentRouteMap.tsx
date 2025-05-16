
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics, RouteInfo } from '@/types/deeptrack';
import { Map, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useBaseDataStore } from '@/store/baseState';

interface ShipmentRouteMapProps {
  metrics: ShipmentMetrics;
}

const ShipmentRouteMap: React.FC<ShipmentRouteMapProps> = ({ metrics }) => {
  const { shipmentData } = useBaseDataStore();
  
  // Calculate actual routes from shipment data
  const routes = React.useMemo(() => {
    const routeMap = new Map<string, RouteInfo>();
    
    // Group shipments by origin-destination pairs
    shipmentData.forEach(shipment => {
      if (!shipment.origin_country || !shipment.destination_country) return;
      
      const routeKey = `${shipment.origin_country}-${shipment.destination_country}`;
      const existingRoute = routeMap.get(routeKey);
      
      if (!existingRoute) {
        routeMap.set(routeKey, {
          from: shipment.origin_country,
          to: shipment.destination_country,
          status: getDeliveryStatus(shipment.delivery_status),
          count: 1
        });
      } else {
        existingRoute.count += 1;
      }
    });
    
    // Convert map to array and sort by count
    return Array.from(routeMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Get top 6 routes
  }, [shipmentData]);
  
  // Helper function to normalize delivery status
  function getDeliveryStatus(status?: string): 'normal' | 'delayed' | 'disrupted' {
    if (!status) return 'disrupted';
    
    const normalized = status.toLowerCase();
    if (normalized.includes('delivered')) return 'normal';
    if (normalized.includes('transit')) return 'normal';
    if (normalized.includes('pending')) return 'delayed';
    return 'disrupted';
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'delayed': return 'bg-amber-500';
      case 'disrupted': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'disrupted': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  // Calculate actual metrics for display
  const activeRoutes = routes.length;
  const transportModes = new Set(shipmentData.map(s => s.mode_of_shipment).filter(Boolean)).size;

  return (
    <Card>
      <CardHeader className="border-b border-border/40 bg-black/30">
        <CardTitle className="flex items-center">
          <Map className="h-5 w-5 mr-2 text-blue-500" />
          Active Shipping Routes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-lg font-medium mb-3">
          {activeRoutes} Active Routes Across {transportModes} Transport Modes
        </div>
        
        {/* Placeholder for actual map - in real implementation, use a mapping library */}
        <div className="relative bg-gray-900/50 rounded-md h-52 mb-4 overflow-hidden border border-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-mostar-light-blue/50">Interactive Map Visualization</span>
          </div>
          
          {/* Simulated map overlay elements */}
          <div className="absolute top-2 left-2 right-2 bottom-2">
            {/* Simulated route lines */}
            <div className="absolute top-1/4 left-1/4 h-px w-1/3 bg-green-500/50 rotate-45"></div>
            <div className="absolute top-1/2 left-1/3 h-px w-1/4 bg-amber-500/50 -rotate-12"></div>
            <div className="absolute top-1/3 left-1/5 h-px w-1/3 bg-red-500/50 rotate-25"></div>
            
            {/* Simulated route points */}
            <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="absolute top-1/2 left-1/3 h-2 w-2 rounded-full bg-purple-500"></div>
            <div className="absolute top-1/3 left-1/5 h-2 w-2 rounded-full bg-green-500"></div>
            <div className="absolute bottom-1/4 right-1/4 h-2 w-2 rounded-full bg-amber-500"></div>
          </div>
        </div>
        
        {/* Route list */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-400 mb-1">Top Routes by Volume</div>
          <div className="divide-y divide-gray-800">
            {routes.length > 0 ? routes.map((route, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(route.status)} mr-2`}></div>
                  <span>{route.from} → {route.to}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">{route.count} shipments</span>
                  {getStatusIcon(route.status)}
                </div>
              </div>
            )) : (
              <div className="py-2 text-gray-400">No route data available</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentRouteMap;
