
import React, { useEffect, useRef } from 'react';
import { symbolCacheManager } from '@/lib/symbolic-runtime';

interface ElevenLabsConvaiWidgetProps {
  agentId?: string;
}

/**
 * ElevenLabsConvaiWidget - A wrapper component for the ElevenLabs conversational AI widget
 * This component uses the official ElevenLabs convai-widget for voice conversations
 * and integrates with the symbolic engine for logging and insights.
 */
const ElevenLabsConvaiWidget = ({ agentId = "kWY3sE6znRmHQqPy48sk" }: ElevenLabsConvaiWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetElementId = 'elevenlabs-convai-container';

  // Function to log voice interactions to Supabase
  const logVoiceInteraction = async (userInput: string, aiResponse: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Log to voice_training_log
      await supabase.from('voice_training_log').insert({
        user_message: userInput,
        agent_response: aiResponse,
        agent_id: agentId,
        timestamp: new Date().toISOString(),
        session_id: `session_${Date.now()}`
      });
      
      console.log('Voice interaction logged to Supabase');
    } catch (error) {
      console.error('Failed to log voice interaction to Supabase:', error);
      // Non-critical, continue without error to user
    }
  };

  useEffect(() => {
    // Make sure the script has time to load and initialize
    const timer = setTimeout(() => {
      if (widgetRef.current) {
        // Create the widget element if it doesn't exist
        const existingWidget = document.getElementById(widgetElementId);
        if (!existingWidget) {
          const widget = document.createElement('elevenlabs-convai');
          widget.setAttribute('agent-id', agentId);
          widget.setAttribute('id', widgetElementId);
          
          // Custom styling attributes based on user preferences
          widget.setAttribute('variant', 'expandable');
          widget.setAttribute('background-color', '#0A1A2F');
          widget.setAttribute('text-color', '#00FFD1');
          widget.setAttribute('button-color', '#00FFD1');
          widget.setAttribute('button-text-color', '#0A1A2F');
          widget.setAttribute('border-color', '#00FFD1');
          widget.setAttribute('focus-outline-color', '#00FFD1');
          widget.setAttribute('card-radius', '20');
          widget.setAttribute('button-radius', '32');
          
          // Custom text content
          widget.setAttribute('expand-button-text', 'Have a DeepTalk');
          widget.setAttribute('start-call-button-text', 'Enter the Deep');
          widget.setAttribute('end-call-button-text', 'Exit the Deep');
          widget.setAttribute('listening-status-text', 'Resonating...');
          widget.setAttribute('speaking-status-text', 'Symbolic');
          
          // Setup event listeners for logging and integration
          widget.addEventListener('userStartedSpeaking', (e: any) => {
            console.log('User started speaking');
          });
          
          widget.addEventListener('userStoppedSpeaking', (e: any) => {
            console.log('User stopped speaking');
          });
          
          widget.addEventListener('agentStartedSpeaking', (e: any) => {
            console.log('Agent started speaking');
          });
          
          widget.addEventListener('agentStoppedSpeaking', (e: any) => {
            console.log('Agent stopped speaking');
          });
          
          // Log transcript when available
          widget.addEventListener('transcriptReceived', (e: any) => {
            if (e.detail && e.detail.transcript) {
              console.log('Transcript received:', e.detail.transcript);
              
              // Store user input for later
              sessionStorage.setItem('last_user_voice_input', e.detail.transcript);
            }
          });
          
          // Log and process response when received
          widget.addEventListener('responseReceived', (e: any) => {
            if (e.detail && e.detail.response) {
              console.log('Response received:', e.detail.response);
              
              // Get the stored user input
              const userInput = sessionStorage.getItem('last_user_voice_input') || '';
              
              // Log the interaction to Supabase
              logVoiceInteraction(userInput, e.detail.response);
            }
          });
          
          widgetRef.current.appendChild(widget);
          
          console.log('ElevenLabs widget initialized with agent ID:', agentId);
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [agentId]);

  return (
    <div 
      ref={widgetRef} 
      className="elevenlabs-convai-wrapper"
    />
  );
};

export default ElevenLabsConvaiWidget;
