
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
  const getForwarderColor = (index: number) => {
    const colors = [
      '#00FFD1', // Primary color for top forwarder
      '#3b82f6', // Blue
      '#a855f7', // Purple
      '#ec4899', // Pink
      '#f97316', // Orange
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-sm sm:text-base md:text-lg text-[#00FFD1]">Multi-Dimensional Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 h-64 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#1E293B" />
            <PolarAngleAxis dataKey="dimension" stroke="#94A3B8" />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tickFormatter={(value) => `${value}%`} 
              stroke="#94A3B8"
              ticks={[0, 25, 50, 75, 100]} 
            />
            
            {results.map((result, index) => (
              <Radar
                key={result.forwarder}
                name={result.forwarder}
                dataKey={result.forwarder}
                stroke={getForwarderColor(index)}
                fill={getForwarderColor(index)}
                fillOpacity={index === 0 ? 0.6 : 0.4}
                strokeWidth={index === 0 ? 2 : 1}
              />
            ))}
            
            <Legend 
              formatter={(value) => value} 
              iconSize={10}
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
            <Tooltip 
              formatter={(value: any) => [`${value}%`, '']} 
              contentStyle={{ 
                background: '#0A1A2F', 
                border: '1px solid #00FFD1', 
                borderRadius: '0.375rem',
                padding: '8px'
              }}
              labelFormatter={(label) => `Dimension: ${label}`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MultidimensionalChart;
