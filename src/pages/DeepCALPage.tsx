
import React from 'react';
import DeepCALSection from '@/components/DeepCALSection';
import { useBaseDataStore } from '@/store/baseState';
import { Badge } from '@/components/ui/badge';
import { Mic, Server } from 'lucide-react';

interface DeepCALPageProps {
  isVoiceReady?: boolean;
  isDeepCALReady?: boolean;
}

const DeepCALPage: React.FC<DeepCALPageProps> = ({ 
  isVoiceReady = false, 
  isDeepCALReady = false 
}) => {
  const { isDataLoaded } = useBaseDataStore();

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      {/* Background components */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950 z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] z-0" />
      
      {/* System Status Indicators */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <Badge 
          variant={isVoiceReady ? "outline" : "secondary"}
          className={`flex items-center gap-1 ${isVoiceReady ? 'border-green-500 text-green-400' : 'border-yellow-600 text-yellow-500'}`}
        >
          <Mic className="h-3 w-3" />
          {isVoiceReady ? 'Voice Ready' : 'Voice Offline'}
        </Badge>
        
        <Badge 
          variant={isDeepCALReady ? "outline" : "secondary"}
          className={`flex items-center gap-1 ${isDeepCALReady ? 'border-green-500 text-green-400' : 'border-yellow-600 text-yellow-500'}`}
        >
          <Server className="h-3 w-3" />
          {isDeepCALReady ? 'DeepCAL Connected' : 'DeepCAL Offline'}
        </Badge>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <DeepCALSection />
        </div>
      </div>
    </div>
  );
};

export default DeepCALPage;
