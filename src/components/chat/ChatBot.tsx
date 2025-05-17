
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DeepTalkChat from '@/components/chat/DeepTalkChat';
import { initVoiceSystem } from '@/utils/conversational/deeptalk_conversational';
import { toast } from '@/components/ui/use-toast';

interface ShipmentDetails {
  origin: string | null;
  destination: string | null;
  weight: number | null;
  mode: string | null;
  urgent: boolean;
  emergency: boolean;
}

const ChatBot: React.FC = () => {
  const [isVoiceInitialized, setIsVoiceInitialized] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  // Initialize voice system on component mount
  useEffect(() => {
    const initVoice = async () => {
      try {
        const result = await initVoiceSystem();
        // Convert to boolean explicitly
        setIsVoiceInitialized(result && (result.status === 'initialized'));
        
        if (result && result.status === 'initialized') {
          toast({
            title: "Voice system initialized",
            description: "You can now use voice commands with DeepCAL",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Failed to initialize voice system:', error);
        toast({
          title: "Voice system failed",
          description: "Unable to initialize voice capabilities",
          variant: "destructive"
        });
      }
    };
    
    initVoice();
  }, []);
  
  const handleShipmentDetailsExtracted = (shipmentDetails: ShipmentDetails) => {
    console.log('Shipment details extracted:', shipmentDetails);
    // Here you would typically update a form or trigger an action based on extracted details
    toast({
      title: "Shipment Details Captured",
      description: `From ${shipmentDetails.origin} to ${shipmentDetails.destination}${shipmentDetails.weight ? ` - ${shipmentDetails.weight}kg` : ''}`,
      variant: "default"
    });
  };
  
  const handleAnalysisRequested = () => {
    console.log('Analysis requested');
    // Simulate analysis being performed
    setTimeout(() => {
      setAnalysisResults({
        recommendedForwarders: ['DHL Express', 'Maersk Line'],
        estimatedCost: '$3,450',
        estimatedTime: '7-10 days',
        riskLevel: 'Low'
      });
    }, 1500);
  };
  
  return (
    <div className="w-full h-full">
      <DeepTalkChat 
        onShipmentDetailsExtracted={handleShipmentDetailsExtracted}
        onAnalysisRequested={handleAnalysisRequested}
        analysisResults={analysisResults}
        isFieldMode={false}
      />
    </div>
  );
};

export default ChatBot;
