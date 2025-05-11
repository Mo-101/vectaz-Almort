
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface SymbolicRankingInsightsProps {
  symbolicResults: {
    topChoice?: string;
    confidence?: number;
    allScores?: number[];
  };
}

const SymbolicRankingInsights: React.FC<SymbolicRankingInsightsProps> = ({ symbolicResults }) => {
  if (!symbolicResults || !symbolicResults.allScores) return null;
  
  // Create chart data from allScores
  const chartData = symbolicResults.allScores.map((score, index) => ({
    name: `Option ${index + 1}`,
    score: Math.round(score * 100)
  }));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-[#00FFD1]">Symbolic AHP-TOPSIS Analysis</h3>
        <p className="text-sm text-gray-400 mt-1">
          Multi-criteria decision analysis using Neutrosophic-Grey AHP-TOPSIS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0A1A2F]/50 border border-[#00FFD1]/20 p-4 rounded-md">
          <div className="text-sm text-gray-400">Top Choice</div>
          <div className="mt-1 text-xl font-medium">
            {symbolicResults.topChoice || 'Not available'}
          </div>
          {symbolicResults.confidence && (
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00FFD1]" 
                  style={{ width: `${Math.round(symbolicResults.confidence * 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {Math.round(symbolicResults.confidence * 100)}% confidence
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-[#0A1A2F]/50 border border-[#00FFD1]/20 p-4 rounded-md">
          <div className="text-sm text-gray-400 mb-2">Decision Analysis</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Score']}
                  contentStyle={{ background: '#0A1A2F', border: '1px solid rgba(0, 255, 209, 0.2)' }}
                />
                <Bar dataKey="score" fill="#00FFD1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 border-t border-gray-700 pt-3 mt-3">
        <p>The Symbolic Engine uses a combination of AHP weight calculation and TOPSIS ranking with Grey Relational Analysis to handle uncertainty and produce more robust decisions.</p>
      </div>
    </div>
  );
};

export default SymbolicRankingInsights;
