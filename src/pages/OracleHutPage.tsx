
import React from 'react';
import OracleHutSection from '@/components/OracleHut/OracleHutSection';

const OracleHutPage = () => {
  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      {/* Background components */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950 z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] z-0" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col pb-16">
        {/* App Title/Logo */}
        <div className="absolute top-4 right-6 z-20">
          <div className="text-xl font-bold text-[#00FFD1] tracking-wider">
            Oracle Hut <span className="text-xs text-white opacity-70">SYMBOLIC INSIGHTS</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          <OracleHutSection />
        </div>
      </div>
    </div>
  );
};

export default OracleHutPage;
