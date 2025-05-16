import React from 'react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { motion } from 'framer-motion';
import { LucideBarChart3, LucidePackage, LucideClipboardCheck, LucideClock, LucideTrendingUp, LucideAward } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col p-5 bg-white rounded-xl shadow-sm ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          <span className="mt-1 text-2xl font-semibold text-gray-900">{value}</span>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${
            trend.direction === 'up' 
              ? 'text-emerald-700 bg-emerald-50' 
              : trend.direction === 'down' 
                ? 'text-rose-700 bg-rose-50' 
                : 'text-gray-600 bg-gray-100'
          }`}>
            {trend.direction === 'up' ? (
              <LucideTrendingUp className="mr-1 h-3 w-3" />
            ) : trend.direction === 'down' ? (
              <LucideTrendingUp className="mr-1 h-3 w-3 transform rotate-180" />
            ) : (
              <span className="mr-1 h-3 w-3">-</span>
            )}
            {Math.abs(trend.value)}%
          </span>
          <span className="ml-2 text-gray-500">vs. prev. period</span>
        </div>
      )}
      
      {/* Accent decoration */}
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-b-xl opacity-75`} />
    </motion.div>
  );
};

interface ShipmentMetricsSummaryProps {
  className?: string;
}

const ShipmentMetricsSummary: React.FC<ShipmentMetricsSummaryProps> = ({ className }) => {
  const { metrics, activeForwarders, isLoading } = useAnalyticsData();
  
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-xl"></div>
        ))}
      </div>
    );
  }
  
  if (!metrics) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-8 text-center ${className}`}>
        <LucideBarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700">No metrics available</h3>
        <p className="text-gray-500 mt-2">
          Shipment data may be empty or still loading. Please check back later.
        </p>
      </div>
    );
  }
  
  // Calculate on-time delivery rate
  const onTimeRate = metrics.shipmentStatusCounts.onTime 
    ? Math.round((metrics.shipmentStatusCounts.onTime / Math.max(metrics.totalShipments, 1)) * 100) 
    : 0;
  
  // Format total volume and weight
  const formattedWeight = metrics.totalWeight > 1000 
    ? `${(metrics.totalWeight / 1000).toFixed(1)}K kg` 
    : `${Math.round(metrics.totalWeight)} kg`;
  
  const formattedVolume = metrics.totalVolume > 1000 
    ? `${(metrics.totalVolume / 1000).toFixed(1)}K cbm` 
    : `${Math.round(metrics.totalVolume)} cbm`;
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      <MetricCard
        title="Total Shipments"
        value={metrics.totalShipments.toLocaleString()}
        icon={<LucidePackage className="h-5 w-5 text-indigo-600" />}
        trend={{ 
          value: 12.8, 
          direction: 'up'
        }}
      />
      
      <MetricCard
        title="On-Time Delivery"
        value={`${onTimeRate}%`}
        icon={<LucideClipboardCheck className="h-5 w-5 text-emerald-600" />}
        trend={{ 
          value: 3.2, 
          direction: 'up'
        }}
      />
      
      <MetricCard
        title="Avg. Transit Time"
        value={`${Math.round(metrics.avgTransitTime)} days`}
        icon={<LucideClock className="h-5 w-5 text-amber-600" />}
        trend={{ 
          value: 2.5, 
          direction: 'down'
        }}
      />
      
      <MetricCard
        title="Total Weight"
        value={formattedWeight}
        icon={<LucideBarChart3 className="h-5 w-5 text-purple-600" />}
      />
      
      <MetricCard
        title="Total Volume"
        value={formattedVolume}
        icon={<LucideBarChart3 className="h-5 w-5 text-blue-600" />}
      />
      
      <MetricCard
        title="Active Forwarders"
        value={activeForwarders}
        icon={<LucideAward className="h-5 w-5 text-orange-600" />}
      />
    </div>
  );
};

export default ShipmentMetricsSummary;
