/**
 * DeepTalk Voice Reply System
 * Ultra-futuristic voice interaction system for conversational AI
 */

// Re-exporting the SpeechSynthesisVoice type from the browser
export type SpeechSynthesisVoice = globalThis.SpeechSynthesisVoice;

// Voice settings configuration
export interface VoiceSettings {
  pitch?: number;
  rate?: number;
  volume: number;
  voice: string; // Voice name or URI
  voiceURI?: string;
  enabled: boolean;
  autoplay?: boolean;
  speed?: number; // Alias for rate used in UI
}

// Default voice settings
const defaultVoiceSettings: VoiceSettings = {
  pitch: 1.0,
  rate: 1.0,
  volume: 0.8,
  voice: 'Google UK English Female',
  voiceURI: '',
  enabled: true,
  autoplay: true,
  speed: 1.0
};

// Current settings (with persistence)
let currentSettings: VoiceSettings = { ...defaultVoiceSettings };

// Try to load settings from localStorage
try {
  const savedSettings = localStorage.getItem('deepTalkVoiceSettings');
  if (savedSettings) {
    currentSettings = { ...defaultVoiceSettings, ...JSON.parse(savedSettings) };
  }
} catch (error) {
  console.warn('Failed to load voice settings from storage:', error);
}

/**
 * Initializes the voice system and checks browser compatibility
 * @returns Promise resolving to boolean indicating if voice is supported
 */
export const initVoiceSystem = async (): Promise<boolean> => {
  // Check if browser supports speech synthesis
  const isSynthesisSupported = 'speechSynthesis' in window;
  
  // Check if browser supports speech recognition
  const isRecognitionSupported = 'webkitSpeechRecognition' in window || 
                              'SpeechRecognition' in window;
  
  // Pre-load available voices if supported
  if (isSynthesisSupported) {
    await loadVoices();
    
    // Set a default voice if none is selected yet
    if (!currentSettings.voiceURI) {
      const voices = getAvailableVoices();
      if (voices.length > 0) {
        // Prefer English voices
        const englishVoices = voices.filter(v => v.lang.includes('en'));
        const voice = englishVoices.length > 0 ? englishVoices[0] : voices[0];
        currentSettings.voiceURI = voice.voiceURI;
        saveSettings();
      }
    }
  }
  
  return isSynthesisSupported;
};

/**
 * Load voices asynchronously
 */
const loadVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  
  // Some browsers need a small delay to load voices
  if (window.speechSynthesis.getVoices().length === 0) {
    await new Promise<void>(resolve => {
      const voicesChangedHandler = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
        resolve();
      };
      window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
      
      // Fallback timeout in case event never fires
      setTimeout(resolve, 1000);
    });
  }
  
  return window.speechSynthesis.getVoices();
};

/**
 * Speaks the provided text using speech synthesis
 * @param text Text to be spoken
 * @returns Promise that resolves when speech is complete
 */
export const voiceReply = (text: string, customSettings?: Partial<VoiceSettings>): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window) || !currentSettings.enabled) {
      resolve();
      return;
    }
    
    // Create utterance with text
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    utterance.pitch = currentSettings.pitch;
    utterance.rate = currentSettings.rate;
    utterance.volume = currentSettings.volume;
    
    // Find and set the selected voice
    if (currentSettings.voiceURI) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.voiceURI === currentSettings.voiceURI);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    // Setup event handlers
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      reject(new Error(`Speech synthesis error: ${event}`));
    };
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Gets available system voices
 * @param preferredLanguage Optional language code (e.g., 'en-US')
 * @param forceRefresh Force refresh of voices list
 * @returns Array of available voices, filtered by language if specified
 */
export const getAvailableVoices = (preferredLanguage?: string, forceRefresh?: boolean): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  
  const voices = window.speechSynthesis.getVoices();
  
  if (preferredLanguage) {
    return voices.filter(voice => voice.lang.includes(preferredLanguage));
  }
  
  return voices;
};

/**
 * Update voice settings
 * @param newSettings Partial voice settings to update
 * @returns Updated voice settings
 */
export const updateVoiceSettings = (newSettings: Partial<VoiceSettings>): VoiceSettings => {
  currentSettings = {
    ...currentSettings,
    ...newSettings
  };
  
  // Persist settings
  saveSettings();
  
  return currentSettings;
};

/**
 * Save current settings to localStorage
 */
const saveSettings = () => {
  try {
    localStorage.setItem('deepTalkVoiceSettings', JSON.stringify(currentSettings));
  } catch (error) {
    console.warn('Failed to save voice settings to storage:', error);
  }
};

/**
 * Get current voice settings
 * @returns Current voice settings
 */
export const getVoiceSettings = (): VoiceSettings => {
  return { ...currentSettings };
};
