
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/shipment';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OnTimePerformanceChartProps {
  delayedVsOnTimeRate: ShipmentMetrics['delayedVsOnTimeRate'];
}

const OnTimePerformanceChart: React.FC<OnTimePerformanceChartProps> = ({ delayedVsOnTimeRate }) => {
  // Prepare data for on-time vs delayed chart
  const timelinessData = [
    {
      name: 'On Time',
      value: delayedVsOnTimeRate.onTime
    }, 
    {
      name: 'Delayed',
      value: delayedVsOnTimeRate.delayed
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>On-Time Performance</CardTitle>
        <CardDescription>On-time vs delayed shipments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={timelinessData} 
                cx="50%" 
                cy="50%" 
                labelLine={true} 
                outerRadius={80} 
                fill="#8884d8" 
                dataKey="value" 
                nameKey="name" 
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#4ade80" /> {/* Green for on-time */}
                <Cell fill="#f87171" /> {/* Red for delayed */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnTimePerformanceChart;
