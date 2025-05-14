
import React, { useEffect, useRef, useState } from 'react';

interface ElevenLabsConvaiWidgetProps {
  agentId?: string;
}

/**
 * ElevenLabsConvaiWidget - A wrapper component for the ElevenLabs conversational AI widget
 * This component uses the official ElevenLabs convai-widget for voice conversations
 * and connects it to the symbolic engine
 */
const ElevenLabsConvaiWidget = ({ agentId = "kWY3sE6znRmHQqPy48sk" }: ElevenLabsConvaiWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetElementId = 'elevenlabs-convai-container';
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Make sure the script has time to load and initialize
    const timer = setTimeout(() => {
      if (widgetRef.current && !initialized) {
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
          
          // Add event listeners for voice interactions
          widget.addEventListener('message', handleVoiceMessage);
          
          widgetRef.current.appendChild(widget);
          setInitialized(true);
          
          console.log('ElevenLabs widget initialized with agent ID:', agentId);
        }
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      
      // Cleanup event listeners
      const widget = document.getElementById(widgetElementId);
      if (widget) {
        widget.removeEventListener('message', handleVoiceMessage);
      }
    };
  }, [agentId, initialized]);

  // Handler for voice messages from ElevenLabs widget
  const handleVoiceMessage = async (event: any) => {
    if (!event.detail || !event.detail.text) return;
    
    const voiceMessage = event.detail.text;
    console.log('Voice message received:', voiceMessage);

    try {
      // Log voice interaction to voice_training_log (write-only operation)
      const { supabase } = await import('@/integrations/supabase/client');
      
      // This is a write-only operation for logging purposes
      supabase.from('voice_training_log').insert({
        user_message: voiceMessage,
        agent_id: agentId,
        timestamp: new Date().toISOString(),
        session_id: sessionStorage.getItem('voice_session_id') || generateSessionId()
      }).then(response => {
        if (response.error) {
          console.error('Error logging voice message:', response.error);
        }
      });
      
      // Connect to symbolic engine if needed
      // This is optional - ElevenLabs handles the conversation flow already
      // We just log the data for training purposes
    } catch (error) {
      console.error('Error processing voice message:', error);
    }
  };

  // Generate a unique session ID for tracking conversations
  const generateSessionId = () => {
    const sessionId = `voice-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('voice_session_id', sessionId);
    return sessionId;
  };

  return (
    <div 
      ref={widgetRef} 
      className="elevenlabs-convai-wrapper"
    />
  );
};

export default ElevenLabsConvaiWidget;
