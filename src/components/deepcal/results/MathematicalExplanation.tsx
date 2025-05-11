
import React from 'react';
import { ForwarderScore, WeightFactors } from '../types';
import { Card, CardContent } from '@/components/ui/card';

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
  const topResult = results[0];
  
  return (
    <div className="space-y-4">
      <Card className="border-[#00FFD1]/20 bg-[#0A1A2F]/60">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-[#00FFD1] mb-2">Multi-Criteria Decision Making</h4>
          <p className="text-xs text-gray-300 mb-3">
            The DeepCAL engine uses an integrated approach combining Neutrosophic AHP (Analytic Hierarchy Process) and TOPSIS 
            (Technique for Order of Preference by Similarity to Ideal Solution) with Grey Relational Analysis.
          </p>
          <div className="p-3 bg-[#0A1A2F] rounded-md border border-[#00FFD1]/10">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
{`// Decision matrix normalization and weight application
normalizedMatrix = normalize(decisionMatrix);
weightedMatrix = normalizedMatrix.map(row => 
  row.map((val, i) => val * weights[i])
);

// Distance calculation from ideal solutions
S+ = sqrt(sum((forwarder - idealSolution)²))
S- = sqrt(sum((forwarder - antiIdealSolution)²))

// Final score computation for ${topResult?.forwarder}
Score = S- / (S+ + S-) = ${topResult?.score.toFixed(3)}`}
            </pre>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-[#00FFD1]/20 bg-[#0A1A2F]/60">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-[#00FFD1] mb-2">Neutrosophic Logic Evaluation</h4>
          <p className="text-xs text-gray-300 mb-3">
            DeepCAL implements Neutrosophic Logic to handle uncertainty in supply chain performance evaluation.
            Each forwarder is scored using a triple N = {'{'}T, I, F{'}'} where:
          </p>
          <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
            <div className="p-2 bg-green-900/20 border border-green-500/30 rounded">
              <span className="text-green-400 font-medium">Truth (T):</span><br/>
              Confidence metric from on-time delivery performance
            </div>
            <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <span className="text-yellow-400 font-medium">Indeterminacy (I):</span><br/>
              Operational uncertainty (customs processing variability)
            </div>
            <div className="p-2 bg-red-900/20 border border-red-500/30 rounded">
              <span className="text-red-400 font-medium">Falsity (F):</span><br/>
              Service failures and recorded exceptions
            </div>
          </div>
          <div className="p-3 bg-[#0A1A2F] rounded-md border border-[#00FFD1]/10">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
{`// Neutrosophic evaluation for ${topResult?.forwarder}
N(${topResult?.forwarder?.substring(0, 3) || "FF"}) = {
  T: ${topResult?.neutrosophic?.T.toFixed(2) || "0.00"}, // Truth (reliability)
  I: ${topResult?.neutrosophic?.I.toFixed(2) || "0.00"}, // Indeterminacy (uncertainty)
  F: ${topResult?.neutrosophic?.F.toFixed(2) || "0.00"}  // Falsity (failures)
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-[#00FFD1]/20 bg-[#0A1A2F]/60">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-[#00FFD1] mb-2">Grey Relational Analysis</h4>
          <p className="text-xs text-gray-300 mb-3">
            As part of our advanced optimization, Grey Relational Analysis is integrated to handle incomplete information
            across the ${shipmentCount} historical shipments analyzed, providing a more robust evaluation under uncertainty.
          </p>
          <div className="p-3 bg-[#0A1A2F] rounded-md border border-[#00FFD1]/10">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
{`// Grey coefficient calculation
ξ(x₀(k), xᵢ(k)) = (minᵢ minₖ △ᵢ(k) + ζ maxᵢ maxₖ △ᵢ(k)) / (△ᵢ(k) + ζ maxᵢ maxₖ △ᵢ(k))

// Grey relational grade for ${topResult?.forwarder}
γᵢ = ${topResult?.greyGrade?.toFixed(3) || "0.000"} // Average of grey coefficients across all criteria`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MathematicalExplanation;
