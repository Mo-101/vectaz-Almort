import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { Package, Clock, AlertTriangle, Shield, Info, Users, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeepExplainModal from '../DeepExplainModal';
import { explainShipmentMetrics, MetricExplanation } from '@/services/deepSightNarrator';

interface ShipmentMetricsCardsProps {
  metrics: ShipmentMetrics;
}

const ShipmentMetricsCards: React.FC<ShipmentMetricsCardsProps> = ({ metrics }) => {
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [currentMetricKey, setCurrentMetricKey] = useState<string>('');
  
  const handleExplainClick = (metricKey: string) => {
    setCurrentMetricKey(metricKey);
    setExplainModalOpen(true);
  };
  
  const currentExplanation = currentMetricKey ? 
    explainShipmentMetrics(currentMetricKey) : undefined;

  // Default values for metrics that might be undefined
  const forwarderCount = Object.keys(metrics.forwarderPerformance || {}).length || 5;
  const topForwarder = metrics.topForwarder || "DHL Express";
  const carrierCount = metrics.carrierCount || 8;
  const topCarrier = metrics.topCarrier || "Kenya Airways";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-[29px] my-0 py-px mx-0">
        <Card className="px-0 mx-0 py-0 my-0 relative group bg-gradient-to-br from-black/70 to-mostar-blue/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2 text-mostar-light-blue" />
              Total Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalShipments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all origins and destinations
            </p>
            
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center text-xs text-green-500">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                Active shipments: {metrics.shipmentStatusCounts.active}
              </div>
              <ArrowRight className="h-3 w-3 text-mostar-light-blue" />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('shipment_total')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative group bg-gradient-to-br from-black/70 to-mostar-blue/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Avg Transit Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTransitTime.toFixed(1)} days</div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-muted-foreground mt-1">
                From collection to delivery
              </p>
              {metrics.avgTransitTime > 6 && (
                <span className="text-xs text-amber-600 font-medium">
                  ↗ Above target
                </span>
              )}
            </div>
            
            <div className="mt-3 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-500" 
                style={{ width: `${Math.min(100, metrics.avgTransitTime / 10 * 100)}%` }}
              ></div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('transit_time')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative group bg-gradient-to-br from-black/70 to-mostar-blue/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Disruption Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disruptionProbabilityScore.toFixed(1)}</div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-muted-foreground mt-1">
                Risk index (0-10)
              </p>
              <span className={`text-xs font-medium ${
                metrics.disruptionProbabilityScore > 7 ? 'text-red-600' : 
                metrics.disruptionProbabilityScore > 4 ? 'text-amber-600' : 'text-green-600'
              }`}>
                {metrics.disruptionProbabilityScore > 7 ? 'High' : 
                 metrics.disruptionProbabilityScore > 4 ? 'Moderate' : 'Low'} Risk
              </span>
            </div>
            
            <div className="mt-3 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-red-500" 
                style={{ width: `${metrics.disruptionProbabilityScore * 10}%` }}
              ></div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('disruption_score')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative group bg-gradient-to-br from-black/70 to-mostar-blue/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Resilience Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.resilienceScore.toFixed(1)}</div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-muted-foreground mt-1">
                Ability to overcome disruptions
              </p>
              <span className={`text-xs font-medium ${
                metrics.resilienceScore > 75 ? 'text-green-600' : 
                metrics.resilienceScore > 50 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {metrics.resilienceScore > 75 ? 'Strong' : 
                 metrics.resilienceScore > 50 ? 'Moderate' : 'Weak'}
              </span>
            </div>
            
            <div className="mt-3 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-green-500" 
                style={{ width: `${metrics.resilienceScore}%` }}
              ></div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('resilience_score')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-[29px] mt-4">
        <Card className="relative group bg-gradient-to-br from-black/70 to-mostar-blue/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Freight Forwarders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forwarderCount}
            </div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-muted-foreground mt-1">
                Active 3PL partners
              </p>
              <span className="text-xs text-blue-600 font-medium">
                Top: {topForwarder}
              </span>
            </div>
            
            <div className="mt-3 grid grid-cols-5 gap-1">
              {[...Array(5)].map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full ${idx < 3 ? 'bg-blue-500' : 'bg-gray-700'}`}
                ></div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('forwarders')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative group bg-gradient-to-br from-black/70 to-mostar-blue/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Truck className="h-4 w-4 mr-2 text-purple-500" />
              Carriers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carrierCount}
            </div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-muted-foreground mt-1">
                Transport service providers
              </p>
              <span className="text-xs text-purple-600 font-medium">
                Top: {topCarrier}
              </span>
            </div>
            
            <div className="mt-3 grid grid-cols-8 gap-1">
              {[...Array(8)].map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full ${idx < 5 ? 'bg-gradient-to-r from-purple-500 to-purple-400' : 'bg-gray-700'}`}
                ></div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleExplainClick('carriers')}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Explain</span>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <DeepExplainModal
        open={explainModalOpen}
        onOpenChange={setExplainModalOpen}
        metricKey={currentMetricKey}
        explanation={currentExplanation}
      />
    </>
  );
};

export default ShipmentMetricsCards;
