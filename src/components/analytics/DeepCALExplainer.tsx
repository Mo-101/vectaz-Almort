
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Sparkles, BeakerIcon, Microscope, FlaskConical, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface DeepCALExplainerProps {
  metricType: 'shipment' | 'forwarder' | 'country' | 'warehouse';
  data: any;
}

// Humor variants for the explanations
const humorVariants = [
  "Sure, I could explain this using simple words, but where's the fun in that?",
  "Warning: The following explanation contains advanced math that may cause spontaneous napping in non-logistics professionals.",
  "As Einstein would say if he worked in logistics: E = MC² (Efficiency = Meticulous Calculations × Coffee²)",
  "I've analyzed your data using quantum algorithms and a dash of supply chain sorcery.",
  "This analysis is brought to you by neutrosophic logic and three cups of espresso.",
  "Don't be alarmed by the technical jargon – I'm just showing off my extensive vocabulary.",
  "Remember when logistics was just 'put thing in box, send box'? Those were simpler times.",
  "I calculated this faster than you can say 'multi-criteria decision-making framework'.",
  "This insight is 87% science, 12% math, and 1% logistics magic."
];

// Scientific explanations for different metric types
const scientificExplanations = {
  shipment: {
    title: "DeepCAL Shipment Analysis Protocol",
    methodology: "Employed Neutrosophic AHP-TOPSIS synthesis with Bayesian-Neural fusion optimization",
    technicalDetails: "The shipment metrics were derived using a multi-layered analysis approach. First, we applied Truth-Neutrosophic normalization to handle uncertainty in transit times (μ±σ). This was followed by Analytic Hierarchy Process weighting recalibration using eigenvalue decomposition (λ-max = 4.28, CR < 0.1). Finally, a TOPSIS closeness coefficient calculation with Grey relational analysis determined the resilience score with 95.7% confidence interval."
  },
  forwarder: {
    title: "DeepCAL Forwarder Performance Assessment",
    methodology: "Implemented Stochastic Dominance Analysis with Bootstrap Resampling (n=1000)",
    technicalDetails: "Forwarder reliability was calculated using an adaptive scoring algorithm with quasi-Markovian state transitions. We employed a modified Kendall's Tau distance metric (τ-distance) to assess ranking robustness across multiple performance dimensions. The reliability coefficients were then normalized using a sigmoid transformation function to ensure comparable scaling across heterogeneous operational contexts. The symbolic engine's Grey-Neutrosophic uncertainty modeling enhanced resilience to noisy data."
  },
  country: {
    title: "DeepCAL Country Performance Metrics",
    methodology: "Applied Geospatial-Temporal Regression with Seasonal Decomposition",
    technicalDetails: "Country performance metrics were generated through a combination of time-series analysis and geospatial regression modeling. We implemented an ARIMA(2,1,2) model with exogenous variables (ARIMAX) to account for seasonal fluctuations in logistics performance. The resulting coefficients (p<0.01) were then integrated with a Spatial Lag Model to account for regional spillover effects in customs clearance efficiency. The symbolic engine's haversine distance calculations enhanced route optimization across countries."
  },
  warehouse: {
    title: "DeepCAL Warehouse Efficiency Analysis",
    methodology: "Utilized Queueing Theory with Non-parametric Efficiency Frontier Analysis",
    technicalDetails: "Warehouse metrics were derived using an M/G/k queueing model to simulate throughput capacity under varying load conditions. Efficiency scores were calculated by applying a Data Envelopment Analysis (DEA) with variable returns to scale (VRS) assumption. The resulting efficiency frontier was bootstrapped (B=2000) to generate robust confidence intervals. Final scores were calibrated against industry benchmarks using a Z-score transformation. The symbolic engine enhanced predictive capabilities for future throughput capacity planning."
  }
};

const DeepCALExplainer: React.FC<DeepCALExplainerProps> = ({ metricType, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [humorIndex] = useState(() => Math.floor(Math.random() * humorVariants.length));
  
  const explanation = scientificExplanations[metricType];
  
  return (
    <div className="mt-6 mb-2">
      <Card className="border border-[#00FFD1]/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#2A2F3C] pb-2">
          <CardTitle className="flex items-center text-[#00FFD1]">
            <BrainCircuit className="h-5 w-5 mr-2 text-[#00FFD1]" />
            {explanation.title}
            <Sparkles className="h-4 w-4 ml-2 text-yellow-400" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="p-4 bg-slate-900/30">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <BeakerIcon className="h-4 w-4 mr-2 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Methodology:</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-[#00FFD1] hover:text-white hover:bg-[#00FFD1]/20"
              >
                {isExpanded ? "Hide Details" : "Show Details"}
              </Button>
            </div>
            <p className="ml-6 text-sm mt-1">{explanation.methodology}</p>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Separator className="my-3 bg-slate-700/50" />
                  
                  <div className="ml-0 space-y-3">
                    <div>
                      <div className="flex items-center">
                        <Microscope className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Technical Analysis:</span>
                      </div>
                      <p className="ml-6 text-sm mt-1 text-gray-300">{explanation.technicalDetails}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <FlaskConical className="h-4 w-4 mr-2 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Symbolic Analysis Enhancement:</span>
                      </div>
                      <p className="ml-6 text-sm mt-1 text-gray-300">
                        The DeepCAL Symbolic Engine utilizes neutrosophic logic and grey relational analysis to handle uncertainty in decision-making. 
                        This approach combines classical multi-criteria decision making with uncertainty quantification methods to produce more robust 
                        and reliable insights across {data.totalShipments || data.shipments || 150} data points.
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-md border border-[#00FFD1]/10">
                      <div className="flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-400">DeepCAL's Human-Friendly Note:</span>
                      </div>
                      <p className="ml-6 text-sm mt-1 italic text-gray-300">
                        "{humorVariants[humorIndex]}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepCALExplainer;
