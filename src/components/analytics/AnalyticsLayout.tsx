
import React, { ReactNode } from 'react';
import AnalyticsTabs from './AnalyticsTabs';

interface AnalyticsLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
  title: string;
  titleElement?: ReactNode;
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
  title,
  titleElement
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-800 bg-black/40 p-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-[#00FFD1]">
            {titleElement || title}
          </div>
          <AnalyticsTabs 
            activeTab={activeTab} 
            onTabChange={onTabChange} 
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default AnalyticsLayout;
