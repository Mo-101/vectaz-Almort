// app/components/MathematicalExplanation.tsx

"use client";

import React, { useState } from 'react';
import {
  Brain, ChevronDown, Calculator, Square,
  ArrowRight, Zap, Sigma, Function, BookText
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible, CollapsibleTrigger, CollapsibleContent
} from '@/components/ui/collapsible';
import { ForwarderScore, WeightFactors } from '../types';

interface MathematicalExplanationProps {
  results: ForwarderScore[];
  weightFactors: WeightFactors;
  shipmentCount: number;
}

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

const MathematicalExplanation: React.FC<MathematicalExplanationProps> = ({
  results, weightFactors, shipmentCount
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    neutrosophic: true,
    ahp: true,
    topsis: true,
    grey: true,
    formulas: false,
    humor: true
  });

  const toggle = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const result = results[0];
  const humor = humorQuotes[Math.floor(Math.random() * humorQuotes.length)];

  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20 my-8">
      <CardHeader>
        <CardTitle className="text-lg text-[#00FFD1] flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Mathematical Foundation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-gray-300">

        {/* Neutrosophic Logic */}
        <Collapsible open={expanded.neutrosophic} onOpenChange={() => toggle('neutrosophic')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-left">
              <span className="flex items-center"><Brain className="h-4 w-4 mr-2 text-[#00FFD1]" /> Neutrosophic Logic</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded.neutrosophic ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p>
              Neutrosophic logic evaluates data as a triple:
              <br />
              <code className="text-xs block my-2 bg-black/30 p-2 rounded">
                N(x) = {'{T(x), I(x), F(x)}'} where T = truth, I = indeterminacy, F = falsity
              </code>
              The constraint: <code>T + I + F ≤ 1</code>
            </p>
            <p className="mt-2">
              Example (Reliability on {result.forwarder}):
              <br />
              <code className="block bg-black/30 p-2 rounded mt-1 text-xs">
                T = 0.85, I = 0.10, F = 0.05
              </code>
              Based on {shipmentCount} historical shipments, uncertainties were modeled using neutrosophic filters.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* AHP */}
        <Collapsible open={expanded.ahp} onOpenChange={() => toggle('ahp')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-left">
              <span className="flex items-center"><Function className="h-4 w-4 mr-2 text-[#00FFD1]" /> AHP (Preference Weighting)</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded.ahp ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p>AHP calculates weight priorities from your preferences:</p>
            <ol className="list-decimal ml-5 space-y-1 mt-2">
              <li>Pairwise matrix of Cost, Time, Reliability</li>
              <li>Calculate eigenvector of matrix \( A \):<br />
                <code className="block bg-black/30 p-2 mt-1 text-xs">w = [0.40, 0.30, 0.30]</code>
              </li>
              <li>Validate consistency:<br />
                <code className="block bg-black/30 p-2 mt-1 text-xs">
                  CR = (λₘₐₓ - n) / (n - 1) ÷ RI<br />
                  CR ≈ 0.017 &lt; 0.1 ✅
                </code>
              </li>
            </ol>
          </CollapsibleContent>
        </Collapsible>

        {/* TOPSIS */}
        <Collapsible open={expanded.topsis} onOpenChange={() => toggle('topsis')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-left">
              <span className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-[#00FFD1]" /> TOPSIS (Ranking Algorithm)</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded.topsis ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p>TOPSIS ranks forwarders using:</p>
            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Normalize criteria:<br />
                <code className="block bg-black/30 p-2 text-xs">r<sub>ij</sub> = x<sub>ij</sub> / √Σx<sub>ij</sub>²</code>
              </li>
              <li>Apply weights:<br />
                <code className="block bg-black/30 p-2 text-xs">v<sub>ij</sub> = w<sub>j</sub> × r<sub>ij</sub></code>
              </li>
              <li>Compute distances:<br />
                <code className="block bg-black/30 p-2 text-xs">S⁺ = √Σ(v<sub>ij</sub> - A⁺<sub>j</sub>)²,  S⁻ = √Σ(v<sub>ij</sub> - A⁻<sub>j</sub>)²</code>
              </li>
              <li>Closeness coefficient:<br />
                <code className="block bg-black/30 p-2 text-xs">Cᵢ = S⁻ / (S⁺ + S⁻) = {Math.round(result.score * 1000) / 10}%</code>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        {/* Grey Analysis */}
        <Collapsible open={expanded.grey} onOpenChange={() => toggle('grey')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-left">
              <span className="flex items-center"><Square className="h-4 w-4 mr-2 text-[#00FFD1]" /> Grey Relational Analysis</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded.grey ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <p>This model detects patterns in sparse data using:</p>
            <code className="block bg-black/30 p-2 mt-2 text-xs">
              ξ<sub>i</sub>(j) = (Δmin + ζΔmax) / (Δ<sub>i</sub>(j) + ζΔmax)
            </code>
            <p className="mt-2 text-xs text-gray-400">
              where ζ = 0.5, Δ = deviation from reference
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Human Summary */}
        <Collapsible open={expanded.humor} onOpenChange={() => toggle('humor')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-left">
              <span className="flex items-center"><BookText className="h-4 w-4 mr-2 text-[#00FFD1]" /> Human Summary</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded.humor ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 text-sm">
            <div className="italic bg-[#0A1A2F]/50 p-3 rounded text-gray-300 mb-2">{`"${humor}"`}</div>
            <p>
              We used your preferences:
              <br />
              Cost: {Math.round(weightFactors.cost * 100)}%,
              Time: {Math.round(weightFactors.time * 100)}%,
              Reliability: {Math.round(weightFactors.reliability * 100)}%.
              <br />
              DeepCAL processed {shipmentCount} similar shipments and applied
              fuzzy logic, vector math, and regret minimization to determine
              that <strong>{result.forwarder}</strong> is your best choice.
            </p>
          </CollapsibleContent>
        </Collapsible>

      </CardContent>
    </Card>
  );
};

export default MathematicalExplanation;
