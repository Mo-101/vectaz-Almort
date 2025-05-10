
// Update the DeepTalk component usage to match the correct props
import React, { useState } from 'react';
import { BarChart, Brain, X } from 'lucide-react';
import KPIPanel from '@/components/KPIPanel';
import DeepTalk from '@/components/DeepTalk';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-mobile';

interface AnalyticsLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  title?: string;
  kpis?: Array<{
    label: string;
    value: string | number;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    iconName?: string;
    color?: string;
  }>;
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({
  title = "Analytics Dashboard",
  kpis,
  children,
  activeTab,
  onTabChange
}) => {
  const [showDeepTalk, setShowDeepTalk] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const handleToggleDeepTalk = () => {
    setShowDeepTalk(!showDeepTalk);
  };
  
  const handleDeepTalkQuery = async (query: string): Promise<string> => {
    // This is a placeholder function that would be connected to the actual DeepCAL engine
    return `I've analyzed your query: "${query}". Here's what the data suggests...`;
  };

  const handleDeepTalkResult = (scriptId: string) => {
    console.log("Script triggered:", scriptId);
    // Handle the result here
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      {/* Header Row - Fixed Height */}
      <div className="flex justify-between items-center mb-4 h-16">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <div className="p-2 mr-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <BarChart className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        
        <Button 
          size="sm"
          variant="outline" 
          className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-blue-500/20 text-blue-400 hover:bg-blue-500/10" 
          onClick={handleToggleDeepTalk}
        >
          {showDeepTalk ? (
            <>
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">DeepTalk™</span>
            </>
          )}
        </Button>
      </div>
      
      {/* KPIs - Compact View */}
      {kpis && (
        <div className="mb-4 overflow-x-auto glass-panel rounded-lg border border-gray-700">
          <KPIPanel className="min-w-max" kpis={kpis} />
        </div>
      )}
      
      {/* Main Content Area - Dynamic Grid */}
      <div className={`transition-all duration-300 ${showDeepTalk ? (isMobile ? 'flex flex-col space-y-4' : 'grid grid-cols-1 lg:grid-cols-4 gap-4') : ''}`}>
        {/* Primary Content - Always full width when DeepTalk closed */}
        <div className={`${showDeepTalk ? (isMobile ? '' : 'lg:col-span-3') : ''} glass-panel rounded-lg border border-gray-700 p-4`}>
          {children}
        </div>
        
        {/* DeepTalk Panel - Slides in/out */}
        {showDeepTalk && (
          <div className={`${isMobile ? '' : 'lg:col-span-1'} glass-panel border border-blue-500/20 rounded-lg overflow-hidden`}>
            <DeepTalk 
              onResult={handleDeepTalkResult}
              className="h-[calc(100vh-220px)] min-h-[400px] max-h-[800px]" 
              initialMessage="I've analyzed your logistics data. What would you like to know about your shipments, forwarders, or routes?" 
              onQueryData={handleDeepTalkQuery} 
              onClose={handleToggleDeepTalk}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsLayout;
