
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
import { TruckIcon, Ship, Plane, Clock, DollarSign, ShieldCheck } from 'lucide-react';
import SymbolicSummaryPanel from './symbolic/SymbolicSummaryPanel';

interface CoreMetrics {
  totalShipments: number;
  onTimeRate: number;
  avgTransitDays: number;
  costEfficiency: number;
  routeResilience: number;
  modeSplit: {
    air: number;
    sea: number;
    road: number;
  };
}

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
    { name: 'Road', value: metrics.modeSplit.road, color: '#f97316' }
  ];

  return (
    <div className="space-y-6">
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
            <div className="text-xs text-gray-500 mt-1">Last month: 7.2 days</div>
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
            <div className="flex justify-between text-xs text-gray-400 mt-4">
              <div className="flex items-center gap-1">
                <Plane className="h-3 w-3" />
                <span>Air: {metrics.modeSplit.air.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Ship className="h-3 w-3" />
                <span>Sea: {metrics.modeSplit.sea.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <TruckIcon className="h-3 w-3" />
                <span>Road: {metrics.modeSplit.road.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A1A2F]/60 border-[#00FFD1]/10">
          <CardHeader>
            <CardTitle className="text-[#00FFD1]">Route Resilience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(metrics.routeResilience * 100)}%
                </div>
                <div className="text-xs text-gray-400">
                  Overall network resilience
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-[#00FFD1]" />
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Risk Levels', low: 70, medium: 20, high: 10 },
                  ]}
                  layout="vertical"
                  stackOffset="expand"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Bar dataKey="low" stackId="a" fill="#22c55e" name="Low Risk" />
                  <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium Risk" />
                  <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Risk" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewContent;
