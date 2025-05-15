
import React from 'react';
import { useBaseDataStore } from '@/store/baseState';

interface StatsOverlayProps {
  routesCount: number;
}

const StatsOverlay: React.FC<StatsOverlayProps> = ({
  routesCount
}) => {
  const { shipmentData } = useBaseDataStore();
  
  // Calculate shipment status counts from actual data
  const statusCounts = {
    inTransit: shipmentData.filter(s => 
      s.delivery_status === 'in_transit' || 
      s.delivery_status === 'In Transit'
    ).length,
    delivered: shipmentData.filter(s => 
      s.delivery_status === 'delivered' || 
      s.delivery_status === 'Delivered'
    ).length,
    pending: shipmentData.filter(s => 
      s.delivery_status === 'pending' || 
      s.delivery_status === 'Pending'
    ).length,
    delayed: shipmentData.length - (
      shipmentData.filter(s => 
        s.delivery_status === 'delivered' || 
        s.delivery_status === 'Delivered' || 
        s.delivery_status === 'in_transit' || 
        s.delivery_status === 'In Transit' ||
        s.delivery_status === 'pending' || 
        s.delivery_status === 'Pending'
      ).length
    )
  };

  // Get actual carriers from the data
  const carrierCounts: Record<string, number> = {};
  shipmentData.forEach(shipment => {
    const carrier = shipment.carrier || shipment.final_quote_awarded_freight_forwader_Carrier || 'Unknown';
    carrierCounts[carrier] = (carrierCounts[carrier] || 0) + 1;
  });

  // Sort carriers by count
  const topCarriers = Object.entries(carrierCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3)
    .map(([name, count]) => {
      // Calculate delivered rate for this carrier
      const deliveredCount = shipmentData.filter(s => 
        (s.carrier === name || s.final_quote_awarded_freight_forwader_Carrier === name) && 
        (s.delivery_status === 'delivered' || s.delivery_status === 'Delivered')
      ).length;
      
      const onTimeRate = Math.round((deliveredCount / Math.max(count, 1)) * 100);
      
      return { name, count, onTimeRate };
    });
  
  return (
    <>
      {/* Map overlay with route count */}
      <div className="absolute bottom-4 right-4 pointer-events-none z-10">
        <div className="text-xs glassmorphism-card px-3 py-2 rounded-md shadow-sm border border-mostar-light-blue/30">
          <div className="font-semibold text-cyber-blue">Routes: {routesCount}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#1A1F2C] mr-1 border border-mostar-blue/40"></span>
              Origins
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#D946EF] mr-1 shadow-neon-magenta"></span>
              Destinations
            </span>
          </div>
        </div>
      </div>
      
      {/* Floating stat cards - repositioned to left center */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 space-y-3 z-10 w-80">
        <div className="glassmorphism-card p-3 rounded-md shadow-md border border-mostar-light-blue/30 max-w-xs">
          <h3 className="font-bold mb-2 text-sm text-cyber-blue">Shipment Status</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">In Transit:</span> <span className="text-foreground">{statusCounts.inTransit}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Delayed:</span> <span className="text-red-400">{statusCounts.delayed}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Delivered:</span> <span className="text-mostar-green">{statusCounts.delivered}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pending:</span> <span className="text-cyan-400">{statusCounts.pending}</span>
            </div>
          </div>
        </div>
        
        <div className="glassmorphism-card p-3 rounded-md shadow-md border border-mostar-light-blue/30 max-w-xs">
          <h3 className="font-bold mb-2 text-sm text-cyber-blue">Top Carriers</h3>
          <div className="space-y-2 text-xs">
            {topCarriers.map((carrier, index) => (
              <div key={index} className="flex justify-between">
                <span>{carrier.name}</span>
                <span className={carrier.onTimeRate >= 90 ? "text-mostar-green" : 
                                 carrier.onTimeRate >= 80 ? "text-amber-500" : "text-red-400"}>
                  {carrier.onTimeRate}% On-Time
                </span>
              </div>
            ))}
            {topCarriers.length === 0 && (
              <div className="text-muted-foreground">No carrier data available</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsOverlay;
