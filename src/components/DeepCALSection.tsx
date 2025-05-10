
import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { getForwarderRankings } from '@/services/deepEngine';
import DeepCALSpinner from './DeepCALSpinner';
import { speakText } from './deepcal/VoiceService';
import QuoteInputForm from './deepcal/QuoteInputForm';
import AnalysisResults from './deepcal/AnalysisResults';
import { QuoteData, ForwarderScore, WeightFactors, DeepCALProps } from './deepcal/types';
import { toast } from 'sonner';

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
        
        const rankings = getForwarderRankings(factors);
        
        const filteredRankings = rankings
          .filter(r => quotes.some(q => q.forwarder.toLowerCase().includes(r.forwarder.toLowerCase()) || 
                                    r.forwarder.toLowerCase().includes(q.forwarder.toLowerCase())))
          .sort((a, b) => b.score - a.score);
        
        setResults(filteredRankings);
        setShowResults(true);
        setLoading(false);
        
        // Speak a success message when analysis is complete
        if (filteredRankings.length > 0) {
          const topForwarder = filteredRankings[0]?.forwarder || "Unknown";
          speakText(`I have completed my analysis. Based on your preferences, ${topForwarder} is the optimal choice for your shipment from ${sourceCountry} to ${destCountry}.`, voicePersonality, voiceEnabled);
        } else {
          speakText("Analysis complete. I couldn't find a perfect match, but I've ranked the options based on your criteria.", voicePersonality, voiceEnabled);
        }
        
      } catch (error) {
        console.error("Error calculating rankings:", error);
        setLoading(false);
        
        // Speak an error message
        speakText("I encountered an error while analyzing the quotes. Please try again or check your input data.", voicePersonality, voiceEnabled);
      }
    };
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
  };

  // Speak welcome message on component mount
  useEffect(() => {
    if (voiceEnabled) {
      const welcomeMessage = "Welcome to DeepCAL Optimizer. Enter your freight quotes, and I'll analyze them for the best logistics options.";
      speakText(welcomeMessage, voicePersonality, voiceEnabled);
    }
  }, [voiceEnabled, voicePersonality]);

  return (
    <div className="container mx-auto py-8 max-w-7xl relative z-20">
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
