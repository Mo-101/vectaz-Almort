
import { useState, useEffect, useRef } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

export const useVoice = () => {
  const { settings } = useVoiceSettings();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  
  const speak = (text: string, lang = "en-NG", rate = 1.2, pitch = 1.3) => {
    if (isMuted) return;
    
    // Apply settings
    const finalRate = rate * (settings?.speed || 1.0);
    const finalPitch = pitch * (settings?.pitch || 1.0);
    
    // Cancel any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    const synth = window.speechSynthesis;

    // Try to get an African voice first
    const voices = synth.getVoices();
    const africanVoice = voices.find(v => 
      v.lang === 'en-NG' || 
      v.lang === 'en-ZA' ||
      v.name.includes('Africa')
    );

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = finalRate;
    utterance.pitch = finalPitch;
    if (africanVoice) utterance.voice = africanVoice;
    
    // Set event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    currentUtterance.current = utterance;
    synth.speak(utterance);
  };

  const stop = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    stop(); // Stop speaking when muted
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, isMuted, toggleMute, stop, isSpeaking };
};
