
import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder, RecordingState } from '@/utils/audioRecorder';
import { supabase } from '@/integrations/supabase/client';

interface SpeechToSpeechInputProps {
  onTranscriptReceived: (text: string) => void;
  isListening?: boolean;
  className?: string;
  onStateChange?: (state: RecordingState) => void;
}

const SpeechToSpeechInput: React.FC<SpeechToSpeechInputProps> = ({
  onTranscriptReceived,
  isListening: externalIsListening,
  className,
  onStateChange
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recorder = useRef<AudioRecorder | null>(null);
  const { toast } = useToast();
  
  // Use external state if provided, otherwise use internal state
  const listening = externalIsListening !== undefined ? externalIsListening : isListening;

  // Check if audio recording is supported
  useEffect(() => {
    const supported = AudioRecorder.isSupported();
    setIsSupported(supported);
    
    if (!supported) {
      toast({
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support audio recording. Please try a different browser.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  }, [toast]);
  
  // Initialize recorder
  useEffect(() => {
    if (isSupported && !recorder.current) {
      recorder.current = new AudioRecorder({
        onStateChange: (state) => {
          if (onStateChange) onStateChange(state);
          
          if (state === RecordingState.ERROR) {
            setIsListening(false);
            setIsProcessing(false);
            toast({
              title: 'Recording Error',
              description: 'There was an error with your microphone. Please try again.',
              variant: 'destructive',
            });
          }
        },
        echoCancellation: true,
        noiseSuppression: true,
      });
    }
    
    return () => {
      if (recorder.current) {
        recorder.current.releaseResources();
        recorder.current = null;
      }
    };
  }, [isSupported, onStateChange, toast]);
  
  const startListening = async () => {
    if (!isSupported || isProcessing) return;
    
    try {
      if (!recorder.current) {
        recorder.current = new AudioRecorder({
          onStateChange: (state) => {
            if (onStateChange) onStateChange(state);
          }
        });
      }
      
      await recorder.current.start();
      
      // Only update internal state if external state isn't provided
      if (externalIsListening === undefined) {
        setIsListening(true);
      }
      
      toast({
        title: 'Listening',
        description: 'Speak now... Click the mic button again to stop.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error starting microphone:', error);
      toast({
        title: 'Microphone Error',
        description: 'Could not access your microphone. Please check your permissions.',
        variant: 'destructive',
      });
    }
  };
  
  const stopListening = async () => {
    if (!recorder.current || !isSupported || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Stop the recorder and get the audio blob
      const audioBlob = await recorder.current.stop();
      
      // Convert audio blob to base64
      const base64Audio = await AudioRecorder.blobToBase64(audioBlob);
      
      // Use Supabase client to call the speech-to-text edge function
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        throw new Error(`Error in speech recognition: ${error.message}`);
      }
      
      if (!data?.text) {
        throw new Error('No transcript received');
      }
      
      // Pass the transcript to the parent component
      onTranscriptReceived(data.text);
      
    } catch (error) {
      console.error('Error processing speech:', error);
      toast({
        title: 'Speech Recognition Error',
        description: 'Could not understand the audio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      
      // Only update internal state if external state isn't provided
      if (externalIsListening === undefined) {
        setIsListening(false);
      }
    }
  };
  
  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  if (!isSupported) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-gray-500/20 text-gray-400 border-gray-400 opacity-50"
          disabled={true}
          aria-label="Voice recognition not supported"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <span className="ml-2 text-sm text-gray-400">Not supported in this browser</span>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className={`h-10 w-10 rounded-full ${listening ? 'bg-red-500/20 text-red-500 border-red-500' : 'bg-blue-500/20 text-blue-400 border-blue-400'}`}
        onClick={toggleListening}
        disabled={isProcessing}
        aria-label={listening ? 'Stop recording' : 'Start recording'}
      >
        {isProcessing ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : listening ? (
          <StopCircle className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {isProcessing && (
        <span className="ml-2 text-sm text-gray-400">Processing speech...</span>
      )}
      
      {listening && !isProcessing && (
        <span className="ml-2 text-sm text-green-400 animate-pulse">Listening...</span>
      )}
    </div>
  );
};

export default SpeechToSpeechInput;
