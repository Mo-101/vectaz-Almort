
// Voice synthesis utilities for DeepTalk

// Interface for voice settings
export interface VoiceSettings {
  enabled: boolean;
  volume: number;
  voice: string;
  speed: number;
}

// Interface to match browser's SpeechSynthesisVoice
export interface SpeechSynthesisVoice {
  name: string;
  lang: string;
  default: boolean;
  localService: boolean;
  voiceURI: string;
}

// Initialize the voice system
export const initVoiceSystem = async (): Promise<boolean> => {
  // Check if browser supports speech synthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    console.log('Speech synthesis is supported');
    
    // Initialize voices (this helps some browsers load the voices)
    window.speechSynthesis.getVoices();
    
    return true;
  } else {
    console.log('Speech synthesis is not supported');
    return false;
  }
};

// Get all available voices from the browser
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    
    return voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      localService: voice.localService,
      voiceURI: voice.voiceURI
    }));
  }
  
  return [];
};

// Update voice settings
export const updateVoiceSettings = (
  newSettings: Partial<VoiceSettings>
): VoiceSettings => {
  // In a real app, this would persist settings to localStorage or a database
  const currentSettings: VoiceSettings = {
    enabled: true,
    volume: 0.8,
    voice: 'Google UK English Female',
    speed: 1.0
  };
  
  return { ...currentSettings, ...newSettings };
};

// Generate voice reply for text
export const voiceReply = async (
  text: string,
  settings?: Partial<VoiceSettings>
): Promise<boolean> => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return false;
  }
  
  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings if provided
    if (settings) {
      // Set volume (0 to 1)
      if (typeof settings.volume === 'number') {
        utterance.volume = Math.max(0, Math.min(1, settings.volume));
      }
      
      // Set rate (speed) (0.1 to 10, but practically 0.5 to 2)
      if (typeof settings.speed === 'number') {
        utterance.rate = Math.max(0.5, Math.min(2, settings.speed));
      }
      
      // Set voice
      if (settings.voice) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === settings.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
    }
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    
    return true;
  } catch (error) {
    console.error('Error with speech synthesis:', error);
    return false;
  }
};

// Check if the system is currently speaking
export const isSpeaking = (): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
