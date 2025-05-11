
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { runNeuroSymbolicCycle, SymbolicInput, SymbolicResult } from '@/symbolic-engine/orchestrator/symbolicOrchestrator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Beaker } from 'lucide-react';

const DEFAULT_INPUT: SymbolicInput = {
  decisionMatrix: [
    [0.85, 0.70, 0.90], // DHL
    [0.75, 0.85, 0.80], // FedEx
    [0.90, 0.60, 0.75], // Kuehne+Nagel
    [0.80, 0.75, 0.70]  // DSV
  ],
  weights: [0.4, 0.3, 0.3],
  criteriaTypes: ['benefit', 'benefit', 'benefit'],
  alternatives: ['DHL', 'FedEx', 'Kuehne+Nagel', 'DSV'],
  forwarders: [
    { name: 'DHL', reliability: 0.84, delayRate: 0.12 },
    { name: 'FedEx', reliability: 0.76, delayRate: 0.18 },
    { name: 'Kuehne+Nagel', reliability: 0.79, delayRate: 0.22 },
    { name: 'DSV', reliability: 0.62, delayRate: 0.34 }
  ],
  weight: 14500,
  volume: 45,
  originLat: 1.3521,
  originLng: 103.8198,
  destLat: -33.8688,
  destLng: 151.2093
};

interface InspectSymbolicEngineProps {
  onClose?: () => void;
}

const InspectSymbolicEngine: React.FC<InspectSymbolicEngineProps> = ({ onClose }) => {
  const [result, setResult] = useState<SymbolicResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const runEngine = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const engineResult = runNeuroSymbolicCycle(DEFAULT_INPUT);
        setResult(engineResult);
        console.log('Symbolic Engine Result:', engineResult);
      } catch (error) {
        console.error('Symbolic Engine Error:', error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };
  
  return (
    <Card className="border border-[#00FFD1]/20 bg-[#0A1A2F]/80 backdrop-blur-md text-white">
      <CardHeader className="border-b border-[#00FFD1]/10">
        <CardTitle className="flex items-center gap-2 text-[#00FFD1]">
          <Beaker className="h-5 w-5" />
          Symbolic Engine Inspector
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">DeepCAL Symbolic Core</h3>
              <p className="text-sm text-gray-400 mt-1">
                Test the neuro-symbolic engine with sample data
              </p>
            </div>
            <Button
              onClick={runEngine}
              disabled={loading}
              className="bg-[#00FFD1]/20 hover:bg-[#00FFD1]/30 text-[#00FFD1] border border-[#00FFD1]/30"
            >
              {loading ? 'Running...' : 'Run Engine Test'}
            </Button>
          </div>

          {result && (
            <div className="space-y-4 mt-6">
              <div className="p-4 rounded-md bg-[#0A1A2F]/50 border border-[#00FFD1]/10">
                <h4 className="font-medium mb-2 text-[#00FFD1]">Top Recommendation</h4>
                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold">{result.topChoice}</div>
                  <div className="text-sm bg-[#00FFD1]/20 px-2 py-1 rounded">
                    {Math.round(result.confidence * 100)}% confidence
                  </div>
                </div>
              </div>

              {result.recommendedContainer && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-md bg-[#0A1A2F]/50 border border-[#00FFD1]/10">
                    <h4 className="font-medium mb-2 text-[#00FFD1]">Container</h4>
                    <div>{result.recommendedContainer}</div>
                  </div>

                  {result.routeDistanceKm && (
                    <div className="p-4 rounded-md bg-[#0A1A2F]/50 border border-[#00FFD1]/10">
                      <h4 className="font-medium mb-2 text-[#00FFD1]">Route Distance</h4>
                      <div>{result.routeDistanceKm} km</div>
                    </div>
                  )}
                </div>
              )}

              {result.insights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#00FFD1]">Insights</h4>
                  {result.insights.map((insight, idx) => (
                    <Alert key={idx} className="bg-amber-900/20 border-amber-800/50 text-amber-100">
                      <AlertTitle className="text-amber-400">{insight.name}</AlertTitle>
                      <AlertDescription>{insight.issue}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
              
              <div className="p-4 rounded-md bg-[#0A1A2F]/50 border border-[#00FFD1]/10">
                <h4 className="font-medium mb-2 text-[#00FFD1]">All Alternative Scores</h4>
                <div className="space-y-2">
                  {result.allScores.map((score, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>{DEFAULT_INPUT.alternatives[idx]}</div>
                      <div className="w-1/2 h-2 bg-[#0A1A2F] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00FFD1]" 
                          style={{ width: `${Math.round(score * 100)}%` }}
                        />
                      </div>
                      <div className="text-sm">{Math.round(score * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {onClose && (
            <div className="flex justify-end mt-6">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              >
                Close Inspector
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectSymbolicEngine;
