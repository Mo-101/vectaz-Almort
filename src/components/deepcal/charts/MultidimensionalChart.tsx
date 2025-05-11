
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { ForwarderScore } from '../types';

interface MultidimensionalChartProps {
  data: ForwarderScore[];
}

const MultidimensionalChart: React.FC<MultidimensionalChartProps> = ({ data }) => {
  // Guard clause for undefined or empty data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded">
        <p className="text-gray-300">No data available for radar analysis</p>
      </div>
    );
  }
  
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

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#444" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#eee' }} />
          <PolarRadiusAxis tickCount={5} domain={[0, 1]} tick={{ fill: '#eee' }} />
          
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
