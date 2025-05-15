
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Ship } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Particles from './Particles';

interface EntryAnimationProps {
  onComplete: () => void;
}

const EntryAnimation: React.FC<EntryAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing DeepCAL Core');
  const [showLogo, setShowLogo] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string[]>([]);
  const [showTagline, setShowTagline] = useState(false);
  
  const loadingPhases = [
    {
      name: 'Core Initialization',
      messages: [
        'Initializing DeepCAL Core',
        'Establishing Quantum Network',
        'Calibrating Decision Engine'
      ]
    },
    {
      name: 'Data Verification',
      messages: [
        'Verifying Base Dataset Integrity',
        'Loading AHP Matrix',
        'Optimizing N-TOPSIS Algorithms'
      ]
    },
    {
      name: 'Network Sync',
      messages: [
        'Connecting to Supabase Cloud',
        'Syncing Remote Data Nodes',
        'Aligning Neutrosophic Vectors'
      ]
    },
    {
      name: 'Final Checks',
      messages: [
        'Running Integrity Verification',
        'Preparing Runtime Environment',
        'Finalizing System Boot Sequence'
      ]
    }
  ];
  
  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 600);
    
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1500);
    
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        
        const newPhase = Math.floor(prevProgress / 25);
        if (newPhase !== loadingPhase) {
          setLoadingPhase(newPhase);
          setVerificationStatus(prev => [...prev, `${loadingPhases[Math.min(newPhase - 1, 3)].name} Complete`]);
        }
        
        const phaseProgress = prevProgress % 25;
        if (phaseProgress % 8 === 0) {
          const currentPhase = Math.min(newPhase, loadingPhases.length - 1);
          const msgIndex = Math.floor(phaseProgress / 8) % loadingPhases[currentPhase].messages.length;
          setLoadingText(loadingPhases[currentPhase].messages[msgIndex]);
        }
        
        if (prevProgress === 45) {
          simulateDataIntegrityCheck();
        }
        
        if (prevProgress === 70) {
          simulateNetworkSync();
        }
        
        return prevProgress + 0.5;
      });
    }, 100);
    
    return () => {
      clearInterval(timer);
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
    };
  }, [loadingPhase, onComplete]);
  
  const simulateDataIntegrityCheck = () => {
    setVerificationStatus(prev => [...prev, "Local Data Integrity: Verified"]);
  };
  
  const simulateNetworkSync = () => {
    setVerificationStatus(prev => [...prev, "Network Connection: Established"]);
    setTimeout(() => {
      setVerificationStatus(prev => [...prev, "Remote Data Sync: Complete"]);
    }, 500);
  };
  
  const renderVerificationLogs = () => {
    return verificationStatus.map((status, index) => (
      <motion.div 
        key={index} 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.4, duration: 0.6 }}
        className="flex items-center text-xs font-mono mb-1 text-blue-200/80"
      >
        <CheckCircle size={12} className="mr-2 text-emerald-400" />
        {status}
      </motion.div>
    ));
  };
  
  const particleColors = [
    "#FF5E8F", // Pink
    "#5EFF8F", // Green
    "#5E8FFF", // Blue
    "#FF5E5E", // Red
    "#5EFFFF", // Cyan
    "#FF5EDF", // Magenta
    "#FFFF5E"  // Yellow
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-[#0A1A2F] to-blue-950 flex flex-col items-center justify-center z-50"
    >
      <Particles
        particleColors={particleColors}
        particleCount={250}
        particleSpread={12}
        speed={0.06}
        particleBaseSize={80}
        moveParticlesOnHover={true}
        particleHoverFactor={0.5}
        alphaParticles={true}
        sizeRandomness={0.8}
        cameraDistance={25}
        disableRotation={false}
      />
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      
      <div className="max-w-md w-full z-10 px-6">
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 0.9, 1],
              opacity: [0, 1, 0.8, 1]
            }}
            transition={{ 
              duration: 3,
              times: [0, 0.4, 0.7, 1],
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="relative"
          >
            <Ship size={48} className="text-[#00FFD1]" />
            <motion.div
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-[#00FFD1]/20 blur-md z-[-1]"
            />
          </motion.div>
        </div>
        
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: showLogo ? 1 : 0, scale: showLogo ? 1 : 0.9 }}
            transition={{ duration: 1 }}
          >
            <img 
              src="/lovable-uploads/dc85e902-d0de-4838-890f-9287ff1d1ec6.png" 
              alt="DeepCAL Logo" 
              className="w-32 h-32 object-contain"
            />
          </motion.div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#00FFD1]">
          DeepCAL
        </h1>
        
        <div className="text-center mb-4">
          <p className="text-sm text-blue-200/80 font-mono uppercase tracking-wider">
            Cargo Augmented Logistics
          </p>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showTagline ? 1 : 0, y: showTagline ? 0 : 10 }}
            transition={{ duration: 0.8 }}
            className="italic text-xs text-[#00FFD1] mt-3"
          >
            "Analytics so sharp, they could cut through customs delays."
          </motion.p>
        </div>
        
        <div className="mb-2 backdrop-blur-sm bg-blue-950/30 p-3 rounded-lg border border-[#00FFD1]/20">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-semibold text-blue-200">
              Phase {loadingPhase + 1}/{loadingPhases.length}: {loadingPhases[loadingPhase].name}
            </p>
            <p className="text-xs text-blue-200/60 font-mono">{progress}%</p>
          </div>
          
          <Progress 
            value={progress} 
            className="h-1.5 bg-blue-950/50" 
          />
        </div>
        
        <div className="flex items-center mb-4 backdrop-blur-sm bg-blue-950/30 p-3 rounded-lg border border-blue-500/20">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-blue-400 rounded-full mr-2"
          />
          <p className="text-sm text-blue-200/80 font-mono">
            {loadingText}
          </p>
        </div>
        
        <div className="bg-blue-950/40 border border-blue-900/50 rounded-md p-3 mb-6 h-24 overflow-hidden backdrop-blur-sm">
          <p className="text-xs text-blue-300 font-semibold mb-2 font-mono">System Verification Log:</p>
          <div className="h-full overflow-y-auto scrollbar-hide">
            {renderVerificationLogs()}
          </div>
        </div>
        
        <div className="space-y-3 backdrop-blur-sm bg-blue-950/30 p-3 rounded-lg border border-blue-500/20">
          <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-3 w-full bg-blue-900/30 rounded"
          />
          <div className="flex space-x-2">
            <motion.div 
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="h-3 w-2/3 bg-blue-900/30 rounded"
            />
            <motion.div 
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="h-3 w-1/3 bg-blue-900/30 rounded"
            />
          </div>
          <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
            className="h-3 w-5/6 bg-blue-900/30 rounded"
          />
        </div>
      </div>
      
      <div className="absolute bottom-4 text-xs text-center text-blue-200/40 font-mono">
        <p>MOSTAR INDUSTRIES</p>
        <p className="mt-1 text-[10px]">© DEEPCAL ROUTEVERSE {new Date().getFullYear()}</p>
      </div>
    </motion.div>
  );
};

export default EntryAnimation;
