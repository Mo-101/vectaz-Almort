
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ForwarderScore } from '../types';

interface ScoreComparisonChartProps {
  results: ForwarderScore[];
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ results }) => {
  // Transform data to show scores as percentages
  const chartData = results.map(result => ({
    forwarder: result.forwarder,
    score: Math.round(result.score * 100),
    position: results.indexOf(result) + 1
  })).sort((a, b) => b.score - a.score);

  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-sm sm:text-base md:text-lg text-[#00FFD1]">ForwarderScore™ Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 h-64 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tickFormatter={(value) => `${value}%`} 
              stroke="#94A3B8"
              ticks={[0, 25, 50, 75, 100]} 
            />
            <YAxis 
              dataKey="forwarder" 
              type="category" 
              width={100} 
              stroke="#94A3B8" 
              tickMargin={5}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'DeepScore™']}
              labelFormatter={(label) => `Forwarder: ${label}`}
              contentStyle={{ background: '#0A1A2F', border: '1px solid #00FFD1', borderRadius: '0.375rem', padding: '8px' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
            <Bar 
              dataKey="score" 
              name="DeepScore™" 
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#00FFD1' : `rgba(0, 255, 209, ${0.8 - (index * 0.2)})`} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ScoreComparisonChart;
