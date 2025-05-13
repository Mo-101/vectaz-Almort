
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
import { toast } from '@/components/ui/use-toast';

const AnalyticsSection: React.FC = () => {
  const { shipmentData, isDataLoaded } = useBaseDataStore();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showDeepTalk, setShowDeepTalk] = useState<boolean>(false);
  
  // Use our custom hooks to get metrics and symbolic analysis results
  const {
    coreMetrics,
    shipmentMetrics,
    forwarders,
    carriers,
    countries,
    warehouses,
    calculationError
  } = useAnalyticsMetrics();
  
  const symbolicResults = useSymbolicAnalysis(shipmentData, forwarders);

  // Show error toast if calculation fails
  React.useEffect(() => {
    if (calculationError) {
      toast({
        title: "Analytics Error",
        description: "There was an error calculating metrics: " + calculationError,
        variant: "destructive"
      });
    }
  }, [calculationError]);

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

  // If no data is loaded, show a message
  if (!isDataLoaded || shipmentData.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="text-4xl text-[#00FFD1] mb-4">📊</div>
        <h2 className="text-2xl font-bold text-[#00FFD1] mb-2">No Data Available</h2>
        <p className="text-gray-400 text-center max-w-md mb-6">
          Please load or generate shipment data to view analytics.
        </p>
      </div>
    );
  }

  const renderTabContent = () => {
    if (activeTab === 'overview' && coreMetrics) {
      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-2" />
              <span>Analytics based on {shipmentData.length} shipment records</span>
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
      );
    }
    
    if (activeTab === 'shipments') {
      return (
        <>
          <ShipmentAnalytics 
            metrics={shipmentMetrics} 
            symbolicResults={symbolicResults}
          />
          {shipmentMetrics && <DeepCALExplainer metricType="shipment" data={shipmentMetrics} />}
        </>
      );
    }
    
    if (activeTab === 'forwarders') {
      return (
        <>
          <ForwarderAnalytics 
            forwarders={forwarders} 
            carriers={carriers}
            symbolicResults={symbolicResults}
          />
          {forwarders.length > 0 && <DeepCALExplainer metricType="forwarder" data={forwarders[0]} />}
        </>
      );
    }
    
    if (activeTab === 'countries') {
      return (
        <>
          <CountryAnalytics countries={countries} />
          {countries.length > 0 && <DeepCALExplainer metricType="country" data={countries[0]} />}
        </>
      );
    }
    
    if (activeTab === 'warehouses') {
      return (
        <>
          <WarehouseAnalytics warehouses={warehouses} />
          {warehouses.length > 0 && <DeepCALExplainer metricType="warehouse" data={warehouses[0]} />}
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full h-full">
      <AnalyticsLayout 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        title={getTabTitle()}
        titleElement={
          <div className="flex items-center">
            {getTabTitle()}
            <Badge className="ml-3 bg-mostar-light-blue/20 text-mostar-light-blue hover:bg-mostar-light-blue/30">
              {shipmentData.length} Shipments
            </Badge>
          </div>
        }
      >
        {renderTabContent()}
      </AnalyticsLayout>
    </div>
  );
};

export default AnalyticsSection;
