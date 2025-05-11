
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import MessageList from '@/components/chat/MessageList';
import { useVoice } from '@/hooks/useVoice';
import { Loader2 } from 'lucide-react';
import { Message } from '@/components/chat/types';

// Add interface for SpeechRecognition Web API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface DeepTalkProps {
  onResult: (scriptId: string) => void;
  className?: string;
  initialMessage?: string;
  onQueryData?: (query: string) => Promise<string>;
  onClose?: () => void;
}

const DeepTalk: React.FC<DeepTalkProps> = ({ onResult, className, initialMessage, onQueryData, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessage ? [{ role: 'assistant', content: initialMessage }] : []
  );
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const voice = useVoice();
  const recognition = useRef<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition is not supported in this browser.');
      return;
    }

    // Use window property with type assertion
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = 'en-US';

    recognition.current.onstart = () => {
      setIsProcessing(true);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Listening...' }]);
    };

    recognition.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      setInput(transcript);
      setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'user', content: transcript }]);
      processInput(transcript);
    };

    recognition.current.onend = () => {
      setIsProcessing(false);
    };

    recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsProcessing(false);
      setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'assistant', content: `Error: ${event.error}` }]);
    };

    return () => {
      if (recognition.current) {
        recognition.current.onstart = null;
        recognition.current.onresult = null;
        recognition.current.onend = null;
        recognition.current.onerror = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition.current) {
      if (voice.isSpeaking) {
        voice.stop(); // Stop any ongoing speech before listening
      }
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Listening...' }]);
      recognition.current.start();
    }
  }, [voice]);

  const stopListening = useCallback(() => {
    if (recognition.current && isProcessing) {
      recognition.current.stop();
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const toggleMute = useCallback(() => {
    setIsMuted(prevMuted => !prevMuted);
    voice.toggleMute();
  }, [voice]);

  const processInput = async (text: string) => {
    setIsProcessing(true);
    setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Processing...' }]);

    try {
      // Use onQueryData if provided, otherwise use default behavior
      if (onQueryData) {
        const response = await onQueryData(text);
        setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'assistant', content: response }]);
        
        if (!voice.isMuted) {
          voice.speak(response, 'en-US', 1.2, 1.3);
        }
      } else {
        // Simulate processing with a timeout
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Placeholder logic - replace with actual processing
        if (text.toLowerCase().includes('forwarder')) {
          setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'assistant', content: 'Recommending best forwarder...' }]);
          if (!voice.isMuted) {
            voice.speak('Recommending best forwarder...', 'en-US', 1.2, 1.3);
          }
          onResult('forwarderRecommendation');
        } else if (text.toLowerCase().includes('route')) {
          setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'assistant', content: 'Analyzing optimal route...' }]);
          if (!voice.isMuted) {
            voice.speak('Analyzing optimal route...', 'en-US', 1.2, 1.3);
          }
          onResult('routeOptimization');
        } else {
          setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'assistant', content: 'No specific action triggered.' }]);
          if (!voice.isMuted) {
            voice.speak('No specific action triggered.', 'en-US', 1.2, 1.3);
          }
        }
      }
    } catch (error) {
      console.error('Error processing input:', error);
      setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : String(error)}` }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, { role: 'user', content: input }]);
      processInput(input);
      setInput('');
    }
  };

  return (
    <Card className={`w-full rounded-lg border border-mostar-light-blue/15 bg-black/70 backdrop-blur-md shadow-sm transition-all duration-300 overflow-hidden ${className || ''}`}>
      <CardContent className="p-4">
        <MessageList messages={messages} isProcessing={isProcessing} />
        <form onSubmit={handleInputSubmit} className="mt-4 flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow rounded-md border-gray-700 bg-gray-800 text-white"
          />
          <Button type="submit" className="shrink-0 rounded-md bg-blue-500 hover:bg-blue-400 text-white">
            Send
          </Button>
        </form>
        <div className="mt-4 flex justify-between">
          <Button
            onClick={startListening}
            disabled={isProcessing}
            className="rounded-md bg-green-500 hover:bg-green-400 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Listening...
              </>
            ) : (
              'Start Listening'
            )}
          </Button>
          <Button
            onClick={stopListening}
            disabled={!isProcessing}
            className="rounded-md bg-red-500 hover:bg-red-400 text-white"
          >
            Stop Listening
          </Button>
          <Button
            onClick={toggleMute}
            className="rounded-md bg-gray-700 hover:bg-gray-600 text-white"
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeepTalk;
