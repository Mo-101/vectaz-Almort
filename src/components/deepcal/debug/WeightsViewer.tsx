
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface WeightsViewerProps {
  weightsData?: any;
}

const WeightsViewer: React.FC<WeightsViewerProps> = ({ weightsData = null }) => {
  return (
    <div className="h-64 overflow-y-auto text-xs p-3">
      <h3 className="text-[#00FFD1] mb-2">AHP Weights</h3>
      <p className="text-gray-400 mb-3">
        Weight factors derived from user preferences with AHP validation.
      </p>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="mb-2 text-xs">
            View Computed Weights
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="text-xs overflow-auto max-h-40 bg-black/30 p-2 rounded my-2">
            {JSON.stringify(weightsData || {
              "Note": "This would be populated with real weight calculations when performed"
            }, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default WeightsViewer;
