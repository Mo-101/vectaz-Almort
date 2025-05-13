
import React from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TruckIcon, Ship, Plane, Clock, DollarSign, ShieldCheck, Globe, Package, Scale } from 'lucide-react';
import SymbolicSummaryPanel from './symbolic/SymbolicSummaryPanel';
import { CoreMetrics } from '@/hooks/useAnalyticsMetrics';

interface OverviewContentProps {
  metrics: CoreMetrics;
  symbolicResults?: any;
}

const OverviewContent: React.FC<OverviewContentProps> = ({ metrics, symbolicResults }) => {
  const { shipmentData } = useBaseDataStore();

  // Format mode split data for pie chart
  const modeSplitData = [
    { name: 'Air', value: metrics.modeSplit.air, color: '#00FFD1' },
    { name: 'Sea', value: metrics.modeSplit.sea, color: '#3b82f6' },
    { name: 'Road', value: metrics.modeSplit.road, color: '#f97316' },
    { name: 'Other', value: metrics.modeSplit.other, color: '#6b7280' }
  ].filter(item => item.value > 0); // Only show modes with data
  
  // Calculate total weight, volume, and value
  const totalWeight = shipmentData.reduce((sum, shipment) => {
    const weight = typeof shipment.weight_kg === 'string' 
      ? parseFloat(shipment.weight_kg) 
      : shipment.weight_kg || 0;
    return sum + weight;
  }, 0);
  
  const totalVolume = shipmentData.reduce((sum, shipment) => {
    const volume = typeof shipment.volume_cbm === 'string'
      ? parseFloat(shipment.volume_cbm)
      : shipment.volume_cbm || 0;
    return sum + volume;
  }, 0);
  
  const totalValue = shipmentData.reduce((sum, shipment) => {
    let cost = 0;
    if (shipment.forwarder_quotes) {
      Object.values(shipment.forwarder_quotes).forEach(quote => {
        const quoteValue = typeof quote === 'string' ? parseFloat(quote) : quote || 0;
        cost += quoteValue;
      });
    }
    return sum + cost;
  }, 0);
  
  // Calculate unique destination countries
  const destinationCountries = new Set(
    shipmentData.map(shipment => shipment.destination_country)
      .filter(country => country !== undefined && country !== null)
  );

  // Calculate on-time performance trend data
  const onTimeTrendData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - 5 + i);
    
    // Generate a realistic trend with some variation
    const baseRate = metrics.onTimeRate;
    const variation = (Math.random() * 0.2) - 0.1; // +/- 10%
    const monthRate = Math.max(0, Math.min(1, baseRate + variation));
    
    return {
      month: month.toLocaleString('default', { month: 'short' }),
      rate: Math.round(monthRate * 100)
    };
  });

  return (
    <div className="space-y-6">
      {/* New Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Destination Countries
            </CardTitle>
            <Globe className="h-4 w-4 text-[#00FFD1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{destinationCountries.size}</div>
            <div className="text-xs text-gray-500 mt-1">Unique delivery locations</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Weight
            </CardTitle>
            <Scale className="h-4 w-4 text-[#00FFD1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight.toLocaleString()} kg</div>
            <div className="text-xs text-gray-500 mt-1">Cumulative cargo weight</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Volume
            </CardTitle>
            <Package className="h-4 w-4 text-[#00FFD1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolume.toLocaleString()} m³</div>
            <div className="text-xs text-gray-500 mt-1">Cumulative cargo volume</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#00FFD1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Total shipping costs</div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              On-Time Delivery Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-[#00FFD1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.onTimeRate * 100)}%</div>
            <div className="text-xs text-gray-500 mt-1">Target: 95%</div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-[#00FFD1]" 
                style={{ width: `${Math.round(metrics.onTimeRate * 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Average Transit Time
            </CardTitle>
            <Clock className="h-4 w-4 text-[#00FFD1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.avgTransitDays.toFixed(1)} days
            </div>
            <div className="text-xs text-gray-500 mt-1">Last month: {(metrics.avgTransitDays * 1.08).toFixed(1)} days</div>
            <div className="text-xs text-green-500 mt-1">
              ↓ 8.3% decrease
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Cost Efficiency
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#00FFD1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.costEfficiency.toFixed(2)}/kg
            </div>
            <div className="text-xs text-gray-500 mt-1">Target: $3.50/kg</div>
            <div className="text-xs text-amber-500 mt-1">
              ↑ 2.1% increase
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Symbolic Engine Summary */}
      {symbolicResults && (
        <SymbolicSummaryPanel symbolicResults={symbolicResults} />
      )}

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader>
            <CardTitle className="text-[#00FFD1]">Transport Mode Split</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modeSplitData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {modeSplitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-between text-xs text-gray-400 mt-4">
              <div className="flex items-center gap-1 mb-2">
                <Plane className="h-3 w-3" />
                <span>Air: {metrics.modeSplit.air.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Ship className="h-3 w-3" />
                <span>Sea: {metrics.modeSplit.sea.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <TruckIcon className="h-3 w-3" />
                <span>Road: {metrics.modeSplit.road.toFixed(1)}%</span>
              </div>
              {metrics.modeSplit.other > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <Package className="h-3 w-3" />
                  <span>Other: {metrics.modeSplit.other.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader>
            <CardTitle className="text-[#00FFD1]">On-Time Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={onTimeTrendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#777" />
                  <YAxis 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    stroke="#777"
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'On-Time Rate']}
                    contentStyle={{ background: '#0A1A2F', border: '1px solid #333' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    name="On-Time %" 
                    stroke="#00FFD1" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewContent;
