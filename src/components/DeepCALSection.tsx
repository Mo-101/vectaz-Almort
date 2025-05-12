import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { evaluateForwarders, getSampleForwarderData } from '@/utils/deepCalEngine'; 
import DeepCALSpinner from './DeepCALSpinner';
import QuoteInputForm from './deepcal/QuoteInputForm';
import AnalysisResults from './deepcal/AnalysisResults';
import { QuoteData, ForwarderScore, WeightFactors, DeepCALProps } from './deepcal/types';
import { toast } from 'sonner';
import { traceCalculation } from '@/utils/debugCalculations';
import DebugPanel from './deepcal/debug/DebugPanel';
import { Button } from './ui/button';
import { Bug } from 'lucide-react';

const DeepCALSection: React.FC<DeepCALProps> = ({ 
  voicePersonality = 'sassy',
  voiceEnabled = true 
}) => {
  const { shipmentData } = useBaseDataStore();
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number>(0);
  const [mode, setMode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ForwarderScore[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  const [weightFactors, setWeightFactors] = useState<WeightFactors>({
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  });
  const [processingStage, setProcessingStage] = useState<string>('');

  const analyzeQuotes = (
    quotes: QuoteData[], 
    sourceCountry: string, 
    destCountry: string, 
    shipmentWeight: number, 
    shipmentMode: string,
    factors: WeightFactors
  ) => {
    // Use traceCalculation to log the input for debugging
    traceCalculation('User Input', {
      quotes, sourceCountry, destCountry, shipmentWeight, shipmentMode, factors
    });
    
    setQuotes(quotes);
    setSource(sourceCountry);
    setDestination(destCountry);
    setWeightKg(shipmentWeight);
    setMode(shipmentMode);
    setWeightFactors(factors);
    setLoading(true);
    
    // Create a dynamic processing sequence to show the multi-step analysis
    const stages = [
      'Initializing deep analysis engine...',
      'Processing historical shipment data...',
      'Calculating neutrosophic parameters...',
      'Running TOPSIS with Grey factors...',
      'Computing mathematical proofs...',
      'Finalizing recommendation...'
    ];
    
    // Show each stage with a small delay to visualize the process
    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        setProcessingStage(stages[stageIndex]);
        stageIndex++;
      } else {
        clearInterval(stageInterval);
        completeAnalysis();
      }
    }, 500);
    
    // Final processing after showing all stages
    const completeAnalysis = () => {
      try {
        toast.success('Deep analysis completed!', {
          description: `Based on ${shipmentData.length} historical records and neutrosophic calculations`,
          duration: 3000,
        });
        
        // Convert QuoteData to ForwarderData for engine calculation
        const forwarderInputData = quotes.map(quote => {
          // Convert quote prices to normalized cost scores (higher is better)
          const quotePrice = parseFloat(quote.price);
          const maxPrice = Math.max(...quotes.map(q => parseFloat(q.price)));
          const minPrice = Math.min(...quotes.map(q => parseFloat(q.price)));
          const range = maxPrice - minPrice;
          
          // Normalize cost score (invert so lower price = higher score)
          const costScore = range === 0 ? 0.5 : 1 - ((quotePrice - minPrice) / range);
          
          // Convert transit days to normalized time scores
          const transitDays = parseInt(quote.transitDays, 10);
          const maxDays = Math.max(...quotes.map(q => parseInt(q.transitDays, 10)));
          const minDays = Math.min(...quotes.map(q => parseInt(q.transitDays, 10)));
          const daysRange = maxDays - minDays;
          
          // Normalize time score (invert so fewer days = higher score)
          const timeScore = daysRange === 0 ? 0.5 : 1 - ((transitDays - minDays) / daysRange);
          
          // Use the reliability rating directly as it's already on a 0-1 scale
          const reliabilityScore = parseFloat(quote.reliability) / 100;
          
          return {
            forwarder: quote.forwarder,
            costScore,
            timeScore,
            reliabilityScore
          };
        });

        // Log before ranking calculation
        traceCalculation('Before Ranking Calculation', { 
          forwarderInputData,
          factors
        });
        
        // Use our real engine to calculate rankings
        const rankings = evaluateForwarders(
          forwarderInputData.length > 0 ? forwarderInputData : getSampleForwarderData(),
          factors
        );
        
        // Log after ranking calculation
        traceCalculation('After Ranking Calculation', { factors }, rankings);
        
        setResults(rankings);
        setShowResults(true);
        setLoading(false);
        
      } catch (error) {
        console.error("Error calculating rankings:", error);
        setLoading(false);
        
        toast.error("Analysis failed", {
          description: "There was an error analyzing the quotes. Please try again."
        });
      }
    };
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
  };
  
  const toggleDebugPanel = () => {
    setShowDebugPanel(!showDebugPanel);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl relative z-20">
      <Button 
        className="absolute top-4 right-4 bg-[#00FFD1]/10 border border-[#00FFD1]/30 hover:bg-[#00FFD1]/20 text-[#00FFD1]"
        size="sm"
        variant="outline"
        onClick={toggleDebugPanel}
      >
        <Bug className="w-4 h-4 mr-2" /> 
        Debug Panel
      </Button>
      
      {showDebugPanel && <DebugPanel onClose={() => setShowDebugPanel(false)} />}
      
      {!showResults ? (
        <QuoteInputForm 
          onAnalyze={analyzeQuotes}
          loading={loading}
        />
      ) : (
        <AnalysisResults 
          results={results}
          source={source}
          destination={destination}
          weightKg={weightKg}
          mode={mode}
          weightFactors={weightFactors}
          shipmentCount={shipmentData.length}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
      
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="text-center p-8 rounded-lg bg-[#0A1A2F]/80 border border-[#00FFD1]/20 shadow-lg max-w-md">
            <DeepCALSpinner />
            <h3 className="text-[#00FFD1] text-xl font-semibold mt-4">DeepCAL™ Engine</h3>
            <p className="text-white/80 mt-2">{processingStage}</p>
            <div className="mt-4 h-2 bg-[#0A1A2F] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-[#00FFD1] animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepCALSection;
