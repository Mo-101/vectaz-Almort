import React, { useState, useEffect } from 'react';
import DeepCALSection from '@/components/DeepCALSection';
import { useBaseDataStore } from '@/store/baseState';
import DeepCALSpinner from '@/components/DeepCALSpinner';

const DeepCALPage = () => {
  const [loadingVoice, setLoadingVoice] = useState(true);
  const { isDataLoaded } = useBaseDataStore();
  const [voicePersonality, setVoicePersonality] = useState('sassy');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    // Simulate loading voice assets - in a real app, you would load your voice models here
    const timer = setTimeout(() => {
      setLoadingVoice(false);
    }, 2000);
    
    // Get voice settings from localStorage if available
    const savedPersonality = localStorage.getItem('deepcal-voice-personality');
    if (savedPersonality) {
      setVoicePersonality(savedPersonality);
    }
    
    const voiceEnabledSetting = localStorage.getItem('deepcal-use-elevenlabs');
    if (voiceEnabledSetting !== null) {
      setVoiceEnabled(voiceEnabledSetting !== 'false');
    }
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      {/* Background components */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950 z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] z-0" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col pb-16">
        {/* App Title/Logo */}
        <div className="absolute top-4 right-6 z-20">
          <div className="text-xl font-bold text-[#00FFD1] tracking-wider">
            DeepCAL™ <span className="text-xs text-white opacity-70">OPTIMIZER</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {loadingVoice ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="mb-6">
                <DeepCALSpinner />
              </div>
              <div className="text-[#00FFD1] font-medium">Loading Voice Interface...</div>
              <div className="text-white/60 text-sm mt-2">Initializing ElevenLabs Connection</div>
            </div>
          ) : (
            <DeepCALSection voicePersonality={voicePersonality} voiceEnabled={voiceEnabled} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeepCALPage;
