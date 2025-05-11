
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Map, AlertTriangle } from 'lucide-react';

interface SymbolicRecommendationsProps {
  symbolicResults: {
    topChoice?: string;
    confidence?: number;
    recommendedContainer?: string;
    routeDistanceKm?: number;
    insights?: Array<{ name: string; issue: string }>;
    allScores?: number[];
  };
}

const SymbolicRecommendations: React.FC<SymbolicRecommendationsProps> = ({ symbolicResults }) => {
  if (!symbolicResults) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[#00FFD1] flex items-center gap-2">
        <Package className="h-5 w-5" />
        Symbolic Engine Recommendations
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {symbolicResults.recommendedContainer && (
          <div className="bg-[#0A1A2F]/50 border border-[#00FFD1]/20 p-4 rounded-md">
            <div className="text-sm text-gray-400">Recommended Container</div>
            <div className="mt-1 text-lg font-medium">
              {symbolicResults.recommendedContainer}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Based on weight and volume analysis
            </div>
          </div>
        )}
        
        {symbolicResults.routeDistanceKm && (
          <div className="bg-[#0A1A2F]/50 border border-[#00FFD1]/20 p-4 rounded-md">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-[#00FFD1]" />
              <div className="text-sm text-gray-400">Route Distance</div>
            </div>
            <div className="mt-1 text-lg font-medium">
              {symbolicResults.routeDistanceKm.toLocaleString()} km
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Great-circle distance calculation
            </div>
          </div>
        )}
        
        {symbolicResults.topChoice && (
          <div className="bg-[#0A1A2F]/50 border border-[#00FFD1]/20 p-4 rounded-md">
            <div className="text-sm text-gray-400">Recommended Forwarder</div>
            <div className="mt-1 text-lg font-medium">
              {symbolicResults.topChoice}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {Math.round((symbolicResults.confidence || 0) * 100)}% confidence score
            </div>
          </div>
        )}
      </div>
      
      {symbolicResults.insights && symbolicResults.insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="font-medium text-amber-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" />
            Risk Analysis
          </h4>
          <div className="space-y-2">
            {symbolicResults.insights.map((insight, idx) => (
              <div 
                key={idx} 
                className="bg-amber-900/20 border border-amber-800/50 rounded-md p-3 text-sm"
              >
                <span className="font-medium text-amber-400">{insight.name}:</span>{' '}
                <span className="text-amber-100">{insight.issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolicRecommendations;
