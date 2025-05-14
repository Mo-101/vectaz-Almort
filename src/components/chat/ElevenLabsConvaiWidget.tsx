
import React, { useEffect, useRef } from 'react';

interface ElevenLabsConvaiWidgetProps {
  agentId?: string;
}

/**
 * ElevenLabsConvaiWidget - A wrapper component for the ElevenLabs conversational AI widget
 * This component uses the official ElevenLabs convai-widget for voice conversations
 */
const ElevenLabsConvaiWidget = ({ agentId = "kWY3sE6znRmHQqPy48sk" }: ElevenLabsConvaiWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetElementId = 'elevenlabs-convai-container';

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
