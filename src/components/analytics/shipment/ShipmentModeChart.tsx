
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ShipmentModeChartProps {
  shipmentsByMode: ShipmentMetrics['shipmentsByMode'];
}

const ShipmentModeChart: React.FC<ShipmentModeChartProps> = ({ shipmentsByMode }) => {
  // Prepare data for mode distribution chart
  const modeData = Object.entries(shipmentsByMode).map(([mode, count]) => ({
    name: mode,
    value: count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Mode Distribution</CardTitle>
        <CardDescription>Breakdown by transportation mode</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Shipments" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentModeChart;
