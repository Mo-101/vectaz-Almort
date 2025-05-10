
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForwarderScore } from '../types';

interface CalculatedMetricsTableProps {
  results: ForwarderScore[];
}

const CalculatedMetricsTable: React.FC<CalculatedMetricsTableProps> = ({ results }) => {
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
                <td className="py-2 font-bold">{index + 1}</td>
                <td className="py-2 font-medium text-white whitespace-nowrap">{result.forwarder}</td>
                <td className="py-2 font-semibold">{(result.score * 100).toFixed(1)}%</td>
                <td className="py-2">{(result.costPerformance * 100).toFixed(1)}%</td>
                <td className="py-2">{(result.timePerformance * 100).toFixed(1)}%</td>
                <td className="py-2">{(result.reliabilityPerformance * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 p-3 bg-[#0A1A2F] border border-[#00FFD1]/10 rounded-md text-sm">
          <h4 className="font-medium text-[#00FFD1] mb-2">Analysis Summary:</h4>
          <p className="text-gray-300 mb-2">
            This analysis compares {results.length} forwarders across three key dimensions: cost efficiency, time performance, and reliability.
          </p>
          {results.length > 1 && (
            <p className="text-gray-300 mb-2">
              The top performer ({results[0].forwarder}) outscores the second-ranked option 
              ({results[1].forwarder}) by {((results[0].score - results[1].score) * 100).toFixed(1)} percentage points,
              with particular strength in {
                results[0].costPerformance > results[0].timePerformance && results[0].costPerformance > results[0].reliabilityPerformance
                  ? 'cost efficiency'
                  : results[0].timePerformance > results[0].costPerformance && results[0].timePerformance > results[0].reliabilityPerformance
                    ? 'time performance'
                    : 'reliability'
              }.
            </p>
          )}
          <p className="text-gray-300">
            All metrics are normalized on a 0-100% scale, with higher values indicating better performance across all dimensions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatedMetricsTable;
