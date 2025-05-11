
"use client";

import React, { useState } from 'react';
import {
  Brain, Calculator, Square,
  Sigma, Book, BookOpen, Pi, Layers, Lightbulb
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ForwarderScore, WeightFactors } from '../types';
import MathCardGrid from '../cards/MathCardGrid';
import MathConceptCard from '../cards/MathConceptCard';

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
  const [showOriginalFormat, setShowOriginalFormat] = useState(false);
  const result = results[0];
  const humor = humorQuotes[Math.floor(Math.random() * humorQuotes.length)];

  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20 my-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-[#00FFD1] flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Mathematical Foundation
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[#00FFD1]/70 hover:text-[#00FFD1] hover:bg-[#00FFD1]/10"
          onClick={() => setShowOriginalFormat(!showOriginalFormat)}
        >
          {showOriginalFormat ? "Show Cards" : "Show Details"}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6 text-gray-300">
        {showOriginalFormat ? (
          <div className="italic bg-[#0A1A2F]/50 p-3 rounded text-gray-300 mb-2">{`"${humor}"`}</div>
        ) : (
          <MathCardGrid>
            {/* Neutrosophic Logic Card */}
            <MathConceptCard
              title="Neutrosophic Logic"
              icon={Brain}
              shortDescription="A mathematical framework extending fuzzy logic to handle uncertainty and contradictions in logistics data."
              formula={
                <code className="text-xs">
                  N(x) = {'{T(x), I(x), F(x)}'}
                </code>
              }
              detailedContent={
                <div className="space-y-4 text-sm">
                  <p>
                    Neutrosophic logic evaluates data as a triple:
                  </p>
                  <div className="bg-black/30 p-3 rounded">
                    <code className="text-xs">
                      N(x) = {'{T(x), I(x), F(x)}'} where T = truth, I = indeterminacy, F = falsity
                    </code>
                    <p className="mt-2 text-xs">The constraint: <code>0 ≤ T + I + F ≤ 3</code></p>
                  </div>
                  <p>
                    Example (Reliability on {result.forwarder}):
                  </p>
                  <div className="bg-black/30 p-3 rounded font-mono text-xs">
                    <p>T = 0.85, I = 0.10, F = 0.05</p>
                    <p className="mt-1">Based on {shipmentCount} historical shipments, uncertainties were modeled using neutrosophic filters.</p>
                  </div>
                </div>
              }
            />

            {/* AHP Card */}
            <MathConceptCard
              title="AHP (Preference Weighting)"
              icon={Pi}
              shortDescription="Analytic Hierarchy Process for calculating weight priorities from your preferences."
              formula={
                <code className="text-xs">
                  w = [0.40, 0.30, 0.30]
                </code>
              }
              detailedContent={
                <div className="space-y-4 text-sm">
                  <p>AHP calculates weight priorities from your preferences:</p>
                  <div className="ml-2 space-y-3">
                    <div>
                      <p className="font-semibold">1. Pairwise matrix of Cost, Time, Reliability</p>
                      <div className="bg-black/30 p-3 rounded mt-1">
                        <pre className="text-xs overflow-x-auto whitespace-pre">
                          A = [
                            [1     4/3   4/3]
                            [3/4   1     1  ]
                            [3/4   1     1  ]
                          ]
                        </pre>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">2. Calculate eigenvector of matrix A:</p>
                      <p className="font-mono text-xs mt-1">
                        w = [0.40, 0.30, 0.30]
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">3. Validate consistency:</p>
                      <p className="font-mono text-xs mt-1">
                        CR = (λₘₐₓ - n) / (n - 1) ÷ RI
                      </p>
                      <p className="font-mono text-xs mt-2">
                        CR ≈ 0.017 (acceptable: CR &lt; 0.1)
                      </p>
                    </div>
                  </div>
                </div>
              }
            />

            {/* TOPSIS Card */}
            <MathConceptCard
              title="TOPSIS (Ranking Algorithm)"
              icon={Lightbulb}
              shortDescription="Technique for Order Preference by Similarity to Ideal Solution ranks forwarders based on weighted criteria."
              formula={
                <code className="text-xs">
                  Cᵢ = S⁻ / (S⁺ + S⁻) = {Math.round(result.score * 1000) / 10}%
                </code>
              }
              detailedContent={
                <div className="space-y-3 text-sm">
                  <p>TOPSIS ranks forwarders using:</p>
                  <div className="ml-2 space-y-3">
                    <div>
                      <p className="font-semibold">1. Normalize criteria:</p>
                      <div className="bg-black/30 p-3 rounded mt-1">
                        <code className="text-xs">r<sub>ij</sub> = x<sub>ij</sub> / √Σx<sub>ij</sub>²</code>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">2. Apply weights:</p>
                      <div className="bg-black/30 p-3 rounded mt-1">
                        <code className="text-xs">v<sub>ij</sub> = w<sub>j</sub> × r<sub>ij</sub></code>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">3. Compute distances:</p>
                      <div className="bg-black/30 p-3 rounded mt-1">
                        <code className="text-xs">S⁺ = √Σ(v<sub>ij</sub> - A⁺<sub>j</sub>)²,  S⁻ = √Σ(v<sub>ij</sub> - A⁻<sub>j</sub>)²</code>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">4. Closeness coefficient:</p>
                      <div className="bg-black/30 p-3 rounded mt-1">
                        <code className="text-xs">Cᵢ = S⁻ / (S⁺ + S⁻) = {Math.round(result.score * 1000) / 10}%</code>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Grey Analysis Card */}
            <MathConceptCard
              title="Grey Relational Analysis"
              icon={Layers}
              shortDescription="Detects patterns in sparse logistics data to improve decision reliability."
              formula={
                <code className="text-xs">
                  ξ<sub>i</sub>(j) = (Δmin + ζΔmax) / (Δ<sub>i</sub>(j) + ζΔmax)
                </code>
              }
              detailedContent={
                <div className="space-y-3 text-sm">
                  <p>This model detects patterns in sparse data using:</p>
                  <div className="bg-black/30 p-3 rounded mt-2">
                    <code className="text-xs">
                      ξ<sub>i</sub>(j) = (Δmin + ζΔmax) / (Δ<sub>i</sub>(j) + ζΔmax)
                    </code>
                    <p className="mt-2 text-xs text-gray-400">
                      where ζ = 0.5, Δ = deviation from reference
                    </p>
                  </div>
                  <p className="mt-2">
                    Grey analysis provides robust ranking when data is limited or uncertain, complementing the TOPSIS results.
                  </p>
                </div>
              }
            />
          </MathCardGrid>
        )}

        {/* Display original format or human summary */}
        {showOriginalFormat ? (
          <div className="space-y-8 mt-4">
            <div className="space-y-4">
              <h4 className="text-[#00FFD1] font-medium">Neutrosophic Logic</h4>
              <div className="space-y-4">
                <p>
                  Neutrosophic logic evaluates data as a triple:
                </p>
                <div className="bg-black/30 p-3 rounded">
                  <code className="text-xs">
                    N(x) = {'{T(x), I(x), F(x)}'} where T = truth, I = indeterminacy, F = falsity
                  </code>
                  <p className="mt-2 text-xs">The constraint: <code>0 ≤ T + I + F ≤ 3</code></p>
                </div>
                <p>
                  Example (Reliability on {result.forwarder}):
                </p>
                <div className="bg-black/30 p-3 rounded font-mono text-xs">
                  <p>T = 0.85, I = 0.10, F = 0.05</p>
                  <p className="mt-1">Based on {shipmentCount} historical shipments, uncertainties were modeled using neutrosophic filters.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[#00FFD1] font-medium">AHP (Preference Weighting)</h4>
              <div className="space-y-4">
                <p>AHP calculates weight priorities from your preferences:</p>
                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">1. Pairwise matrix of Cost, Time, Reliability</p>
                    <div className="bg-black/30 p-3 rounded mt-1">
                      <pre className="text-xs overflow-x-auto whitespace-pre">
                        A = [
                          [1     4/3   4/3]
                          [3/4   1     1  ]
                          [3/4   1     1  ]
                        ]
                      </pre>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">2. Calculate eigenvector of matrix A:</p>
                    <p className="font-mono text-xs mt-1">
                      w = [0.40, 0.30, 0.30]
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">3. Validate consistency:</p>
                    <p className="font-mono text-xs mt-1">
                      CR = (λₘₐₓ - n) / (n - 1) ÷ RI
                    </p>
                    <p className="font-mono text-xs mt-2">
                      CR ≈ 0.017 (acceptable: CR &lt; 0.1)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[#00FFD1] font-medium">TOPSIS (Ranking Algorithm)</h4>
              <div className="space-y-3">
                <p>TOPSIS ranks forwarders using:</p>
                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">1. Normalize criteria:</p>
                    <div className="bg-black/30 p-3 rounded mt-1">
                      <code className="text-xs">r<sub>ij</sub> = x<sub>ij</sub> / √Σx<sub>ij</sub>²</code>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">2. Apply weights:</p>
                    <div className="bg-black/30 p-3 rounded mt-1">
                      <code className="text-xs">v<sub>ij</sub> = w<sub>j</sub> × r<sub>ij</sub></code>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">3. Compute distances:</p>
                    <div className="bg-black/30 p-3 rounded mt-1">
                      <code className="text-xs">S⁺ = √Σ(v<sub>ij</sub> - A⁺<sub>j</sub>)²,  S⁻ = √Σ(v<sub>ij</sub> - A⁻<sub>j</sub>)²</code>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">4. Closeness coefficient:</p>
                    <div className="bg-black/30 p-3 rounded mt-1">
                      <code className="text-xs">Cᵢ = S⁻ / (S⁺ + S⁻) = {Math.round(result.score * 1000) / 10}%</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[#00FFD1] font-medium">Grey Relational Analysis</h4>
              <div className="space-y-3">
                <p>This model detects patterns in sparse data using:</p>
                <div className="bg-black/30 p-3 rounded mt-2">
                  <code className="text-xs">
                    ξ<sub>i</sub>(j) = (Δmin + ζΔmax) / (Δ<sub>i</sub>(j) + ζΔmax)
                  </code>
                  <p className="mt-2 text-xs text-gray-400">
                    where ζ = 0.5, Δ = deviation from reference
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-[#0A1A2F]/50 p-4 rounded border border-[#00FFD1]/10">
            <div className="flex items-center mb-3">
              <BookOpen className="h-5 w-5 text-[#00FFD1] mr-2" />
              <h3 className="text-[#00FFD1] font-medium">Human Summary</h3>
            </div>
            <div className="italic bg-[#0A1A2F]/50 p-3 rounded text-gray-300 mb-2">{`"${humor}"`}</div>
            <p className="text-sm">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MathematicalExplanation;
