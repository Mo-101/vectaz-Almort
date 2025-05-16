
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route } from '@/types/deeptrack';
import { Truck, Package, Calendar } from 'lucide-react';

interface ShipmentHologramProps {
  shipments: Route[];
  onSelect: (shipment: Route, index: number) => void;
  className?: string;
}

const ShipmentHologram: React.FC<ShipmentHologramProps> = ({ 
  shipments, 
  onSelect,
  className 
}) => {
  if (!shipments || shipments.length === 0) {
    return null;
  }

  return (
    <Card className={`glassmorphism-card border-mostar-blue/30 ${className}`}>
      <CardHeader className="p-3 border-b border-mostar-blue/20">
        <CardTitle className="text-sm flex items-center text-cyber-blue">
          <Package className="h-4 w-4 mr-1" />
          Active Routes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[260px] overflow-y-auto thin-scrollbar">
        {shipments.map((shipment, index) => {
          // Use only information available in the actual Route data
          const originName = shipment.origin?.name || 'Unknown Origin';
          const destinationName = shipment.destination?.name || 'Unknown Destination';
          const deliveryStatus = shipment.deliveryStatus || 'Unknown';
          const weight = shipment.weight || 0;
          
          // Status styling based on delivery status
          const getStatusStyles = () => {
            if (deliveryStatus.toLowerCase().includes('delivered')) {
              return 'text-green-400 bg-green-400/10';
            }
            if (deliveryStatus.toLowerCase().includes('transit')) {
              return 'text-amber-400 bg-amber-400/10';
            }
            if (deliveryStatus.toLowerCase().includes('pending')) {
              return 'text-cyan-400 bg-cyan-400/10';
            }
            return 'text-red-400 bg-red-400/10';
          };
          
          return (
            <div 
              key={`${shipment.id || index}-${originName}-${destinationName}`}
              className="border-b border-mostar-blue/10 p-3 hover:bg-mostar-blue/5 cursor-pointer transition-colors"
              onClick={() => onSelect(shipment, index)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-mostar-light-blue">Route {index + 1}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyles()}`}>
                  {deliveryStatus}
                </span>
              </div>
              
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex items-center">
                  <Truck className="h-3 w-3 mr-1" />
                  <span className="truncate">{originName} → {destinationName}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{weight > 0 ? `${weight} kg` : 'Weight not available'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ShipmentHologram;
