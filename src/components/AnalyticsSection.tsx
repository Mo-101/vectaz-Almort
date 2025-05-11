
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
import { Badge } from '@/components/ui/badge';
import { Info, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';

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
        // This is the problematic line - we need to modify how we pass the title
        // Instead of passing a JSX element directly, we need to pass it as a titleElement prop
        title={getTabTitle()}
        titleElement={
          <div className="flex items-center">
            {getTabTitle()}
            <Badge className="ml-3 bg-mostar-light-blue/20 text-mostar-light-blue hover:bg-mostar-light-blue/30">
              Enhanced Analytics
            </Badge>
          </div>
        }
      >
        {activeTab === 'overview' && coreMetrics && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-2" />
                <span>Enhanced analytics with advanced metrics and improved visualizations</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs border-mostar-light-blue/30 text-mostar-light-blue hover:bg-mostar-light-blue/10">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Export Report
              </Button>
            </div>
            <OverviewContent 
              metrics={coreMetrics}
              symbolicResults={symbolicResults}
            />
          </>
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
