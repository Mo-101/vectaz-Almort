
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ShipmentStatusChartProps {
  shipmentStatusCounts: ShipmentMetrics['shipmentStatusCounts'];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A288E3', '#FF6B6B'];

const ShipmentStatusChart: React.FC<ShipmentStatusChartProps> = ({ shipmentStatusCounts }) => {
  // Prepare data for shipment status chart
  const statusData = [
    {
      name: 'Active',
      value: shipmentStatusCounts.active
    }, 
    {
      name: 'Completed',
      value: shipmentStatusCounts.completed
    }, 
    {
      name: 'Failed',
      value: shipmentStatusCounts.failed
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Status</CardTitle>
        <CardDescription>Active, completed and failed shipments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={statusData} 
                cx="50%" 
                cy="50%" 
                labelLine={true} 
                outerRadius={80} 
                fill="#8884d8" 
                dataKey="value" 
                nameKey="name" 
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
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

export default ShipmentStatusChart;
