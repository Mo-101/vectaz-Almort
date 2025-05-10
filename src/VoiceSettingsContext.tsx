
import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceContextType {
  speak: (text: string, lang?: string, rate?: number, pitch?: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  stop: () => void;
}

// Default implementation - will be replaced by actual implementation
const defaultVoiceContext: VoiceContextType = {
  speak: () => {},
  isMuted: false,
  toggleMute: () => {},
  stop: () => {}
};

const VoiceSettingsContext = createContext<VoiceContextType>(defaultVoiceContext);

export const useVoice = () => useContext(VoiceSettingsContext);

// Create a provider component
interface VoiceSettingsProviderProps {
  children: React.ReactNode;
}

export const VoiceSettingsProvider: React.FC<VoiceSettingsProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  const speak = (text: string, lang: string = 'en-US', rate: number = 1, pitch: number = 1) => {
    if (!isMuted && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    // Initialization or setup can be done here
    return () => {
      // Cleanup when the component unmounts
      stop();
    };
  }, []);

  return (
    <VoiceSettingsContext.Provider value={{ speak, isMuted, toggleMute, stop }}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};

export default VoiceSettingsProvider;
