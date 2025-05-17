
// Voice synthesis utilities for DeepTalk

export interface SpeechSynthesisVoice {
  name: string;
  lang: string;
}

export interface VoiceSettings {
  enabled: boolean;
  volume: number;
  voice: string;
  speed: number;
}

// Initialize the speech synthesis system
export const initVoiceSystem = async (): Promise<boolean> => {
  // Check if speech synthesis is supported in this browser
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    console.log('Speech synthesis supported');
    return true;
  } else {
    console.log('Speech synthesis not supported');
    return false;
  }
};

// Get available voices
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  
  return voices.map(voice => ({
    name: voice.name,
    lang: voice.lang
  }));
};

// Speak the text using the provided settings
export const voiceReply = async (text: string, settings: VoiceSettings): Promise<boolean> => {
  if (!settings.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.log('[Voice Disabled] Would speak:', text);
    return false;
  }

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Apply settings
  utterance.volume = settings.volume; // 0 to 1
  utterance.rate = settings.speed;    // 0.1 to 10
  
  // Set voice if specified and available
  const voices = synth.getVoices();
  const selectedVoice = voices.find(voice => voice.name === settings.voice);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  // Speak the text
  synth.speak(utterance);
  
  return new Promise<boolean>((resolve) => {
    utterance.onend = () => {
      resolve(true);
    };
    utterance.onerror = () => {
      resolve(false);
    };
    
    // Safety timeout in case the speech synthesis hangs
    setTimeout(() => {
      if (synth.speaking) {
        synth.cancel(); // Cancel current speech
        resolve(false);
      }
    }, 15000); // 15 second timeout
  });
};

// Update voice settings
export const updateVoiceSettings = (updates: Partial<VoiceSettings>): VoiceSettings => {
  // Default settings
  const defaultSettings: VoiceSettings = {
    enabled: true,
    volume: 0.8,
    voice: '',
    speed: 1.0
  };
  
  // Get current settings from localStorage if available
  let currentSettings = defaultSettings;
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedSettings = localStorage.getItem('voiceSettings');
    if (savedSettings) {
      try {
        currentSettings = { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error('Failed to parse saved voice settings:', e);
      }
    }
  }
  
  // Apply updates
  const newSettings = { ...currentSettings, ...updates };
  
  // Save to localStorage if available
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('voiceSettings', JSON.stringify(newSettings));
  }
  
  return newSettings;
};
