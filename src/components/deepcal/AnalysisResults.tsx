
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeResultTab, setActiveResultTab] = React.useState<string>('recommendation');
  
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
          <Tabs defaultValue={activeResultTab} onValueChange={setActiveResultTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#0A1A2F]/60 border border-[#00FFD1]/20">
              <TabsTrigger value="recommendation" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">Recommendation</TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">Comparison</TabsTrigger>
              <TabsTrigger value="detailed" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="mathematics" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">Mathematics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommendation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TopRecommendation topResult={results[0]} />
                <DecisionExplanation 
                  topResult={results[0]} 
                  source={source} 
                  destination={destination} 
                  weightFactors={weightFactors} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="comparison">
              <div className="space-y-8">
                <ScoreComparisonChart results={results} />
                <MultidimensionalChart results={results} />
              </div>
            </TabsContent>
            
            <TabsContent value="detailed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CalculatedMetricsTable results={results} />
                <MethodologyExplanation 
                  weightFactors={weightFactors} 
                  shipmentCount={shipmentCount} 
                />
              </div>
            </TabsContent>

            <TabsContent value="mathematics">
              <MathematicalExplanation 
                results={results}
                weightFactors={weightFactors}
                shipmentCount={shipmentCount}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
