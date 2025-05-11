
import React from 'react';
import { ForwarderScore } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface DecisionExplanationProps {
  topResult: ForwarderScore;
  source: string;
  destination: string;
  weightFactors: {
    cost: number;
    time: number;
    reliability: number;
  };
}

const DecisionExplanation: React.FC<DecisionExplanationProps> = ({ 
  topResult, 
  source, 
  destination, 
  weightFactors 
}) => {
  // Helper function to interpret neutrosophic values with text description
  const interpretValue = (value: number): string => {
    if (value >= 0.8) return "Excellent";
    if (value >= 0.6) return "Good";
    if (value >= 0.4) return "Moderate";
    if (value >= 0.2) return "Fair";
    return "Poor";
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-[#00FFD1]">Decision Explanation</h3>
      <div className="p-4 bg-[#0A1A2F]/60 border border-[#00FFD1]/10 rounded-lg text-xs sm:text-sm space-y-3 text-gray-300">
        <p>
          <strong className="text-white">{topResult?.forwarder}</strong> is recommended as the optimal choice for your shipment based on a comprehensive analysis that considers cost, time efficiency, and reliability factors.
        </p>
        <p>
          This forwarder demonstrates excellent {topResult?.reliabilityPerformance > 0.8 ? "reliability" : "cost-effectiveness"} on the {source}-{destination} route, with historical data showing consistently strong performance across similar shipments.
        </p>
        <p>
          Your preference weight of {Math.round(weightFactors.cost * 100)}% for cost, {Math.round(weightFactors.time * 100)}% for time, and {Math.round(weightFactors.reliability * 100)}% for reliability was applied to the calculation.
        </p>
        
        {topResult?.neutrosophic && (
          <>
            <div className="border-t border-[#00FFD1]/10 my-2 pt-2">
              <h4 className="font-medium text-white mb-2">Neutrosophic Evaluation</h4>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-2 bg-green-900/20 border border-green-500/30 rounded-md">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mb-1" />
                        <span className="text-xs text-green-400">Truth</span>
                        <span className="text-sm font-medium text-white">{topResult.neutrosophic.T.toFixed(2)}</span>
                        <span className="text-xs text-gray-400">{interpretValue(topResult.neutrosophic.T)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/90 border-green-500/30 text-white">
                      <p className="text-xs">Confidence from on-time delivery performance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-2 bg-yellow-900/20 border border-yellow-500/30 rounded-md">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mb-1" />
                        <span className="text-xs text-yellow-400">Indeterminacy</span>
                        <span className="text-sm font-medium text-white">{topResult.neutrosophic.I.toFixed(2)}</span>
                        <span className="text-xs text-gray-400">{interpretValue(1 - topResult.neutrosophic.I)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/90 border-yellow-500/30 text-white">
                      <p className="text-xs">Operational uncertainty (e.g., customs delays)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-2 bg-red-900/20 border border-red-500/30 rounded-md">
                        <XCircle className="h-4 w-4 text-red-500 mb-1" />
                        <span className="text-xs text-red-400">Falsity</span>
                        <span className="text-sm font-medium text-white">{topResult.neutrosophic.F.toFixed(2)}</span>
                        <span className="text-xs text-gray-400">{interpretValue(1 - topResult.neutrosophic.F)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/90 border-red-500/30 text-white">
                      <p className="text-xs">Service failures and recorded exceptions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="mt-3 text-xs text-gray-400">
                <p>
                  N({topResult.forwarder}) = {'{'}T: {topResult.neutrosophic.T.toFixed(2)}, 
                  I: {topResult.neutrosophic.I.toFixed(2)}, 
                  F: {topResult.neutrosophic.F.toFixed(2)}{'}'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DecisionExplanation;
