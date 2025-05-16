
import React, { useState, useCallback, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { AppSection } from '@/types/deeptrack';
import EntryAnimation from '@/components/EntryAnimation';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Import the optimized components
import AnimatedBackground from '@/components/home/AnimatedBackground';
import ContentRouter from '@/components/home/ContentRouter';
import KonamiCodeEasterEgg from '@/components/home/KonamiCodeEasterEgg';
import NotificationHandler from '@/components/home/NotificationHandler';
import useRouteProcessor from '@/hooks/useRouteProcessor';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const { isDataLoaded } = useBaseDataStore();
  const [showEntry, setShowEntry] = useState(false); // Default to false to avoid showing it again if it was already shown
  const [showLoading, setShowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AppSection>('map');
  const { routes } = useRouteProcessor();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEntryComplete = useCallback(() => {
    setShowEntry(false);
    setShowLoading(true);
  }, []);
  
  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  // Check if entry animation was already shown
  useEffect(() => {
    const entryShown = sessionStorage.getItem('entryAnimationShown');
    const loadingComplete = sessionStorage.getItem('loadingComplete');
    
    if (!entryShown) {
      setShowEntry(true);
      sessionStorage.setItem('entryAnimationShown', 'true');
    } else if (!loadingComplete) {
      setShowLoading(true);
    }
  }, []);

  // Listen for hash changes to update the active tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeTab) {
        setActiveTab(hash as AppSection);
      }
    };

    // Set initial tab from hash if present
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeTab]);

  if (showEntry) {
    return <EntryAnimation onComplete={handleEntryComplete} />;
  }
  
  if (showLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="h-full w-full overflow-x-hidden relative tech-bg">
      {/* Background components */}
      <AnimatedBackground />
      
      {/* Application content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <ContentRouter 
            activeTab={activeTab} 
            routes={routes} 
            isDataLoaded={isDataLoaded} 
          />
        </AnimatePresence>
      </div>
      
      {/* Non-visual components */}
      <KonamiCodeEasterEgg />
      <NotificationHandler isDataLoaded={isDataLoaded} />
    </div>
  );
};

export default Index;
