/**
 * Voice response system for DeepCAL++
 */

import { VoiceSettings } from '@/hooks/freight/types';

// Default voice settings
const defaultVoiceSettings: VoiceSettings = {
  enabled: true,
  volume: 1.0,
  voice: 'Google UK English Female', // fallback will be used if not available
  speed: 1.0
};

// Available voices cache
let availableVoices: SpeechSynthesisVoice[] = [];

/**
 * Initialize the voice system and get available voices
 */
export function initVoiceSystem(): Promise<boolean> {
  return new Promise((resolve) => {
    // If speech synthesis is not available, resolve with false
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser');
      resolve(false);
      return;
    }

    // Handle the case when voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      availableVoices = window.speechSynthesis.getVoices();
      resolve(true);
      return;
    }

    // Handle the case when voices need to be loaded
    window.speechSynthesis.onvoiceschanged = () => {
      availableVoices = window.speechSynthesis.getVoices();
      resolve(true);
    };
  });
}

/**
 * Get the best available voice based on settings
 */
export function getBestAvailableVoice(settings: VoiceSettings): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null;
  }

  // If we haven't loaded voices yet, get them
  if (availableVoices.length === 0) {
    availableVoices = window.speechSynthesis.getVoices();
  }

  // Try to find the requested voice
  const requestedVoice = availableVoices.find(voice => voice.name === settings.voice);
  if (requestedVoice) {
    return requestedVoice;
  }

  // Fallback voice preferences in order of preference
  const fallbackVoices = [
    'Google UK English Female',
    'Microsoft Zira',
    'Samantha',
    'Microsoft David'
  ];

  for (const fallbackVoice of fallbackVoices) {
    const voice = availableVoices.find(voice => voice.name === fallbackVoice);
    if (voice) {
      return voice;
    }
  }

  // If no preferred voice is found, return the first available voice
  return availableVoices[0] || null;
}

/**
 * Speak text using the browser's speech synthesis API
 */
export function voiceReply(text: string, settings: VoiceSettings = defaultVoiceSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser');
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    if (!settings.enabled) {
      resolve();
      return;
    }

    // Cancel any current speech
    window.speechSynthesis.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get the best available voice
    const voice = getBestAvailableVoice(settings);
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set other speech properties
    utterance.volume = settings.volume;
    utterance.rate = settings.speed;
    
    // Handle events
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
    
    // Speak
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Get all available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }
  
  return window.speechSynthesis.getVoices();
}

/**
 * Update voice settings
 */
export function updateVoiceSettings(newSettings: Partial<VoiceSettings>, currentSettings: VoiceSettings): VoiceSettings {
  return {
    ...currentSettings,
    ...newSettings
  };
}
