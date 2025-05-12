
import React from 'react';
import { motion } from 'framer-motion';
import { AppSection } from '@/types/deeptrack';
import MapVisualizer from '@/components/MapVisualizer';
import AnalyticsSection from '@/components/AnalyticsSection';
import DeepCALSection from '@/components/DeepCALSection';
import AboutSection from '@/components/AboutSection';
import SettingsSection from '@/components/SettingsSection';

interface ContentRouterProps {
  activeTab: AppSection;
  routes: any[];
  isDataLoaded: boolean;
}

const ContentRouter: React.FC<ContentRouterProps> = ({ activeTab, routes, isDataLoaded }) => {
  switch (activeTab) {
    case 'map':
      return (
        <motion.div 
          key="map-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen w-full"
        >
          <MapVisualizer routes={routes} isLoading={!isDataLoaded} />
        </motion.div>
      );
    case 'analytics':
      return (
        <motion.div 
          key="analytics-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="container mx-auto pt-20 pb-24 px-4 h-screen overflow-y-auto"
        >
          <AnalyticsSection />
        </motion.div>
      );
    case 'deepcal':
      return (
        <motion.div 
          key="deepcal-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="pt-8 pb-24"
        >
          <DeepCALSection />
        </motion.div>
      );
    case 'about':
      return (
        <motion.div 
          key="about-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="pt-8 pb-24"
        >
          <AboutSection />
        </motion.div>
      );
    case 'settings':
      return (
        <motion.div 
          key="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="pt-8 pb-24"
        >
          <SettingsSection />
        </motion.div>
      );
    default:
      return null;
  }
};

export default ContentRouter;
