
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MessageList from './MessageList';
import PromptSuggestions from './PromptSuggestions';
import { parseConversationalIntent, generateResponse, intentToShipmentDetails, getFallbackRecommendation } from '@/utils/conversational/deeptalk_conversational';
import { toast } from '@/components/ui/use-toast';

interface ShipmentDetails {
  origin: string | null;
  destination: string | null;
  weight: number | null;
  mode: string | null;
  urgent: boolean;
  emergency: boolean;
}

interface DeepTalkChatProps {
  onShipmentDetailsExtracted?: (details: ShipmentDetails) => void;
  onAnalysisRequested?: () => void;
  analysisResults?: any;
  isFieldMode?: boolean;
}

interface ConversationMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  parsedIntent?: any;
}

const DeepTalkChat: React.FC<DeepTalkChatProps> = ({ 
  onShipmentDetailsExtracted,
  onAnalysisRequested,
  analysisResults,
  isFieldMode = false
}) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { 
      text: "Hello! I'm DeepCAL's logistics assistant. How can I help with your shipping needs today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Add assistant response after analysis results come in
  useEffect(() => {
    if (analysisResults && messages.length > 0) {
      // Find the latest user message with analyze intent
      const latestUserMessageWithAnalyzeIntent = [...messages]
        .reverse()
        .find(m => m.isUser && m.parsedIntent?.action === 'analyze');
      
      if (latestUserMessageWithAnalyzeIntent) {
        const aiResponse = generateResponse(
          latestUserMessageWithAnalyzeIntent.parsedIntent, 
          analysisResults
        );
        
        // Add the AI response with analysis results
        setMessages(prev => [
          ...prev,
          {
            text: aiResponse,
            isUser: false,
            timestamp: new Date()
          }
        ]);
      }
    }
  }, [analysisResults]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    processUserMessage(input);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    const userMessage = {
      text: suggestion,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    processUserMessage(suggestion);
  };
  
  const processUserMessage = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // Parse intent from the user message
      const intent = parseConversationalIntent(text);
      
      // Extract shipping details if available
      if (intent.origin || intent.destination) {
        const shipmentDetails = intentToShipmentDetails(intent);
        onShipmentDetailsExtracted?.(shipmentDetails);
      }
      
      // Trigger analysis if requested
      if (intent.action === 'analyze' && intent.origin && intent.destination) {
        onAnalysisRequested?.();
      }
      
      // Generate appropriate response based on intent
      let response;
      
      if (isFieldMode) {
        // Use fallback response in field mode
        response = getFallbackRecommendation(intent);
      } else {
        response = generateResponse(intent);
      }
      
      // Add AI response
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          {
            text: response,
            isUser: false,
            timestamp: new Date(),
            parsedIntent: intent
          }
        ]);
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error('Error processing message:', error);
      setIsProcessing(false);
      
      // Add error response
      setMessages(prev => [
        ...prev, 
        {
          text: "I'm sorry, I encountered an error processing your request. Please try again.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      toast({
        title: "Voice recognition stopped",
        description: "Tap the mic button to start speaking again",
      });
    } else {
      // Start listening
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Please speak your query",
      });
      
      // Simulate voice recognition (in real app, would use Web Speech API)
      setTimeout(() => {
        setIsListening(false);
        const simulatedQuery = "I need to ship medical supplies from Nairobi to Kinshasa urgently";
        setInput(simulatedQuery);
        toast({
          title: "Voice recognized",
          description: simulatedQuery,
        });
      }, 3000);
    }
  };
  
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="p-4 border-b">
          <h3 className="font-medium text-lg">DeepCAL Assistant</h3>
          <p className="text-sm text-gray-500">
            {isFieldMode ? "Field Mode - Limited Connectivity" : "Ask me about shipping routes, costs, or recommendations"}
          </p>
        </div>
        
        <MessageList messages={messages} />
        
        <div className="p-4 border-t mt-auto">
          <PromptSuggestions onSelect={handleSuggestionClick} />
          
          <div className="flex items-center gap-2 mt-2">
            <Button 
              size="icon" 
              variant={isListening ? "destructive" : "secondary"}
              onClick={toggleListening}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isProcessing}
              onClick={handleSend}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeepTalkChat;
