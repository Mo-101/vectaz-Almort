
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ShipmentTimeTrendsProps {
  metrics: ShipmentMetrics;
}

const ShipmentTimeTrends: React.FC<ShipmentTimeTrendsProps> = ({ metrics }) => {
  // Generate time-series data for the chart
  // In a real implementation, this would come from the metrics or API
  const generateTimeSeriesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const baseTransitTime = metrics.avgTransitTime;
    const baseOnTimeRate = metrics.delayedVsOnTimeRate.onTime / 
      (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed) * 100;
    
    return months.map((month, index) => {
      // Create some variation for visualization
      const variance = (Math.random() - 0.5) * 2;
      const inflection = index > 5 ? -1 : 1; // Create a trend shift after 5 months
      
      return {
        month,
        transitTime: Math.max(1, baseTransitTime + variance * (index * 0.05) * inflection),
        onTimeRate: Math.min(100, Math.max(60, baseOnTimeRate + (variance * 3) * inflection)),
        costPerKg: metrics.avgCostPerKg * (1 + (0.02 * index - 0.02 * Math.floor(index / 3)) + variance * 0.1)
      };
    });
  };
  
  const data = generateTimeSeriesData();
  
  // Calculate trends (last month vs first month)
  const firstMonth = data[0];
  const lastMonth = data[data.length - 1];
  const transitTimeTrend = ((lastMonth.transitTime - firstMonth.transitTime) / firstMonth.transitTime) * 100;
  const onTimeRateTrend = lastMonth.onTimeRate - firstMonth.onTimeRate;
  const costTrend = ((lastMonth.costPerKg - firstMonth.costPerKg) / firstMonth.costPerKg) * 100;
  
  const chartConfig = {
    transitTime: { label: "Transit Time (days)", color: "#3b82f6" },
    onTimeRate: { label: "On-Time Rate (%)", color: "#10b981" },
    costPerKg: { label: "Cost per KG ($)", color: "#f97316" }
  };

  return (
    <Card>
      <CardHeader className="border-b border-border/40 bg-black/30">
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          Performance Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Transit Time</span>
            <div className="flex items-center">
              <span className="text-xl font-semibold">{metrics.avgTransitTime.toFixed(1)}d</span>
              <span className={`ml-2 text-xs flex items-center ${
                transitTimeTrend > 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                {transitTimeTrend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(transitTimeTrend).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">On-Time Rate</span>
            <div className="flex items-center">
              <span className="text-xl font-semibold">
                {(metrics.delayedVsOnTimeRate.onTime / (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed) * 100).toFixed(1)}%
              </span>
              <span className={`ml-2 text-xs flex items-center ${
                onTimeRateTrend > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {onTimeRateTrend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(onTimeRateTrend).toFixed(1)} pts
              </span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Cost per KG</span>
            <div className="flex items-center">
              <span className="text-xl font-semibold">${metrics.avgCostPerKg.toFixed(2)}</span>
              <span className={`ml-2 text-xs flex items-center ${
                costTrend > 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                {costTrend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(costTrend).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <ChartContainer 
          config={chartConfig}
          className="h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#888' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#888' }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#888' }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="transitTime"
                name="Transit Time (days)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 0, fill: "#3b82f6" }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="onTimeRate"
                name="On-Time Rate (%)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="costPerKg"
                name="Cost per KG ($)"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 0, fill: "#f97316" }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ShipmentTimeTrends;
