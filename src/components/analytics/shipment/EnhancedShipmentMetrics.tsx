
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShipmentMetrics } from '@/types/deeptrack';
import { ArrowUp, ArrowDown, Flag, Clock, TrendingUp, DollarSign, Map, Truck, AlertTriangle, CheckCircle } from 'lucide-react';

interface EnhancedShipmentMetricsProps {
  metrics: ShipmentMetrics;
}

const EnhancedShipmentMetrics: React.FC<EnhancedShipmentMetricsProps> = ({ metrics }) => {
  // Calculate derived metrics
  const avgValuePerShipment = metrics.avgCostPerKg * 100; // Simulated for demo
  const costVariance = ((metrics.avgCostPerKg - 3.2) / 3.2) * 100; // Simulated baseline of $3.2/kg
  const originDestCount = Object.keys(metrics.shipmentsByMode).length;
  const onTimeDeliveryRate = Math.round((metrics.delayedVsOnTimeRate.onTime / 
    (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed)) * 100);
  const documentAccuracy = 94; // Simulated for demo
  
  // Determine status colors based on values
  const getStatusColor = (value: number, threshold1: number, threshold2: number) => {
    if (value >= threshold2) return 'text-green-500';
    if (value >= threshold1) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Advanced Metrics</h3>
      
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-mostar-light-blue/15 bg-black/70 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-blue-400" />
              Avg Value per Shipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgValuePerShipment.toFixed(2)}</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">Per shipment value</span>
              <span className="inline-flex items-center text-xs font-medium text-green-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                2.4%
              </span>
            </div>
            <Progress value={75} className="h-1 mt-3" />
          </CardContent>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500" />
        </Card>
        
        <Card className="relative overflow-hidden border-mostar-light-blue/15 bg-black/70 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-400" />
              Cost Variance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${costVariance > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {costVariance > 0 ? '+' : ''}{costVariance.toFixed(1)}%
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">From baseline cost</span>
              <span className="inline-flex items-center text-xs font-medium text-muted-foreground">
                Target: $3.20/kg
              </span>
            </div>
            <Progress 
              value={Math.min(Math.abs(costVariance), 50) * 2} 
              className={`h-1 mt-3 ${costVariance > 0 ? 'bg-red-900' : 'bg-green-900'}`} 
            />
          </CardContent>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500" />
        </Card>
        
        <Card className="relative overflow-hidden border-mostar-light-blue/15 bg-black/70 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Map className="h-4 w-4 mr-2 text-green-400" />
              Origin/Destination Pairs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{originDestCount}</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">Active shipping routes</span>
              <span className="inline-flex items-center text-xs font-medium text-amber-500">
                <Flag className="h-3 w-3 mr-1" />
                {Math.floor(originDestCount * 0.3)} High-volume
              </span>
            </div>
            <Progress value={originDestCount * 10} className="h-1 mt-3" />
          </CardContent>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-green-500 to-emerald-500" />
        </Card>
        
        <Card className="relative overflow-hidden border-mostar-light-blue/15 bg-black/70 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Truck className="h-4 w-4 mr-2 text-amber-400" />
              Container Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">Average space usage</span>
              <span className="inline-flex items-center text-xs font-medium text-green-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                4.2%
              </span>
            </div>
            <Progress value={84} className="h-1 mt-3" />
          </CardContent>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-amber-500 to-orange-500" />
        </Card>
      </div>
      
      {/* Operational/Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-mostar-light-blue/15 bg-black/70 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-indigo-400" />
              On-Time Delivery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(onTimeDeliveryRate, 85, 95)}`}>{onTimeDeliveryRate}%</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">Service level</span>
              <span className="inline-flex items-center text-xs font-medium text-blue-400">
                Target: 95%
              </span>
            </div>
            <div className="mt-3 bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-green-500" 
                style={{ width: `${onTimeDeliveryRate}%` }}
              />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-blue-500" />
        </Card>
        
        <Card className="relative overflow-hidden border-mostar-light-blue/15 bg-black/70 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-emerald-400" />
              Document Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(documentAccuracy, 90, 97)}`}>{documentAccuracy}%</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">Error-free documentation</span>
              <span className="inline-flex items-center text-xs font-medium text-red-500">
                <ArrowDown className="h-3 w-3 mr-1" />
                1.2%
              </span>
            </div>
            <div className="mt-3 bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-green-500" 
                style={{ width: `${documentAccuracy}%` }}
              />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-teal-500" />
        </Card>
        
        <Card className="relative overflow-hidden border-mostar-light-blue/15 bg-black/70 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
              Risk Assessment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(100 - metrics.disruptionProbabilityScore * 10, 70, 85)}`}>
              {Math.round(100 - metrics.disruptionProbabilityScore * 10)}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">Supply chain risk level</span>
              <span className="inline-flex items-center text-xs font-medium text-green-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                5 pts
              </span>
            </div>
            <div className="mt-3 bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-green-500" 
                style={{ width: `${100 - metrics.disruptionProbabilityScore * 10}%` }}
              />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-red-500 to-orange-500" />
        </Card>
        
        <Card className="relative overflow-hidden border-mostar-light-blue/15 bg-black/70 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-cyan-400" />
              Lead Time Variance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${Math.random() > 0.5 ? 'text-amber-500' : 'text-green-500'}`}>±{(metrics.avgTransitTime * 0.12).toFixed(1)}d</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">Delivery time predictability</span>
              <span className="inline-flex items-center text-xs font-medium text-blue-400">
                Target: ±0.5d
              </span>
            </div>
            <Progress value={60} className="h-1 mt-3" />
          </CardContent>
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-blue-500" />
        </Card>
      </div>
    </div>
  );
};

export default EnhancedShipmentMetrics;
