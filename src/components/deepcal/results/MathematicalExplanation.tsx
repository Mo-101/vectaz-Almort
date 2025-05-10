
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ForwarderScore, WeightFactors } from '../types';
import { Brain, ChevronDown, Calculator, Square, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

interface MathematicalExplanationProps {
  results: ForwarderScore[];
  weightFactors: WeightFactors;
  shipmentCount: number;
}

const MathematicalExplanation: React.FC<MathematicalExplanationProps> = ({ 
  results, 
  weightFactors,
  shipmentCount 
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    neutrosophicLogic: true,
    ahp: true,
    topsis: true,
    grey: true,
    formulas: false,
    humor: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generate a random humor quote from the array
  const humorQuotes = [
    "This algorithm is so precise, it can calculate exactly how many seconds you'll spend wondering how it works.",
    "Our neutrosophic logic is like a cat: simultaneously certain, uncertain, and judging your life choices.",
    "If Einstein did logistics, this is what he'd use... after calling tech support three times.",
    "We've mathematically proven that reading this explanation makes you 37% more attractive at logistics conferences.",
    "This algorithm is powered by advanced mathematics and at least four cups of espresso.",
    "Warning: Understanding this math may cause you to bore people at parties.",
    "We used quantum mechanics to analyze your shipment. Or maybe we didn't. That's the beauty of neutrosophic logic!",
    "When your boss asks how we ranked these forwarders, just say 'multi-dimensional vector space optimization' and walk away confidently."
  ];
  
  const randomHumorIndex = Math.floor(Math.random() * humorQuotes.length);

  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20 my-8">
      <CardHeader>
        <CardTitle className="text-lg text-[#00FFD1] flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Mathematical Foundation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-gray-300">
        {/* Neutrosophic Logic Section */}
        <Collapsible open={expandedSections.neutrosophicLogic} onOpenChange={() => toggleSection('neutrosophicLogic')} className="border border-[#00FFD1]/10 rounded-md bg-[#0A1A2F]/40">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-2 text-[#00FFD1]" />
                <span className="font-medium">Neutrosophic Logic</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.neutrosophicLogic ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p className="mb-2">
              Neutrosophic logic extends beyond classical fuzzy logic by considering:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong className="text-[#00FFD1]">Truth (T)</strong>: Degree of truth/reliability in our data</li>
              <li><strong className="text-[#00FFD1]">Indeterminacy (I)</strong>: Degree of uncertainty or unknown information</li> 
              <li><strong className="text-[#00FFD1]">Falsity (F)</strong>: Degree of falsity or irrelevance</li>
            </ul>
            <p className="mt-2">
              For your analysis, we processed {shipmentCount} historical shipments through a neutrosophic filter to handle uncertainties in transit times, costs, and reliability metrics.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* AHP Section */}
        <Collapsible open={expandedSections.ahp} onOpenChange={() => toggleSection('ahp')} className="border border-[#00FFD1]/10 rounded-md bg-[#0A1A2F]/40">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-[#00FFD1]" />
                <span className="font-medium">Analytic Hierarchy Process (AHP)</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.ahp ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p className="mb-2">
              AHP converts your preferences into mathematical weights through:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Pairwise comparison matrix creation</li>
              <li>Eigenvalue calculation to derive priority weights</li>
              <li>Consistency ratio validation (CR &lt; 0.1)</li>
            </ul>
            <p className="mt-2">
              Your preference weights were calculated as: Cost ({Math.round(weightFactors.cost * 100)}%), 
              Time ({Math.round(weightFactors.time * 100)}%), 
              Reliability ({Math.round(weightFactors.reliability * 100)}%)
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* TOPSIS Section */}
        <Collapsible open={expandedSections.topsis} onOpenChange={() => toggleSection('topsis')} className="border border-[#00FFD1]/10 rounded-md bg-[#0A1A2F]/40">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-[#00FFD1]" />
                <span className="font-medium">TOPSIS Decision Algorithm</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.topsis ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p className="mb-2">
              TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) ranks options by:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>Normalizing all criteria to comparable scales</li>
              <li>Applying preference weights to each criterion</li>
              <li>Determining ideal and anti-ideal solutions</li>
              <li>Calculating Euclidean distances to both ideals</li>
              <li>Computing closeness coefficients (0-1 scale)</li>
            </ol>
            <p className="mt-2">
              Your top forwarder ({results[0]?.forwarder}) achieved a closeness coefficient of {(results[0]?.score * 100).toFixed(1)}%, 
              indicating optimal balance across all criteria.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Grey Relational Analysis Section */}
        <Collapsible open={expandedSections.grey} onOpenChange={() => toggleSection('grey')} className="border border-[#00FFD1]/10 rounded-md bg-[#0A1A2F]/40">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-2 text-[#00FFD1]" />
                <span className="font-medium">Grey Relational Analysis</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.grey ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p className="mb-2">
              Grey Relational Analysis enhances our decision model by:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Adding pattern recognition to incomplete data</li>
              <li>Calculating grey relational grades for each option</li>
              <li>Using distinguishing coefficient (ζ = 0.5) to calibrate sensitivity</li>
            </ul>
            <p className="mt-2">
              This technique helped us identify subtle performance patterns in your historical shipments 
              that traditional methods would miss, especially for routes with limited data samples.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Formulas Section */}
        <Collapsible open={expandedSections.formulas} onOpenChange={() => toggleSection('formulas')} className="border border-[#00FFD1]/10 rounded-md bg-[#0A1A2F]/40">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center p-4 text-left bg-[#0A1A2F]/60"
            >
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-[#00FFD1]" />
                <span className="font-medium">Key Mathematical Formulas</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.formulas ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-[#00FFD1]">Neutrosophic Decision Formulation</h4>
                <div className="mt-1 space-y-1">
                  <p className="text-sm font-mono bg-[#0A1A2F] p-2 rounded">
                    N(x) = {`{T(x), I(x), F(x)}`} | where x is a decision variable
                  </p>
                  <p className="text-xs text-gray-400">
                    Where T, I, F represent truth, indeterminacy, and falsity degrees in [0,1]
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[#00FFD1]">AHP Weight Calculation</h4>
                <div className="mt-1 space-y-1">
                  <p className="text-sm font-mono bg-[#0A1A2F] p-2 rounded">
                    w = (w₁, w₂, ..., wₙ) = eigenvector of pairwise comparison matrix
                  </p>
                  <p className="text-xs text-gray-400">
                    Your calculated weights: Cost={weightFactors.cost.toFixed(2)}, Time={weightFactors.time.toFixed(2)}, Reliability={weightFactors.reliability.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[#00FFD1]">TOPSIS Closeness Coefficient</h4>
                <div className="mt-1 space-y-1">
                  <p className="text-sm font-mono bg-[#0A1A2F] p-2 rounded">
                    Cᵢ = d(Aᵢ, A⁻) / (d(Aᵢ, A⁺) + d(Aᵢ, A⁻))
                  </p>
                  <p className="text-xs text-gray-400">
                    Where d(Aᵢ, A⁺) is distance to ideal solution and d(Aᵢ, A⁻) is distance to anti-ideal solution
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[#00FFD1]">Grey Relational Coefficient</h4>
                <div className="mt-1 space-y-1">
                  <p className="text-sm font-mono bg-[#0A1A2F] p-2 rounded">
                    ξᵢ(j) = (Δmin + ζΔmax) / (Δᵢ(j) + ζΔmax)
                  </p>
                  <p className="text-xs text-gray-400">
                    Where ζ is distinguishing coefficient (0.5), and Δᵢ(j) is deviation sequence
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Human Translation Section */}
        <Collapsible open={expandedSections.humor} onOpenChange={() => toggleSection('humor')} className="border border-[#00FFD1]/20 rounded-md bg-[#0A1A2F]/30 shadow-inner">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-[#00FFD1]" />
                <span className="font-medium">The Human Translation</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.humor ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <div className="bg-[#0A1A2F]/80 p-3 rounded border border-[#00FFD1]/30 italic text-gray-300">
                "{humorQuotes[randomHumorIndex]}"
              </div>
              
              <p className="mt-3 text-sm">
                In plain English: We took your priorities (cost: {Math.round(weightFactors.cost * 100)}%, 
                time: {Math.round(weightFactors.time * 100)}%, 
                reliability: {Math.round(weightFactors.reliability * 100)}%), 
                analyzed {shipmentCount} past shipments, and used some seriously fancy math to figure out 
                that <strong className="text-[#00FFD1]">{results[0]?.forwarder}</strong> is your best bet. 
                They're not perfect (nobody is), but they're the least likely to make you regret your decision at 3 AM.
              </p>
            </div>
            
            <div className="mt-2 p-3 bg-[#0A1A2F]/60 border-t border-[#00FFD1]/10">
              <p className="italic text-gray-400 text-xs">
                "Mathematics is the art of giving the same name to different things." — Henri Poincaré
              </p>
              <p className="mt-1 text-xs">
                (And in this case, the name is "Choose {results[0]?.forwarder} if you don't want your shipment lost in the Bermuda Triangle of logistics")
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Summary Result Section */}
        <div className="p-4 border border-[#00FFD1]/20 rounded bg-[#0A1A2F]/40">
          <h4 className="font-medium text-[#00FFD1] mb-2">Your Results Mathematically Explained</h4>
          <p className="text-sm">
            For your top forwarder ({results[0]?.forwarder}), the engine calculated a normalized score across all criteria, 
            applied your preference weights, and determined this option has the shortest distance to the ideal solution and 
            farthest from the anti-ideal solution, yielding an optimal closeness coefficient of {(results[0]?.score * 100).toFixed(1)}%.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MathematicalExplanation;
