
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ResourceChartProps {
  resources: {
    time: string[];
    cpu: number[];
    memory: number[];
    gpu?: number[];
  };
  metrics?: {
    accuracy: number;
    loss: number;
    epoch: number;
    totalEpochs: number;
  };
}

const ResourceChart: React.FC<ResourceChartProps> = ({ resources, metrics }) => {
  // Transform the data for recharts
  const data = resources.time.map((time, index) => ({
    time,
    CPU: resources.cpu[index],
    Memory: resources.memory[index],
    GPU: resources.gpu ? resources.gpu[index] : undefined,
  }));

  const chartConfig = {
    CPU: {
      label: "CPU Usage",
      color: "#3b82f6",
    },
    Memory: {
      label: "Memory Usage",
      color: "#10b981",
    },
    GPU: {
      label: "GPU Usage",
      color: "#f59e0b",
    },
  };

  return (
    <Card className="border-mostar-light-blue/15 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Resource Utilization</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="CPU" stroke={chartConfig.CPU.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Memory" stroke={chartConfig.Memory.color} strokeWidth={2} dot={false} />
                {resources.gpu && (
                  <Line type="monotone" dataKey="GPU" stroke={chartConfig.GPU.color} strokeWidth={2} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <MetricCard label="Accuracy" value={`${(metrics.accuracy * 100).toFixed(1)}%`} trend={metrics.epoch > 0 ? 'up' : 'neutral'} />
            <MetricCard label="Loss" value={metrics.loss.toFixed(3)} trend={metrics.epoch > 0 ? 'down' : 'neutral'} />
            <MetricCard label="Epoch" value={`${metrics.epoch}/${metrics.totalEpochs}`} />
            <MetricCard label="Progress" value={`${Math.round((metrics.epoch / metrics.totalEpochs) * 100)}%`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend }) => {
  return (
    <div className="bg-black/40 rounded-md p-3 border border-gray-800">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-lg font-semibold mt-1 flex items-center justify-between">
        {value}
        {trend && (
          <span className={`text-sm ${
            trend === 'up' ? 'text-green-400' : 
            trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ResourceChart;
