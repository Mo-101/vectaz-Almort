/**
 * DeepCAL Agent Bridge
 * Ultra-futuristic bridge connecting the Python DeepCAL agent with the voice system
 */

import axios from 'axios';
import { initVoiceSystem, getVoiceSettings, updateVoiceSettings } from '@/utils/conversational/deepTalk_voiceReply';

// Configuration for the DeepCAL server
interface DeepCALConfig {
  baseUrl: string;
  apiToken: string;
  enableVoice: boolean;
}

// Default configuration
const DEFAULT_CONFIG: DeepCALConfig = {
  baseUrl: 'http://localhost:8080',
  apiToken: process.env.REACT_APP_DEEPCAL_TOKEN || 'your_api_token_here',
  enableVoice: true
};

// Current configuration with dynamic updates
let config: DeepCALConfig = { ...DEFAULT_CONFIG };

// Voice system state
let voiceSystemReady = false;

/**
 * Initialize the bridge with the Python DeepCAL agent
 */
export const initDeepCALBridge = async (customConfig?: Partial<DeepCALConfig>): Promise<boolean> => {
  // Update configuration with custom settings if provided
  if (customConfig) {
    config = { ...config, ...customConfig };
  }
  
  // Initialize the voice system
  voiceSystemReady = await initVoiceSystem();
  
  // Test connection to DeepCAL server
  try {
    const response = await axios.get(`${config.baseUrl}/Status`);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to connect to DeepCAL server:', error);
    return false;
  }
};

/**
 * Send a user message to the DeepCAL agent and get a response
 * Optionally convert the response to speech
 */
export const sendMessageToDeepCAL = async (
  message: string,
  conversationId: string = `user_${Date.now()}`,
  speakResponse: boolean = config.enableVoice
): Promise<{ text: string; success: boolean }> => {
  try {
    // Call the DeepCAL REST webhook endpoint
    const response = await axios.post(
      `${config.baseUrl}/webhooks/rest/webhook`,
      {
        sender: conversationId,
        message: message
      },
      {
        params: { token: config.apiToken }
      }
    );
    
    // Extract text response from DeepCAL
    const responseText = response.data?.[0]?.text || "I didn't receive a response from the system.";
    
    // Use the voice system to speak the response if enabled
    if (speakResponse && voiceSystemReady) {
      const voiceSettings = getVoiceSettings();
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.rate = voiceSettings.rate || 1;
      utterance.pitch = voiceSettings.pitch || 1;
      utterance.volume = voiceSettings.volume;
      
      // Find the voice by URI if specified
      if (voiceSettings.voiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.voiceURI === voiceSettings.voiceURI);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    }
    
    return { text: responseText, success: true };
    
  } catch (error) {
    console.error('DeepCAL Bridge Error:', error);
    return { 
      text: "I'm having trouble connecting to my intelligence system.", 
      success: false 
    };
  }
};

/**
 * Get the conversation history from DeepCAL
 */
export const getConversationHistory = async (conversationId: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${config.baseUrl}/conversations/${conversationId}/tracker`,
      {
        params: { 
          token: config.apiToken,
          include_events: "AFTER_RESTART" 
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get conversation history:', error);
    return null;
  }
};

/**
 * Update the DeepCAL server configuration
 */
export const updateDeepCALConfig = (newConfig: Partial<DeepCALConfig>): DeepCALConfig => {
  config = { ...config, ...newConfig };
  return config;
};

/**
 * Get the current DeepCAL configuration
 */
export const getDeepCALConfig = (): DeepCALConfig => {
  return { ...config };
};

/**
 * Parse a message with the DeepCAL NLU
 * Used for intent detection without triggering a full conversation
 */
export const parseMessage = async (text: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${config.baseUrl}/model/parse`,
      { text },
      {
        params: { token: config.apiToken }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to parse message:', error);
    return null;
  }
};

/**
 * Check DeepCAL server health
 */
export const checkDeepCALHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${config.baseUrl}/Status`);
    return response.status === 200;
  } catch {
    return false;
  }
};
