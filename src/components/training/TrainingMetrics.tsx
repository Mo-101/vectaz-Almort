
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TrainingMetricsProps {
  metrics: {
    accuracy: number;
    loss: number;
    epoch: number;
    totalEpochs: number;
  };
}

const TrainingMetrics: React.FC<TrainingMetricsProps> = ({ metrics }) => {
  const progressPercentage = (metrics.epoch / metrics.totalEpochs) * 100;
  
  return (
    <Card className="border-mostar-light-blue/15 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Training Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Epoch</span>
              <span className="text-sm font-medium">{metrics.epoch} / {metrics.totalEpochs}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <MetricItem 
              label="Accuracy" 
              value={`${(metrics.accuracy * 100).toFixed(1)}%`}
              delta="+2.5%" 
              trend="up" 
            />
            <MetricItem 
              label="Loss" 
              value={metrics.loss.toFixed(3)}
              delta="-0.017" 
              trend="down" 
            />
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="font-medium">Estimated Time Remaining</div>
            <div className="flex items-center gap-1 text-lg font-mono">
              <span className="text-gray-300">01:23:45</span>
            </div>
          </div>
          
          {/* Training parameters could go here */}
          <div className="grid grid-cols-2 gap-3 text-sm mt-2 bg-black/20 p-3 rounded-md border border-gray-800">
            <div className="flex flex-col">
              <span className="text-gray-400">Learning Rate</span>
              <span className="font-mono">0.001</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">Batch Size</span>
              <span className="font-mono">64</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">Optimizer</span>
              <span className="font-mono">Adam</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">Model Size</span>
              <span className="font-mono">384M params</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricItemProps {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, delta, trend }) => {
  return (
    <div className="p-3 bg-black/30 rounded-md border border-gray-800">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="text-lg font-semibold mt-1">{value}</div>
      {delta && (
        <div className={`text-xs flex items-center gap-0.5 mt-1 ${
          trend === 'up' ? 'text-green-400' : 
          trend === 'down' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {delta}
        </div>
      )}
    </div>
  );
};

export default TrainingMetrics;
