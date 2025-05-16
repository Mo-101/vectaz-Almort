
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Volume2, VolumeX, Settings } from 'lucide-react';
import { 
  parseConversationalIntent, 
  generateResponse,
  intentToShipmentDetails,
  getFallbackRecommendation
} from '@/utils/conversational/deeptalk_conversational';
import { 
    initVoiceSystem, 
    voiceReply, 
    getAvailableVoices, 
    updateVoiceSettings, 
    SpeechSynthesisVoice,
    VoiceSettings,
} from '@/utils/conversational/deeptalk_voiceReply';

import { ConversationMessage } from '@/utils/conversational/deeptalk_conversational';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';  
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { formatScore } from '@/services/deepExplain';

interface DeepTalkChatProps {
  onShipmentDetailsExtracted?: (shipmentDetails: any) => void;
  onAnalysisRequested?: () => void;
  analysisResults?: any;
  isFieldMode?: boolean;
}

const DeepTalkChat: React.FC<DeepTalkChatProps> = ({ 
  onShipmentDetailsExtracted, 
  onAnalysisRequested,
  analysisResults,
  isFieldMode = false
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      text: "I'm DeepCAL++ Assistant. How can I help with your logistics needs today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    volume: 0.8,
    voice: 'Google UK English Female',
    speed: 1.0
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Initialize voice system
  useEffect(() => {
    initVoiceSystem().then((supported) => {
      setIsVoiceSupported(supported);
      if (supported) {
        setAvailableVoices(getAvailableVoices());
      }
    });

    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechRecognitionSupported(true);
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = false;
      speechRecognitionRef.current.interimResults = false;
      
      speechRecognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Auto send if we get a result
        handleSendMessage(transcript);
      };
      
      speechRecognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      speechRecognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      // Clean up
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleRecording = () => {
    if (isRecording) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start();
        setIsRecording(true);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = (overrideText?: string) => {
    const messageText = overrideText || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: ConversationMessage = {
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Parse intent
    const intent = parseConversationalIntent(messageText);
    
    // Generate response based on intent
    let responseText: string;
    
    // Check if we're in field mode (limited connectivity)
    if (isFieldMode) {
      responseText = getFallbackRecommendation(intent);
    } else {
      // Normal processing
      responseText = generateResponse(intent, analysisResults);
      
      // Convert intent to shipment details if needed
      if (intent.origin || intent.destination) {
        const shipmentDetails = intentToShipmentDetails(intent);
        onShipmentDetailsExtracted?.(shipmentDetails);
      }
      
      // Trigger analysis if requested
      if (intent.action === 'analyze' || intent.action === 'recommend') {
        onAnalysisRequested?.();
      }
    }

    // Add bot response
    const botMessage: ConversationMessage = {
      text: responseText,
      isUser: false,
      timestamp: new Date(),
      parsedIntent: intent
    };

    setMessages(prev => [...prev, botMessage]);

    // Speak response if voice is enabled
    if (voiceSettings.enabled && isVoiceSupported) {
      voiceReply(responseText, voiceSettings).catch(err => {
        console.error('Error with voice reply:', err);
      });
    }
  };

  const toggleVoice = () => {
    setVoiceSettings(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const handleVoiceSettingsChange = (settingKey: keyof VoiceSettings, value: any) => {
    setVoiceSettings(prev => updateVoiceSettings({ [settingKey]: value }));
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-analytics-teal/30 bg-gradient-to-b from-analytics-dark/90 to-analytics-dark">
      <CardHeader className="bg-analytics-teal/10 pb-2 flex-shrink-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-analytics-teal flex items-center">
            <div className="mr-3 h-2 w-2 rounded-full bg-analytics-teal animate-pulse"></div>
            DeepCAL++ Assistant
          </CardTitle>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleVoice}
                    className="h-8 w-8"
                  >
                    {voiceSettings.enabled ? 
                      <Volume2 className="h-4 w-4 text-analytics-teal" /> : 
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {voiceSettings.enabled ? 'Mute Assistant' : 'Unmute Assistant'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4 text-analytics-teal" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Voice Settings</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-enabled">Voice Response</Label>
                    <Switch 
                      id="voice-enabled" 
                      checked={voiceSettings.enabled}
                      onCheckedChange={(checked) => handleVoiceSettingsChange('enabled', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-volume">Volume</Label>
                    <Slider 
                      id="voice-volume"
                      min={0} 
                      max={1} 
                      step={0.1}
                      value={[voiceSettings.volume]}
                      onValueChange={(value) => handleVoiceSettingsChange('volume', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-speed">Speech Rate</Label>
                    <Slider 
                      id="voice-speed"
                      min={0.5} 
                      max={2} 
                      step={0.1}
                      value={[voiceSettings.speed]}
                      onValueChange={(value) => handleVoiceSettingsChange('speed', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-selection">Voice</Label>
                    {availableVoices.length > 0 ? (
                      <Select 
                        value={voiceSettings.voice} 
                        onValueChange={(value) => handleVoiceSettingsChange('voice', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVoices.map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">No voices available</p>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      Close Settings
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto py-4 px-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-analytics-teal text-white ml-auto rounded-tr-none' 
                    : 'bg-analytics-dark/70 border border-analytics-teal/20 text-white mr-auto rounded-tl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {!message.isUser && message.parsedIntent && (
                    <div className="text-xs flex space-x-1">
                      {message.parsedIntent.emergency && (
                        <span className="px-1 bg-red-500/20 text-red-300 rounded">
                          Emergency
                        </span>
                      )}
                      {message.parsedIntent.action && message.parsedIntent.action !== 'info' && (
                        <span className="px-1 bg-analytics-blue/20 text-analytics-blue-light rounded">
                          {message.parsedIntent.action}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <div className="p-3 border-t border-analytics-teal/20">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type your logistics query here..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-analytics-dark/70 border-analytics-teal/30 focus:border-analytics-teal/50"
          />
          
          {isSpeechRecognitionSupported && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleRecording}
              className={`${isRecording ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-analytics-dark/70 border-analytics-teal/30'}`}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          
          <Button 
            onClick={() => handleSendMessage()} 
            disabled={!input.trim()}
            className="bg-analytics-teal hover:bg-analytics-teal/80"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {isFieldMode && (
          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-300 flex items-center">
            <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
            Field Mode Active: Limited connectivity features enabled
          </div>
        )}
      </div>
    </Card>
  );
};

export default DeepTalkChat;