
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { ForwarderScore } from '../types';

interface MultidimensionalChartProps {
  data: ForwarderScore[];
}

const MultidimensionalChart: React.FC<MultidimensionalChartProps> = ({ data }) => {
  // Transform the data for the radar chart
  const chartData = [
    {
      subject: 'Cost',
      ...data.reduce((acc, item) => {
        acc[item.forwarder] = item.costPerformance;
        return acc;
      }, {} as Record<string, number>)
    },
    {
      subject: 'Time',
      ...data.reduce((acc, item) => {
        acc[item.forwarder] = item.timePerformance;
        return acc;
      }, {} as Record<string, number>)
    },
    {
      subject: 'Reliability',
      ...data.reduce((acc, item) => {
        acc[item.forwarder] = item.reliabilityPerformance;
        return acc;
      }, {} as Record<string, number>)
    }
  ];

  // Generate unique colors for each forwarder
  const getColor = (index: number) => {
    const colors = ['#00FFD1', '#00A3FF', '#FFC700', '#FF6B00', '#FF006B'];
    return colors[index % colors.length];
  };

  // Fix for the ticks issue - create proper tick items
  const ticks = [0.2, 0.4, 0.6, 0.8, 1].map(value => ({
    value,
    coordinate: value
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#444" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#eee' }} />
          <PolarRadiusAxis tickCount={5} tick={ticks} />
          
          {data.map((item, index) => (
            <Radar
              key={item.forwarder}
              name={item.forwarder}
              dataKey={item.forwarder}
              stroke={getColor(index)}
              fill={getColor(index)}
              fillOpacity={0.3}
            />
          ))}
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultidimensionalChart;
