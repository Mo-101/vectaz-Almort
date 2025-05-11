
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import InspectSymbolicEngine from './InspectSymbolicEngine';

interface DebugPanelProps {
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('console');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-5xl h-[80vh] flex flex-col border border-[#00FFD1]/20 bg-[#0A1A2F]/90 backdrop-blur-md text-white">
        <CardHeader className="border-b border-[#00FFD1]/10 p-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[#00FFD1]">DeepCAL Debug Panel</CardTitle>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#00FFD1]/10"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b border-[#00FFD1]/10">
            <TabsList className="bg-transparent border-b-0 p-0 h-12">
              <TabsTrigger 
                value="console" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#00FFD1] data-[state=active]:bg-[#00FFD1]/5 data-[state=active]:shadow-none rounded-none border-0 h-12 px-6"
              >
                Console Logs
              </TabsTrigger>
              <TabsTrigger 
                value="symbolic" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#00FFD1] data-[state=active]:bg-[#00FFD1]/5 data-[state=active]:shadow-none rounded-none border-0 h-12 px-6"
              >
                Symbolic Engine
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#00FFD1] data-[state=active]:bg-[#00FFD1]/5 data-[state=active]:shadow-none rounded-none border-0 h-12 px-6"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="state" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#00FFD1] data-[state=active]:bg-[#00FFD1]/5 data-[state=active]:shadow-none rounded-none border-0 h-12 px-6"
              >
                App State
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="console" className="flex-1 p-4 overflow-auto space-y-2 bg-[#0A1A2F]/40">
            <div className="font-mono text-sm">
              <div className="text-gray-400">{'>'} DeepCAL Debug Console</div>
              <div className="text-red-400 mt-2">⚠️ Warning: Some performance issues detected in DeepCAL optimizer</div>
              <div className="text-gray-300 mt-2">Log tracing enabled for [deepcal-engine, neutrosophic-ahp]</div>
              <div className="text-green-400 mt-2">✓ Session initialized</div>
            </div>
          </TabsContent>
          <TabsContent value="symbolic" className="flex-1 p-4 overflow-auto">
            <InspectSymbolicEngine />
          </TabsContent>
          <TabsContent value="performance" className="flex-1 p-4 overflow-auto">
            <div className="text-center p-12">
              <p className="text-gray-400">Performance metrics module coming soon</p>
            </div>
          </TabsContent>
          <TabsContent value="state" className="flex-1 p-4 overflow-auto">
            <div className="text-center p-12">
              <p className="text-gray-400">State inspector module coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DebugPanel;
