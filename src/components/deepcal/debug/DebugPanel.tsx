
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bug, XCircle } from 'lucide-react';

interface DebugPanelProps {
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('trace');

  // Listen for console logs from the DeepCAL engine
  useEffect(() => {
    // Store original console methods
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    // Override console.log to capture DeepCAL related logs
    console.log = (...args: any[]) => {
      originalConsoleLog(...args);
      
      // Check if this is a DeepCAL log
      if (args[0] && typeof args[0] === 'string' && args[0].includes('DeepCAL')) {
        setLogs(prev => [...prev, { type: 'log', timestamp: new Date(), content: args }]);
      }
    };
    
    // Override console.error to capture errors
    console.error = (...args: any[]) => {
      originalConsoleError(...args);
      
      // Add all errors to the debug logs
      setLogs(prev => [...prev, { type: 'error', timestamp: new Date(), content: args }]);
    };
    
    // Add initial log
    setLogs(prev => [...prev, { 
      type: 'info', 
      timestamp: new Date(), 
      content: ['DeepCAL Debug Panel initialized'] 
    }]);
    
    // Restore original console methods on cleanup
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  // Determine the color class based on log type
  const getLogTypeClass = (type: string) => {
    switch(type) {
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-200';
    }
  };

  // Format log content for display
  const formatLogContent = (content: any[]) => {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        return <span key={index}>{item}</span>;
      } else if (item && typeof item === 'object') {
        try {
          return (
            <pre key={index} className="text-xs overflow-auto max-h-40 bg-black/30 p-2 rounded mt-1">
              {JSON.stringify(item, null, 2)}
            </pre>
          );
        } catch (e) {
          return <span key={index}>[Object]</span>;
        }
      }
      return <span key={index}>{String(item)}</span>;
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] flex flex-col">
      <Card className="bg-[#0A1A2F]/90 border border-[#00FFD1]/20">
        <CardHeader className="p-3 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Bug className="h-4 w-4 mr-2 text-[#00FFD1]" />
            <div>
              <CardTitle className="text-sm text-[#00FFD1]">DeepCAL Debug Panel</CardTitle>
              <CardDescription className="text-xs text-gray-400">Real-time calculation monitoring</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onClose}
          >
            <XCircle className="h-4 w-4 text-gray-400" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#0A1A2F] border-b border-[#00FFD1]/10 w-full">
              <TabsTrigger value="trace" className="text-xs">Calculation Trace</TabsTrigger>
              <TabsTrigger value="matrix" className="text-xs">Decision Matrix</TabsTrigger>
              <TabsTrigger value="weights" className="text-xs">Weights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trace" className="mt-0">
              <div className="h-64 overflow-y-auto text-xs p-3">
                {logs.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No traces captured yet. Run a calculation to see logs.
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className={`mb-2 ${getLogTypeClass(log.type)}`}>
                      <div className="flex">
                        <span className="text-gray-500 mr-2">{formatTime(log.timestamp)}</span>
                        <div className="flex-1">{formatLogContent(log.content)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="matrix" className="mt-0">
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
                      {JSON.stringify({
                        "Note": "This would be populated with real decision matrix data when calculations are performed"
                      }, null, 2)}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
            
            <TabsContent value="weights" className="mt-0">
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
                      {JSON.stringify({
                        "Note": "This would be populated with real weight calculations when performed"
                      }, null, 2)}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPanel;
