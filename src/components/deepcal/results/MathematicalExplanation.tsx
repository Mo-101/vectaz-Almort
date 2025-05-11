
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ForwarderScore, WeightFactors } from '../types';
import { Brain, ChevronDown, Calculator, Square, ArrowRight, Zap, Sigma, Function, Infinity, BookText } from 'lucide-react';
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
              Neutrosophic logic extends beyond classical fuzzy logic by considering three dimensions:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong className="text-[#00FFD1]">Truth (T)</strong>: Degree of truth/reliability in our data</li>
              <li><strong className="text-[#00FFD1]">Indeterminacy (I)</strong>: Degree of uncertainty or unknown information</li> 
              <li><strong className="text-[#00FFD1]">Falsity (F)</strong>: Degree of falsity or irrelevance</li>
            </ul>
            
            <div className="mt-3 p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded">
              <p className="font-mono text-sm text-center">
                T<sub>i</sub> + I<sub>i</sub> + F<sub>i</sub> ≤ 1
              </p>
            </div>
            
            <p className="mt-3">
              <strong className="text-white">Example</strong> (Reliability on {results[0]?.forwarder || "Top Forwarder"}):
            </p>
            <div className="mt-1 p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded">
              <p className="font-mono text-sm text-center">
                T = 0.85, I = 0.10, F = 0.05
              </p>
            </div>
            
            <p className="mt-3">
              For your analysis, we processed <strong>{shipmentCount}</strong> historical shipments through a neutrosophic filter to handle uncertainties in transit times, costs, and reliability metrics.
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
                <Function className="h-4 w-4 mr-2 text-[#00FFD1]" />
                <span className="font-medium">Analytic Hierarchy Process (AHP)</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.ahp ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p className="mb-2">
              AHP converts your preferences into mathematical weights through:
            </p>
            
            <p className="mt-2"><strong className="text-white">1. Pairwise Comparison Matrix</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1 mb-3 overflow-x-auto">
              <p className="font-mono text-xs mb-2">Criteria: Cost (C), Time (T), Reliability (R)</p>
              <pre className="font-mono text-xs">
{`Matrix A:
        C      T      R
C     [1     4/3    4/3]
T     [3/4    1      1  ]
R     [3/4    1      1  ]`}
              </pre>
            </div>
            
            <p className="mt-2"><strong className="text-white">2. Calculate Eigenvector (w)</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1 mb-3">
              <p className="font-mono text-xs">
                w = principal eigenvector of A
              </p>
              <p className="font-mono text-xs mt-2">
                w = [ 0.40, 0.30, 0.30 ]<sup>T</sup>
              </p>
            </div>
            
            <p className="mt-2"><strong className="text-white">3. Consistency Ratio</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1">
              <p className="font-mono text-xs">
                CR = (λ<sub>max</sub> - n) / (n - 1) ÷ RI
              </p>
              <p className="font-mono text-xs mt-2">
                CR ≈ 0.017 (acceptable: CR &lt; 0.1)
              </p>
            </div>
            
            <p className="mt-3">
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
              TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) ranks options through these steps:
            </p>
            
            <p className="mt-2"><strong className="text-white">1. Normalize Criteria</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1 mb-2">
              <p className="font-mono text-xs text-center">
                r<sub>ij</sub> = x<sub>ij</sub> / √(Σ x<sub>ij</sub><sup>2</sup>)
              </p>
            </div>
            
            <p className="mt-2"><strong className="text-white">2. Weight Normalized Matrix</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1 mb-2">
              <p className="font-mono text-xs text-center">
                v<sub>ij</sub> = w<sub>j</sub> · r<sub>ij</sub>
              </p>
            </div>
            
            <p className="mt-2"><strong className="text-white">3. Determine Ideal & Anti-Ideal Solutions</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1 mb-2">
              <p className="font-mono text-xs">
                A<sup>+</sup> = max<sub>j</sub> v<sub>ij</sub>,&nbsp;&nbsp;
                A<sup>-</sup> = min<sub>j</sub> v<sub>ij</sub>
              </p>
            </div>
            
            <p className="mt-2"><strong className="text-white">4. Compute Euclidean Distances</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1 mb-2">
              <p className="font-mono text-xs">
                S<sup>+</sup> = √(Σ (v<sub>ij</sub> - A<sup>+</sup><sub>j</sub>)<sup>2</sup>)
              </p>
              <p className="font-mono text-xs mt-2">
                S<sup>-</sup> = √(Σ (v<sub>ij</sub> - A<sup>-</sup><sub>j</sub>)<sup>2</sup>)
              </p>
            </div>
            
            <p className="mt-2"><strong className="text-white">5. Calculate Closeness Coefficient (DeepScore™)</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1">
              <p className="font-mono text-xs text-center">
                C<sub>i</sub> = S<sup>-</sup> / (S<sup>+</sup> + S<sup>-</sup>)
              </p>
              <p className="font-mono text-xs text-center mt-2">
                C<sub>{results[0]?.forwarder || "Top"}</sub> = {results[0] ? (results[0].score * 100).toFixed(1) : "85.0"}%
              </p>
            </div>
            
            <p className="mt-3">
              This closeness coefficient tells us how close {results[0]?.forwarder} is to the ideal forwarder given your preferences:
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Cost: {Math.round(weightFactors.cost * 100)}%</li>
                <li>Time: {Math.round(weightFactors.time * 100)}%</li>
                <li>Reliability: {Math.round(weightFactors.reliability * 100)}%</li>
              </ul>
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
            </ul>
            
            <p className="mt-2"><strong className="text-white">Grey Relational Coefficient</strong></p>
            <div className="p-3 bg-[#0A1A2F] border border-[#00FFD1]/20 rounded mt-1">
              <p className="font-mono text-xs text-center">
                ξ<sub>i</sub>(j) = (Δ<sub>min</sub> + ζΔ<sub>max</sub>) / (Δ<sub>i</sub>(j) + ζΔ<sub>max</sub>)
              </p>
              <p className="text-xs mt-2">
                Where ζ is distinguishing coefficient (0.5), and Δ<sub>i</sub>(j) is deviation sequence
              </p>
            </div>
            
            <p className="mt-3">
              This technique helped us identify subtle performance patterns in your historical shipments 
              that traditional methods would miss, especially for routes with limited data samples.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Formulas Section */}
        <Collapsible open={expandedSections.formulas} onOpenChange={() => toggleSection('formulas')} className="border border-[#00FFD1]/20 rounded-md bg-[#0A1A2F]/60">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center p-4 text-left bg-[#0A1A2F]/60"
            >
              <div className="flex items-center">
                <Sigma className="h-4 w-4 mr-2 text-[#00FFD1]" />
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

              <div>
                <h4 className="font-medium text-[#00FFD1]">Worked Example for {results[0]?.forwarder || "Top Forwarder"}</h4>
                <div className="mt-1 p-3 bg-[#0A1A2F] border border-[#00FFD1]/10 rounded">
                  <p className="text-xs">Raw scores from historical data:</p>
                  <pre className="font-mono text-xs mt-1">
{`Forwarder: ${results[0]?.forwarder || "Top Forwarder"}
Cost: ${results[0] ? (results[0].costPerformance * 100).toFixed(0) : "80"}
Time: ${results[0] ? (results[0].timePerformance * 100).toFixed(0) : "90"}
Reliability: ${results[0] ? (results[0].reliabilityPerformance * 100).toFixed(0) : "85"}`}
                  </pre>
                  
                  <p className="text-xs mt-2">Weighted normalized values:</p>
                  <pre className="font-mono text-xs mt-1">
{`Cost: ${results[0] ? (results[0].costPerformance * weightFactors.cost * 100).toFixed(2) : "32.00"}
Time: ${results[0] ? (results[0].timePerformance * weightFactors.time * 100).toFixed(2) : "27.00"}
Reliability: ${results[0] ? (results[0].reliabilityPerformance * weightFactors.reliability * 100).toFixed(2) : "25.50"}`}
                  </pre>
                  
                  <p className="text-xs mt-2">Final DeepScore™ = {results[0] ? (results[0].score * 100).toFixed(1) : "85.0"}%</p>
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
                <BookText className="h-4 w-4 mr-2 text-[#00FFD1]" />
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
            applied your preference weights ({Math.round(weightFactors.cost * 100)}% cost, {Math.round(weightFactors.time * 100)}% time, {Math.round(weightFactors.reliability * 100)}% reliability), 
            and determined this option has the shortest distance to the ideal solution and farthest from the anti-ideal solution, 
            yielding an optimal closeness coefficient of {(results[0]?.score * 100).toFixed(1)}%.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MathematicalExplanation;
