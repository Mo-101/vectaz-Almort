
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForwarderScore } from '../types';

interface CalculatedMetricsTableProps {
  results: ForwarderScore[];
}

const CalculatedMetricsTable: React.FC<CalculatedMetricsTableProps> = ({ results }) => {
  // Find the strengths and weaknesses of the top forwarder
  const topForwarder = results[0];
  const getTopDimension = () => {
    const scores = {
      cost: topForwarder.costPerformance,
      time: topForwarder.timePerformance,
      reliability: topForwarder.reliabilityPerformance
    };
    return Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };
  
  const getWeakDimension = () => {
    const scores = {
      cost: topForwarder.costPerformance,
      time: topForwarder.timePerformance,
      reliability: topForwarder.reliabilityPerformance
    };
    return Object.entries(scores).reduce((a, b) => a[1] < b[1] ? a : b)[0];
  };

  const topDimension = getTopDimension();
  const weakDimension = getWeakDimension();
  
  // Calculate score difference between top forwarders
  const scoreDifference = results.length > 1 
    ? ((topForwarder.score - results[1].score) * 100).toFixed(1) 
    : "N/A";

  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-sm sm:text-base md:text-lg text-[#00FFD1]">Calculated Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 overflow-x-auto">
        <table className="w-full border-collapse text-gray-300 text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#00FFD1]/20">
              <th className="text-left py-2">Rank</th>
              <th className="text-left py-2">Forwarder</th>
              <th className="text-left py-2">DeepScore™</th>
              <th className="text-left py-2">Cost</th>
              <th className="text-left py-2">Time</th>
              <th className="text-left py-2">Reliability</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className={`border-b border-[#00FFD1]/10 hover:bg-[#00FFD1]/5 ${index === 0 ? 'bg-[#00FFD1]/10' : ''}`}>
                <td className="py-2 px-1">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${index === 0 ? 'bg-[#00FFD1] text-black font-bold' : 'bg-gray-800 text-gray-200'}`}>
                    {index + 1}
                  </span>
                </td>
                <td className="py-2 font-medium text-white">
                  {result.forwarder}
                  {index === 0 && <span className="ml-2 text-[#00FFD1] text-xs font-bold">RECOMMENDED</span>}
                </td>
                <td className="py-2 font-semibold">
                  <div className="flex items-center">
                    <span className={index === 0 ? 'text-[#00FFD1]' : ''}>{(result.score * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center">
                    <div className="w-12 bg-gray-700 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${index === 0 ? 'bg-[#00FFD1]' : 'bg-blue-500'}`} 
                        style={{ width: `${result.costPerformance * 100}%` }}
                      ></div>
                    </div>
                    {(result.costPerformance * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center">
                    <div className="w-12 bg-gray-700 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${index === 0 ? 'bg-[#00FFD1]' : 'bg-blue-500'}`} 
                        style={{ width: `${result.timePerformance * 100}%` }}
                      ></div>
                    </div>
                    {(result.timePerformance * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center">
                    <div className="w-12 bg-gray-700 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${index === 0 ? 'bg-[#00FFD1]' : 'bg-blue-500'}`} 
                        style={{ width: `${result.reliabilityPerformance * 100}%` }}
                      ></div>
                    </div>
                    {(result.reliabilityPerformance * 100).toFixed(1)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-6 p-4 bg-[#0A1A2F] border border-[#00FFD1]/10 rounded-md text-sm">
          <h4 className="font-medium text-[#00FFD1] mb-3">Mathematical Analysis Summary:</h4>
          <div className="space-y-3 text-gray-300">
            <p>
              <span className="font-semibold text-white">{topForwarder.forwarder}</span> achieves the highest DeepScore™ of <span className="font-semibold text-[#00FFD1]">{(topForwarder.score * 100).toFixed(1)}%</span>, 
              derived from our Neutrosophic AHP-TOPSIS hybrid model calculations.
            </p>
            
            {results.length > 1 && (
              <p>
                The top performer mathematically outscores the second-ranked option 
                (<span className="text-gray-200">{results[1].forwarder}</span>) by <span className="font-semibold text-[#00FFD1]">{scoreDifference}%</span> percentage points,
                with particular strength in <span className="font-semibold text-[#00FFD1]">{topDimension}</span> performance metrics.
              </p>
            )}
            
            <p>
              <span className="font-semibold text-white">{topForwarder.forwarder}</span>'s mathematical performance breakdown:
              <ul className="list-disc list-inside mt-1 ml-2">
                <li className={topDimension === 'cost' ? 'text-[#00FFD1]' : ''}>
                  <span className="font-medium">Cost efficiency:</span> {(topForwarder.costPerformance * 100).toFixed(1)}% 
                  {topDimension === 'cost' ? ' (strongest attribute)' : ''}
                </li>
                <li className={topDimension === 'time' ? 'text-[#00FFD1]' : ''}>
                  <span className="font-medium">Time performance:</span> {(topForwarder.timePerformance * 100).toFixed(1)}% 
                  {topDimension === 'time' ? ' (strongest attribute)' : ''}
                </li>
                <li className={topDimension === 'reliability' ? 'text-[#00FFD1]' : ''}>
                  <span className="font-medium">Reliability:</span> {(topForwarder.reliabilityPerformance * 100).toFixed(1)}% 
                  {topDimension === 'reliability' ? ' (strongest attribute)' : ''}
                </li>
              </ul>
            </p>
            
            <p className="text-xs text-gray-400 mt-2">
              This analysis uses the Neutrosophic AHP for preference weighting (CR≈0.017), combined with TOPSIS for multi-criteria ranking and Grey Relational Analysis for uncertainty handling.
              {weakDimension && <span> Consider supplementary options for shipments where <span className="font-medium">{weakDimension}</span> is the highest priority.</span>}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatedMetricsTable;
