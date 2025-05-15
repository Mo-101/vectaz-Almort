
import React from 'react';
import DeepCALSection from '@/components/DeepCALSection';
import { useBaseDataStore } from '@/store/baseState';

const DeepCALPage = () => {
  const { isDataLoaded } = useBaseDataStore();

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      {/* Background components */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950 z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] z-0" />
      
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
