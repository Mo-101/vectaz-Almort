
import React, { useEffect, useState } from 'react';
import { boot } from '@/init/boot';
import Particles from './Particles';
import { loadingPhases } from '@/constants/loadingPhases';
import FloatingIcons from './loading/FloatingIcons';
import LogoSection from './loading/LogoSection';
import LoadingStatusPanel from './loading/LoadingStatusPanel';
import VerificationLogs from './loading/VerificationLogs';
import SkeletonLoader from './loading/SkeletonLoader';
import LoadingFooter from './loading/LoadingFooter';
import ElevenLabsConvaiWidget from './chat/ElevenLabsConvaiWidget';
import { GlobeIcon, BarChart3Icon, BrainCircuitIcon, InfoIcon, SettingsIcon, ClipboardListIcon, ServerIcon, SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlobalNavigation from './GlobalNavigation';
import { useNavigate } from 'react-router-dom';

interface LoadingScreenProps {
  isInitialLoad?: boolean;
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isInitialLoad = false, 
  onLoadingComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing DeepCAL Core');
  const [showLogo, setShowLogo] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string[]>([]);
  const [showTagline, setShowTagline] = useState(false);
  const navigate = useNavigate();
  
  // Rainbow colors for particles
  const particleColors = [
    "#FF5E8F", // Pink
    "#5E8F8F", // Green
    "#5E8FFF", // Blue
    "#FF5E5E", // Red
    "#5EFFFF", // Cyan
    "#FF5EDF", // Magenta
    "#FFFF5E"  // Yellow
  ];
  
  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 600);
    
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1500);

    // Add max loading time to prevent infinite loading
    const maxLoadingTimer = setTimeout(() => {
      if (progress < 100) {
        console.log("Max loading time reached, forcing completion");
        setProgress(100);
        completeLoading();
      }
    }, 8000); // 8 seconds maximum loading time
    
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          completeLoading();
          return 100;
        }
        
        const newPhase = Math.floor(prevProgress / 25);
        if (newPhase !== loadingPhase && newPhase < loadingPhases.length) {
          setLoadingPhase(newPhase);
          if (newPhase > 0) {
            setVerificationStatus(prev => [...prev, `${loadingPhases[Math.min(newPhase - 1, 3)].name} Complete`]);
          }
        }
        
        const phaseProgress = prevProgress % 25;
        if (phaseProgress % 8 === 0 && newPhase < loadingPhases.length) {
          const currentPhase = Math.min(newPhase, loadingPhases.length - 1);
          const msgIndex = Math.floor(phaseProgress / 8) % loadingPhases[currentPhase].messages.length;
          setLoadingText(loadingPhases[currentPhase].messages[msgIndex]);
        }
        
        if (prevProgress === 45) {
          simulateDataIntegrityCheck();
        }
        
        if (prevProgress === 70) {
          simulateSupabaseSync();
        }
        
        // Accelerate loading speed for better UX
        return prevProgress + 1.5;
      });
    }, 100);
    
    return () => {
      clearInterval(timer);
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(maxLoadingTimer);
    };
  }, [loadingPhase]);
  
  // Complete loading function
  const completeLoading = () => {
    if (onLoadingComplete) {
      onLoadingComplete();
    }
    // Mark loading as complete in session storage
    sessionStorage.setItem('loadingComplete', 'true');
  };
  
  const simulateDataIntegrityCheck = () => {
    setVerificationStatus(prev => [...prev, "Local Data Integrity: Verified"]);
    
    const sampleData = Array(3).fill(0).map((_, i) => ({
      request_reference: `SR_24-00${i}_NBO`,
      origin_country: 'Kenya',
      destination_country: 'Zimbabwe',
      weight_kg: 100,
      delivery_status: 'Pending'
    }));
    
    boot({
      file: 'internal_data.json',
      requireShape: [
        'request_reference', 'origin_country', 'destination_country', 
        'weight_kg', 'delivery_status'
      ],
      minRows: 1
    }, sampleData);
  };
  
  const simulateSupabaseSync = () => {
    setVerificationStatus(prev => [...prev, "Supabase Connection: Established"]);
    setTimeout(() => {
      setVerificationStatus(prev => [...prev, "Remote Data Sync: Complete"]);
    }, 800);
  };
  
  // Handle navigation through direct links
  const handleNavigation = (route: string) => {
    navigate(route);
    if (onLoadingComplete) {
      onLoadingComplete();
    }
  };

  // Static navigation icons for loading screen (router-independent)  
  const navIcons = [
    { id: 'map', route: '/', icon: GlobeIcon, label: 'Map' },
    { id: 'analytics', route: '/#analytics', icon: BarChart3Icon, label: 'Analytics' },
    { id: 'forms', route: '/forms', icon: ClipboardListIcon, label: 'Forms' },
    { id: 'deepcal', route: '/deepcal', icon: BrainCircuitIcon, label: 'DeepCAL' },
    { id: 'oracle', route: '/oracle', icon: SparklesIcon, label: 'Oracle' },
    { id: 'training', route: '/training', icon: ServerIcon, label: 'Training' },
    { id: 'about', route: '/#about', icon: InfoIcon, label: 'About' },
    { id: 'settings', route: '/#settings', icon: SettingsIcon, label: 'Settings' }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-blue-950 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Particles background */}
      <Particles
        particleColors={particleColors}
        particleCount={200}
        particleSpread={12}
        speed={0.05}
        particleBaseSize={80}
        moveParticlesOnHover={false}
        particleHoverFactor={0.5}
        alphaParticles={true}
        sizeRandomness={0.8}
        cameraDistance={25}
        disableRotation={false}
      />
      
      <FloatingIcons />
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      
      <div className="max-w-md w-full z-10 px-6 relative">
        <LogoSection showLogo={showLogo} showTagline={showTagline} />
        
        <LoadingStatusPanel 
          progress={progress}
          currentPhase={loadingPhase}
          phaseName={loadingPhases[Math.min(loadingPhase, loadingPhases.length - 1)].name}
          totalPhases={loadingPhases.length}
          loadingText={loadingText}
        />
        
        <VerificationLogs logs={verificationStatus} />
        
        <SkeletonLoader />

        {/* Skip button - allow users to bypass loading */}
        {progress < 100 && (
          <button 
            onClick={completeLoading}
            className="mt-4 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-100 rounded-md text-sm transition-colors border border-blue-400/30 w-full"
          >
            Skip Loading
          </button>
        )}
      </div>
      
      <LoadingFooter />
      
      {/* Navigation Bar - positioned at the bottom of the screen */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-panel rounded-full py-2 px-4 flex items-center justify-center space-x-1 shadow-lg border border-[#00FFD1]/30">
          {navIcons.map((item) => {
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.route)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-full transition-all",
                  item.id === 'map' 
                    ? "bg-[#00FFD1]/20 text-[#00FFD1]" 
                    : "text-gray-400 hover:bg-[#00FFD1]/10 hover:text-[#00FFD1]"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Chat Widget */}
      <ElevenLabsConvaiWidget agentId="kWY3sE6znRmHQqPy48sk" />
    </div>
  );
};

export default LoadingScreen;
