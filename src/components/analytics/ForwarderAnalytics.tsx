import React from 'react';
import { ForwarderPerformance, CarrierPerformance } from '@/types/deeptrack';
import ForwarderRankingTable from './forwarder/ForwarderRankingTable';
import SymbolicRankingInsights from './symbolic/SymbolicRankingInsights';

interface ForwarderAnalyticsProps {
  forwarders: ForwarderPerformance[];
  carriers: CarrierPerformance[];
  symbolicResults?: any;
}

const ForwarderAnalytics: React.FC<ForwarderAnalyticsProps> = ({ 
  forwarders, 
  carriers,
  symbolicResults
}) => {
  return (
    <div className="space-y-6">
      {/* Symbolic ranking insights */}
      {symbolicResults && (
        <div className="cyber-panel rounded-md p-4 mb-4">
          <SymbolicRankingInsights symbolicResults={symbolicResults} />
        </div>
      )}

      {/* Forwarder ranking table */}
      <div className="cyber-panel rounded-md">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-medium text-[#00FFD1]">Forwarder Rankings</h2>
          <p className="text-sm text-gray-400 mt-1">
            Performance comparison across all forwarders
          </p>
        </div>
        <div className="p-4">
          <ForwarderRankingTable 
            forwarders={forwarders} 
            symbolicInsights={symbolicResults?.insights || []} 
          />
        </div>
      </div>
      
      {/* Additional forwarder analytics components would go here */}
    </div>
  );
};

export default ForwarderAnalytics;
