
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AlertTriangle, Map, Package } from 'lucide-react';

interface SymbolicSummaryPanelProps {
  symbolicResults: {
    topChoice?: string;
    confidence?: number;
    recommendedContainer?: string;
    routeDistanceKm?: number;
    insights?: Array<{ name: string; issue: string }>;
  };
}

const SymbolicSummaryPanel: React.FC<SymbolicSummaryPanelProps> = ({ symbolicResults }) => {
  if (!symbolicResults) return null;

  const { topChoice, confidence, recommendedContainer, routeDistanceKm, insights } = symbolicResults;
  
  return (
    <Card className="border border-[#00FFD1]/20 bg-gradient-to-br from-[#0A1A2F]/80 to-[#0c2b47]/80">
      <CardHeader className="border-b border-[#00FFD1]/10 pb-2">
        <CardTitle className="text-[#00FFD1] flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Symbolic Engine Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topChoice && (
            <div className="bg-[#0A1A2F]/50 p-3 rounded-md border border-[#00FFD1]/10">
              <div className="text-sm text-gray-400">Recommended Provider</div>
              <div className="text-lg font-medium mt-1">{topChoice}</div>
              {confidence && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs text-gray-400">Confidence</div>
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00FFD1]" 
                      style={{ width: `${Math.round(confidence * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs">{Math.round(confidence * 100)}%</div>
                </div>
              )}
            </div>
          )}
          
          {recommendedContainer && (
            <div className="bg-[#0A1A2F]/50 p-3 rounded-md border border-[#00FFD1]/10">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Package className="h-4 w-4 text-[#00FFD1]" />
                <div>Container Analysis</div>
              </div>
              <div className="mt-1">
                <div className="text-lg font-medium">{recommendedContainer}</div>
                <div className="text-xs text-gray-400 mt-1">Based on cargo profile analysis</div>
              </div>
            </div>
          )}
          
          {routeDistanceKm && (
            <div className="bg-[#0A1A2F]/50 p-3 rounded-md border border-[#00FFD1]/10">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Map className="h-4 w-4 text-[#00FFD1]" />
                <div>Route Calculation</div>
              </div>
              <div className="mt-1">
                <div className="text-lg font-medium">{routeDistanceKm.toLocaleString()} km</div>
                <div className="text-xs text-gray-400 mt-1">Haversine distance</div>
              </div>
            </div>
          )}
        </div>
        
        {insights && insights.length > 0 && (
          <div className="mt-4 border-t border-gray-700 pt-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <div className="font-medium">Risk Insights</div>
            </div>
            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <div 
                  key={idx}
                  className="bg-amber-900/20 border border-amber-800/30 rounded-md p-2 text-sm"
                >
                  <span className="font-medium text-amber-400">{insight.name}:</span>{' '}
                  <span className="text-amber-100">{insight.issue}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SymbolicSummaryPanel;
