
import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Headphones, X } from 'lucide-react';

interface ElevenLabsConvaiWidgetProps {
  agentId?: string;
}

/**
 * ElevenLabsConvaiWidget - A futuristic chat widget that simulates the ElevenLabs conversational AI
 * This version is redesigned to work in offline mode without external dependencies
 * while maintaining the ultra-modern UI aesthetic
 */
const ElevenLabsConvaiWidget = ({ agentId = "kWY3sE6znRmHQqPy48sk" }: ElevenLabsConvaiWidgetProps) => {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setActive(false); // Reset active state when collapsing
    }
  };
  
  // Toggle active state (simulates call start/end)
  const toggleActive = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent events
    setActive(!active);
    
    // Simulate activation with a console message
    console.log(`DeepTalk ${!active ? 'activated' : 'deactivated'} with agent ID: ${agentId}`);
    
    // Add a simulated response after a delay if activating
    if (!active) {
      setTimeout(() => {
        console.log('Simulated agent response: "I am here to assist with your logistical needs."');
      }, 2000);
    }
  };
  
  // For development - override any external connection attempts
  useEffect(() => {
    // Create a no-op function to catch any potential connection attempts
    const originalFetch = window.fetch;
    const externalHosts = [
      'lovable.dev',
      'gptengineer.app',
      'localhost:3000',
      'elevenlabs.io'
    ];
    
    // Override fetch only in development
    if (process.env.NODE_ENV === 'development' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
      
      // Create a fetch intercept function
      window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
        // Convert to string if it's a Request object
        const url = input instanceof Request ? input.url : input.toString();
        
        // Check if the URL contains any of the external hosts we want to block
        if (externalHosts.some(host => url.includes(host))) {
          console.log(`Intercepted fetch call to ${url} - returning mock response`);
          return Promise.resolve(new Response(JSON.stringify({ success: true, mocked: true }), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
          }));
        }
        
        // For all other requests, use the original fetch
        return originalFetch(input, init);
      };
    }
    
    // Clean up the override when the component is unmounted
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Collapsed state - just show the chat button */}
      {!expanded ? (
        <button 
          onClick={toggleExpanded}
          className="flex items-center justify-center p-4 rounded-full bg-[#0A1A2F] border border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#0A1A2F]/80 transition-all shadow-lg hover:shadow-[#00FFD1]/20 group"
          aria-label="Open DeepTalk"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      ) : (
        <div className="glass-panel rounded-2xl p-4 w-64 shadow-xl border border-[#00FFD1]/30 bg-[#0A1A2F]/95">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#00FFD1] font-bold">DeepTalk</h3>
            <button 
              onClick={toggleExpanded}
              className="text-gray-400 hover:text-[#00FFD1] transition-colors"
              aria-label="Close DeepTalk"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="py-3 px-4 rounded-lg bg-[#121E2E] text-sm text-gray-300 mb-4">
            How can I assist with your logistical needs today?
          </div>
          
          <button
            onClick={toggleActive}
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${active ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-[#00FFD1]/20 text-[#00FFD1] hover:bg-[#00FFD1]/30'}`}
          >
            <Headphones className="w-4 h-4" />
            {active ? 'Exit the Deep' : 'Enter the Deep'}
          </button>
          
          {active && (
            <div className="mt-3 text-center text-xs text-[#00FFD1] animate-pulse">
              Resonating...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ElevenLabsConvaiWidget;
