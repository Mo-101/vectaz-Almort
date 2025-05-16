
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import DeepCalChat from '@/components/chat/DeepTalkChat';
import { initVoiceSystem } from '@/utils/conversational/deeptalk_conversational';
import { ShipmentDetails } from '@/hooks/freight/types';

interface ChatBotProps {
  onShipmentDetailsExtracted?: (shipmentDetails: ShipmentDetails) => void;
  onAnalysisRequested?: () => void;
  analysisResults?: any;
}

const ChatBot: React.FC<ChatBotProps> = ({ 
  onShipmentDetailsExtracted,
  onAnalysisRequested,
  analysisResults
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFieldMode, setIsFieldMode] = useState(false);
  const [isVoiceInitialized, setIsVoiceInitialized] = useState(false);

  // Initialize voice system when component mounts
  useEffect(() => {
    initVoiceSystem().then(supported => {
      setIsVoiceInitialized(supported);
    });

    // Check if we're in field mode (could be based on connection status)
    const checkConnectionStatus = () => {
      setIsFieldMode(!navigator.onLine);
    };

    // Check connection status initially and when it changes
    checkConnectionStatus();
    window.addEventListener('online', checkConnectionStatus);
    window.addEventListener('offline', checkConnectionStatus);

    return () => {
      window.removeEventListener('online', checkConnectionStatus);
      window.removeEventListener('offline', checkConnectionStatus);
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-analytics-teal hover:bg-analytics-teal/90 shadow-lg flex items-center justify-center z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[380px] sm:w-[440px] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <DeepCalChat 
                onShipmentDetailsExtracted={onShipmentDetailsExtracted}
                onAnalysisRequested={onAnalysisRequested}
                analysisResults={analysisResults}
                isFieldMode={isFieldMode}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatBot;
