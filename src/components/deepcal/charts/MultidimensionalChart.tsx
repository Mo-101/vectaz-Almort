
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForwarderScore } from '../types';

interface MultidimensionalChartProps {
  results: ForwarderScore[];
}

const MultidimensionalChart: React.FC<MultidimensionalChartProps> = ({ results }) => {
  // Transform data for radar chart to show dimensions as percentages
  const radarData = [
    { dimension: 'Cost', ...results.reduce((acc, curr) => ({...acc, [curr.forwarder]: Math.round(curr.costPerformance * 100)}), {}) },
    { dimension: 'Time', ...results.reduce((acc, curr) => ({...acc, [curr.forwarder]: Math.round(curr.timePerformance * 100)}), {}) },
    { dimension: 'Reliability', ...results.reduce((acc, curr) => ({...acc, [curr.forwarder]: Math.round(curr.reliabilityPerformance * 100)}), {}) },
  ];

  // Generate unique colors for each forwarder
  const colors = [
    '#00FFD1', // Primary color for top forwarder
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#f97316', // Orange
  ];

  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
      <CardHeader>
        <CardTitle className="text-[#00FFD1]">Multi-Dimensional Analysis</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={150} data={radarData}>
            <PolarGrid stroke="#1E293B" />
            <PolarAngleAxis dataKey="dimension" stroke="#94A3B8" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(value) => `${value}%`} stroke="#94A3B8" />
            
            {results.map((result, index) => (
              <Radar
                key={result.forwarder}
                name={result.forwarder}
                dataKey={result.forwarder}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.5}
              />
            ))}
            
            <Legend formatter={(value) => value} />
            <Tooltip 
              formatter={(value: any) => [`${value}%`, '']} 
              contentStyle={{ background: '#0A1A2F', border: '1px solid #00FFD1', borderRadius: '0.375rem' }}
              labelFormatter={(label) => `Dimension: ${label}`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MultidimensionalChart;
