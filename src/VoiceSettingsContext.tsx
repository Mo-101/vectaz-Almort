
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface VoiceContextType {
  speak: (text: string, lang?: string, rate?: number, pitch?: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  stop: () => void;
  isSpeaking: boolean;
}

// Default implementation - will be replaced by actual implementation
const defaultVoiceContext: VoiceContextType = {
  speak: () => {},
  isMuted: false,
  toggleMute: () => {},
  stop: () => {},
  isSpeaking: false
};

const VoiceSettingsContext = createContext<VoiceContextType>(defaultVoiceContext);

export const useVoice = () => useContext(VoiceSettingsContext);

// Create a provider component
interface VoiceSettingsProviderProps {
  children: React.ReactNode;
}

export const VoiceSettingsProvider: React.FC<VoiceSettingsProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (
    text: string,
    lang: string = 'en-US',
    rate: number = 1,
    pitch: number = 1
  ) => {
    if (!isMuted && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Try to find an appropriate voice
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.lang.includes(lang) || voice.name.toLowerCase().includes('female')
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      currentUtterance.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    stop(); // Stop current utterance if toggling mute
  };

  useEffect(() => {
    return () => stop(); // Cleanup on unmount
  }, []);

  return (
    <VoiceSettingsContext.Provider value={{ speak, isMuted, toggleMute, stop, isSpeaking }}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};

export default VoiceSettingsProvider;
