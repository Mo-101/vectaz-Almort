
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MatrixViewerProps {
  matrixData?: any;
}

const MatrixViewer: React.FC<MatrixViewerProps> = ({ matrixData = null }) => {
  return (
    <div className="h-64 overflow-y-auto text-xs p-3">
      <h3 className="text-[#00FFD1] mb-2">Decision Matrix</h3>
      <p className="text-gray-400 mb-3">
        Input matrix used for TOPSIS algorithm with normalized values.
      </p>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="mb-2 text-xs">
            View Raw Matrix
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="text-xs overflow-auto max-h-40 bg-black/30 p-2 rounded my-2">
            {JSON.stringify(matrixData || {
              "Note": "This would be populated with real decision matrix data when calculations are performed"
            }, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MatrixViewer;
