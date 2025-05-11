
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ForwarderScore, WeightFactors } from './types';
import TopRecommendation from './results/TopRecommendation';
import DecisionExplanation from './results/DecisionExplanation';
import ScoreComparisonChart from './charts/ScoreComparisonChart';
import MultidimensionalChart from './charts/MultidimensionalChart';
import CalculatedMetricsTable from './results/CalculatedMetricsTable';
import MethodologyExplanation from './results/MethodologyExplanation';
import MathematicalExplanation from './results/MathematicalExplanation';

interface AnalysisResultsProps {
  results: ForwarderScore[];
  source: string;
  destination: string;
  weightKg: number;
  mode: string;
  weightFactors: WeightFactors;
  shipmentCount: number;
  onNewAnalysis: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  results, 
  source, 
  destination, 
  weightKg, 
  mode, 
  weightFactors,
  shipmentCount,
  onNewAnalysis 
}) => {
  const [showMathExplanation, setShowMathExplanation] = useState<boolean>(false);
  
  // Show mathematical explanation after a delay to simulate calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMathExplanation(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="space-y-8">
      <Card className="border border-[#00FFD1]/20 bg-[#0A1A2F]/80 backdrop-blur-md text-white shadow-[0_0_15px_rgba(0,255,209,0.1)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-[#00FFD1]">DeepCAL™ Analysis Results</CardTitle>
            <CardDescription className="text-gray-300">
              {source} to {destination} | {weightKg} kg | {mode}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={onNewAnalysis}
            className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
          >
            New Analysis
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Top Recommendation Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TopRecommendation topResult={results[0]} />
              <DecisionExplanation 
                topResult={results[0]} 
                source={source} 
                destination={destination} 
                weightFactors={weightFactors} 
              />
            </div>
            
            {/* Charts Section */}
            <div className="space-y-8">
              <h3 className="text-xl font-medium text-[#00FFD1]">Performance Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ScoreComparisonChart results={results} />
                <MultidimensionalChart data={results} />
              </div>
            </div>
            
            {/* Detailed Analysis Section */}
            <div className="space-y-8">
              <h3 className="text-xl font-medium text-[#00FFD1]">Detailed Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CalculatedMetricsTable results={results} />
                <MethodologyExplanation 
                  weightFactors={weightFactors} 
                  shipmentCount={shipmentCount} 
                />
              </div>
            </div>
            
            {/* Mathematical Foundation Section */}
            {showMathExplanation ? (
              <div className="mt-8">
                <h3 className="text-xl font-medium text-[#00FFD1]">Mathematical Foundation</h3>
                <MathematicalExplanation 
                  results={results}
                  weightFactors={weightFactors}
                  shipmentCount={shipmentCount}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 mt-4 border border-[#00FFD1]/10 rounded bg-[#0A1A2F]/40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFD1] mb-4"></div>
                <p className="text-[#00FFD1]">Calculating mathematical foundations...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
