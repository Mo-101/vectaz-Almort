
import React, { useState, useEffect } from 'react';
import { Bot, BrainCircuit, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DeepTalk from './DeepTalk';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeepTalkHandler } from './analytics/DeepTalkHandler';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingDeepTalk: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const isMobile = useIsMobile();
  const handleQuery = getDeepTalkHandler();

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setPulseCount(prev => prev + 1);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const getFloatingPosition = () => {
    if (isExpanded) {
      return isMobile 
        ? 'fixed inset-2 h-auto' 
        : 'fixed inset-10 h-auto';
    }
    
    return isMobile
      ? 'w-[90vw] max-w-[400px] h-[70vh] max-h-[600px]'
      : 'w-80 md:w-96 h-[480px]';
  };

  const handleResult = (scriptId: string) => {
    console.log("Script triggered:", scriptId);
    // Handle the result here
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`bg-black/60 backdrop-blur-lg border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(0,149,255,0.15)] overflow-hidden ${
              getFloatingPosition()
            }`}
          >
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-cyan-500/20">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-medium text-white/90">DeepTalk Assistant</h3>
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-cyan-500/20 text-cyan-400 rounded-sm">v2.0</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full hover:bg-white/10"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 
                    <Minimize2 className="h-3.5 w-3.5 text-white/70" /> : 
                    <Maximize2 className="h-3.5 w-3.5 text-white/70" />
                  }
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full hover:bg-white/10"
                  onClick={handleClose}
                >
                  <X className="h-3.5 w-3.5 text-white/70" />
                </Button>
              </div>
            </div>
            <div className="h-full">
              <DeepTalk 
                onResult={handleResult}
                className="h-full border-none" 
                initialMessage="I've analyzed your logistics data. What would you like to know about your shipments, forwarders, or routes?"
                onQueryData={handleQuery}
                onClose={handleClose}
              />
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative group"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-70 blur-md group-hover:opacity-100 transition-opacity"></div>
            
            <motion.div 
              animate={{ 
                boxShadow: pulseCount % 2 === 0 ? 
                  [
                    '0 0 0 0 rgba(14, 165, 233, 0)',
                    '0 0 0 15px rgba(14, 165, 233, 0.2)',
                    '0 0 0 25px rgba(14, 165, 233, 0)',
                  ] : 
                  '0 0 0 0 rgba(14, 165, 233, 0)' 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-full border-2 border-cyan-400/30 shadow-lg"
            >
              <div className="absolute inset-1 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full blur-sm"></div>
              <Bot className="relative h-6 w-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              
              <div className="absolute inset-0 border-2 border-transparent rounded-full border-t-cyan-400 animate-spin-slow opacity-70"></div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingDeepTalk;
