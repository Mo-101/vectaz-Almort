import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { ShipmentMetrics } from '@/types/shipment';

type ChartDataItem = {
  date: string;
  disruption: number;
  cost: number;
  reliability: number;
};

interface ShipmentResilienceChartProps {
  title?: string;
  className?: string;
  metrics?: ShipmentMetrics;
}

const mockData: ChartDataItem[] = [
  {
    date: 'Jan',
    disruption: 40,
    cost: 65,
    reliability: 80,
  },
  {
    date: 'Feb',
    disruption: 30,
    cost: 68,
    reliability: 82,
  },
  {
    date: 'Mar',
    disruption: 35,
    cost: 62,
    reliability: 79,
  },
  {
    date: 'Apr',
    disruption: 25,
    cost: 70,
    reliability: 85,
  },
  {
    date: 'May',
    disruption: 20,
    cost: 73,
    reliability: 87,
  },
  {
    date: 'Jun',
    disruption: 18,
    cost: 75,
    reliability: 90,
  },
  {
    date: 'Jul',
    disruption: 22,
    cost: 72,
    reliability: 88,
  },
  {
    date: 'Aug',
    disruption: 15,
    cost: 78,
    reliability: 92,
  },
  {
    date: 'Sep',
    disruption: 25,
    cost: 74,
    reliability: 86,
  },
  {
    date: 'Oct',
    disruption: 22,
    cost: 76,
    reliability: 87,
  },
  {
    date: 'Nov',
    disruption: 18,
    cost: 79,
    reliability: 90,
  },
  {
    date: 'Dec',
    disruption: 15,
    cost: 82,
    reliability: 94,
  },
];

const ShipmentResilienceChart: React.FC<ShipmentResilienceChartProps> = ({
  title = 'Route Resilience Metrics',
  className,
  metrics,
}) => {
  const isLoading = false;

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background/95 backdrop-blur-sm border border-border p-3 rounded-md shadow-md">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Generate data based on metrics if available
  const chartData = metrics ? generateDataFromMetrics(metrics) : mockData;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="currentColor" 
                strokeOpacity={0.5}
                fontSize={12}
              />
              <YAxis 
                stroke="currentColor" 
                strokeOpacity={0.5}
                fontSize={12}
              />
              <Tooltip content={renderCustomTooltip} />
              <Legend />
              <Line
                type="monotone"
                dataKey="disruption"
                stroke="#ef4444"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                name="Disruption"
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#f97316" 
                strokeWidth={2}
                name="Cost"
              />
              <Line 
                type="monotone" 
                dataKey="reliability" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Reliability"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to generate chart data from metrics
const generateDataFromMetrics = (metrics: ShipmentMetrics): ChartDataItem[] => {
  // In a real implementation, we would use metrics data to generate the chart
  // For now, we'll use mock data but in a real scenario this would transform
  // the metrics data into the chart format
  
  // Example of how we might use real metrics data:
  if (metrics.monthlyTrend && metrics.monthlyTrend.length > 0) {
    return metrics.monthlyTrend.map(item => {
      return {
        date: item.month,
        // These would be real values derived from the metrics
        disruption: Math.round(metrics.disruptionProbabilityScore * 10),
        reliability: Math.round(metrics.resilienceScore),
        cost: 70 + Math.floor(Math.random() * 20) // Placeholder random value
      };
    });
  }
  
  return mockData;
};

export default ShipmentResilienceChart;
