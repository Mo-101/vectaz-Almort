
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { auditDeepCalCalculations } from '@/utils/calculationAudit';
import { ForwarderScore, WeightFactors } from '../types';

interface CalculationInspectorProps {
  results: ForwarderScore[];
  weightFactors: WeightFactors;
  shipmentCount: number;
}

const CalculationInspector: React.FC<CalculationInspectorProps> = ({
  results,
  weightFactors,
  shipmentCount
}) => {
  const [auditResults, setAuditResults] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  
  const runAudit = () => {
    setIsAuditing(true);
    try {
      // Run the audit
      const audit = auditDeepCalCalculations();
      setAuditResults(audit);
    } catch (error) {
      console.error('Error running audit:', error);
      setAuditResults({ error: String(error) });
    } finally {
      setIsAuditing(false);
    }
  };
  
  // Get source information for the calculation
  const getSourceInfo = () => {
    // Look for file source of the ForwarderScore results
    try {
      const sourceFiles = Object.keys(require.cache || {})
        .filter(path => path.includes('deepcal') || 
                        path.includes('engine') || 
                        path.includes('topsis'));
      
      return sourceFiles.length > 0 ? 
        { files: sourceFiles } : 
        { message: 'No source files identified - calculation may be client-side only' };
    } catch {
      return { message: 'Unable to trace module sources' };
    }
  };
  
  return (
    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20 my-8">
      <CardHeader>
        <CardTitle className="text-lg text-[#00FFD1] flex items-center">
          DeepCAL Calculation Inspector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-gray-300">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Current Calculation Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-black/30 p-3 rounded">
              <h4 className="font-semibold mb-2">Input Parameters</h4>
              <pre className="overflow-auto max-h-60">
                {JSON.stringify({ weightFactors, shipmentCount }, null, 2)}
              </pre>
            </div>
            
            <div className="bg-black/30 p-3 rounded">
              <h4 className="font-semibold mb-2">Calculation Results</h4>
              <pre className="overflow-auto max-h-60">
                {JSON.stringify(results.map(r => ({
                  forwarder: r.forwarder,
                  score: r.score,
                  performances: {
                    cost: r.costPerformance,
                    time: r.timePerformance,
                    reliability: r.reliabilityPerformance
                  }
                })), null, 2)}
              </pre>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-center">
            <Button 
              onClick={runAudit} 
              disabled={isAuditing}
              variant="outline"
              className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
            >
              {isAuditing ? 'Running Audit...' : 'Run Calculation Audit'}
            </Button>
          </div>
          
          {auditResults && (
            <div className="mt-4">
              <h3 className="font-medium text-sm mb-2">Audit Results</h3>
              <div className="bg-black/30 p-3 rounded text-xs">
                <p>{auditResults.message || 'Audit complete. Check browser console for detailed results.'}</p>
                {auditResults.error && (
                  <p className="text-red-400 mt-2">Error: {auditResults.error}</p>
                )}
              </div>
              
              <h3 className="font-medium text-sm mt-4 mb-2">Calculation Source</h3>
              <div className="bg-black/30 p-3 rounded text-xs">
                <pre className="overflow-auto max-h-40">
                  {JSON.stringify(getSourceInfo(), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationInspector;
