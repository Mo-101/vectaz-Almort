
import { useState, useEffect } from 'react';

export const useVoice = () => {
  const [isMuted, setIsMuted] = useState(false);
  
  const speak = (text: string, lang = "en-NG", rate = 1.2, pitch = 1.3) => {
    if (isMuted) return;
    
    const synth = window.speechSynthesis;
    synth.cancel();

    // Try to get an African voice first
    const voices = synth.getVoices();
    const africanVoice = voices.find(v => 
      v.lang === 'en-NG' || 
      v.lang === 'en-ZA' ||
      v.name.includes('Africa')
    );

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate; 
    utterance.pitch = pitch;
    if (africanVoice) utterance.voice = africanVoice;

    synth.speak(utterance);
  };

  const stop = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, isMuted, toggleMute, stop };
};
