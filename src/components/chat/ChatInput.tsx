
import React, { useState, useRef } from 'react';
import { Send, Mic, MicOff, Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { AudioRecorder, RecordingState } from '@/utils/audioRecorder';
import { supabase } from '@/integrations/supabase/client';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  setInput, 
  handleSendMessage, 
  isProcessing 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();
  const recorderRef = useRef<AudioRecorder | null>(null);

  // Check if audio recording is supported
  useState(() => {
    const supported = AudioRecorder.isSupported();
    setIsSupported(supported);
    
    if (!supported) {
      console.warn("Audio recording is not supported in this browser");
    }
  });

  const startRecording = async () => {
    if (!isSupported) {
      toast({
        title: "Microphone Access Error",
        description: "Voice recording is not supported in your browser. Please try a different browser or type your message.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Initialize recorder if needed
      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorder({
          onStateChange: (state) => {
            if (state === RecordingState.ERROR) {
              setIsRecording(false);
              toast({
                title: "Recording Error",
                description: "There was an error recording your voice. Please try again.",
                variant: "destructive",
              });
            }
          }
        });
      }
      
      // Start recording
      await recorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "I'm listening. Speak clearly...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;
    
    setIsProcessingAudio(true);
    
    try {
      // Stop recording and get audio blob
      const audioBlob = await recorderRef.current.stop();
      setIsRecording(false);
      
      // Convert to base64
      const base64Audio = await AudioRecorder.blobToBase64(audioBlob);
      
      toast({
        title: "Processing Your Voice",
        description: "Converting your speech to text...",
      });
      
      // Send to speech-to-text function
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        throw new Error(`Speech recognition failed: ${error.message}`);
      }
      
      if (!data?.text) {
        throw new Error('No transcript received');
      }
      
      // Update input with transcribed text
      setInput(data.text);
      
      // Automatically send the transcribed message after a brief delay
      if (data.text.trim()) {
        setTimeout(() => {
          handleSendMessage();
        }, 500);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Speech Recognition Error",
        description: "We couldn't understand that. Please try again or type your question.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAudio(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 border-t border-blue-500/20">
      <div className="flex items-center gap-1 sm:gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about routes, forwarders, or risk metrics..."
          className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-blue-500/20 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {isSupported && (
          <Button 
            onClick={isRecording ? stopRecording : startRecording}
            size="sm"
            variant="outline"
            disabled={isProcessingAudio}
            className={cn(
              "bg-transparent border border-blue-500/20 h-8 w-8 sm:h-10 sm:w-10",
              isRecording ? "text-red-400 hover:text-red-500" : "text-blue-400 hover:text-blue-500",
              isProcessingAudio && "opacity-50"
            )}
          >
            {isProcessingAudio ? (
              <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        )}
        
        <Button 
          onClick={handleSendMessage}
          disabled={!input.trim() || isProcessing || isProcessingAudio}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 sm:h-10 sm:w-10"
        >
          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
