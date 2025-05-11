
import React, { useState } from 'react';
import AnalyticsLayout from '@/components/analytics/AnalyticsLayout';
import OverviewContent from './analytics/OverviewContent';
import ShipmentAnalytics from './analytics/ShipmentAnalytics';
import ForwarderAnalytics from './analytics/ForwarderAnalytics';
import CountryAnalytics from './analytics/CountryAnalytics';
import WarehouseAnalytics from './analytics/WarehouseAnalytics';
import DeepCALExplainer from './analytics/DeepCALExplainer';
import { useAnalyticsMetrics } from '@/hooks/useAnalyticsMetrics';
import { useSymbolicAnalysis } from '@/hooks/useSymbolicAnalysis';
import { useBaseDataStore } from '@/store/baseState';

const AnalyticsSection: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showDeepTalk, setShowDeepTalk] = useState<boolean>(false);
  
  // Use our custom hooks to get metrics and symbolic analysis results
  const {
    coreMetrics,
    shipmentMetrics,
    forwarders,
    carriers,
    countries,
    warehouses
  } = useAnalyticsMetrics();
  
  const symbolicResults = useSymbolicAnalysis(shipmentData, forwarders);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'deepTalk') {
      setShowDeepTalk(true);
    } else {
      setShowDeepTalk(false);
    }
  };

  // Determine the title based on the active tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'overview': return 'Analytics Overview';
      case 'shipments': return 'Shipment Analytics';
      case 'forwarders': return 'Forwarder Analytics';
      case 'countries': return 'Country Analytics';
      case 'warehouses': return 'Warehouse Analytics';
      default: return 'Analytics Dashboard';
    }
  };

  return (
    <div className="w-full h-full">
      <AnalyticsLayout 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        title={getTabTitle()}
      >
        {activeTab === 'overview' && coreMetrics && (
          <OverviewContent 
            metrics={coreMetrics}
            symbolicResults={symbolicResults}
          />
        )}
        
        {activeTab === 'shipments' && (
          <>
            <ShipmentAnalytics 
              metrics={shipmentMetrics} 
              symbolicResults={symbolicResults}
            />
            {shipmentMetrics && <DeepCALExplainer metricType="shipment" data={shipmentMetrics} />}
          </>
        )}
        
        {activeTab === 'forwarders' && (
          <>
            <ForwarderAnalytics 
              forwarders={forwarders} 
              carriers={carriers}
              symbolicResults={symbolicResults}
            />
            {forwarders.length > 0 && <DeepCALExplainer metricType="forwarder" data={forwarders[0]} />}
          </>
        )}
        
        {activeTab === 'countries' && (
          <>
            <CountryAnalytics countries={countries} />
            {countries.length > 0 && <DeepCALExplainer metricType="country" data={countries[0]} />}
          </>
        )}
        
        {activeTab === 'warehouses' && (
          <>
            <WarehouseAnalytics warehouses={warehouses} />
            {warehouses.length > 0 && <DeepCALExplainer metricType="warehouse" data={warehouses[0]} />}
          </>
        )}
      </AnalyticsLayout>
    </div>
  );
};

export default AnalyticsSection;
