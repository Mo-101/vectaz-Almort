
import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { Route } from '@/types/deeptrack';

interface RouteInfoPanelProps {
  route: Route;
  onClose: () => void;
}

const RouteInfoPanel: React.FC<RouteInfoPanelProps> = ({ route, onClose }) => {
  return (
    <div className="absolute top-4 right-4 pointer-events-none z-10">
      <div className="glassmorphism-card p-3 rounded-md shadow-md border border-mostar-light-blue/30 max-w-xs">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold flex items-center text-cyber-blue">
            <Info className="h-4 w-4 mr-1" />
            Route Details
          </h3>
          <button 
            className="pointer-events-auto h-5 w-5 rounded-full bg-mostar-dark/90 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Origin:</span> {route.origin.name}
          </div>
          <div>
            <span className="text-muted-foreground">Destination:</span> {route.destination.name}
          </div>
          <div>
            <span className="text-muted-foreground">Shipments:</span> {route.shipmentCount}
          </div>
          <div>
            <span className="text-muted-foreground">Total Weight:</span> {route.weight} kg
          </div>
          <div className="pt-2 flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-xs">Medium risk level on this route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteInfoPanel;
