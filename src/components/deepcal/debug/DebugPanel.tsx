
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bug, XCircle } from 'lucide-react';
import LogViewer from './LogViewer';
import MatrixViewer from './MatrixViewer';
import WeightsViewer from './WeightsViewer';

interface DebugPanelProps {
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('trace');
  const [matrixData, setMatrixData] = useState<any>(null);
  const [weightsData, setWeightsData] = useState<any>(null);

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
        
        // Check for matrix data
        if (args[0].includes('Matrix') && args[1] && typeof args[1] === 'object') {
          setMatrixData(args[1]);
        }
        
        // Check for weights data
        if (args[0].includes('Weights') && args[1] && typeof args[1] === 'object') {
          setWeightsData(args[1]);
        }
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
              <LogViewer logs={logs} />
            </TabsContent>
            
            <TabsContent value="matrix" className="mt-0">
              <MatrixViewer matrixData={matrixData} />
            </TabsContent>
            
            <TabsContent value="weights" className="mt-0">
              <WeightsViewer weightsData={weightsData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPanel;
