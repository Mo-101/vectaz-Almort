
import React, { useEffect, useState } from 'react';
import { useConversation } from '@11labs/react';
import styles from './styles.module.css';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const ELEVENLABS_AGENT_ID = 'kWY3sE6znRmHQqPy48sk'; // The agent ID provided by user

interface VoiceOracleAIProps {
  isOpen: boolean;
  onMessageReceived: (message: string) => void;
}

const VoiceOracleAI = ({ isOpen, onMessageReceived }: VoiceOracleAIProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const conversation = useConversation({
    onMessage: (message) => {
      // When we receive a message from the AI, pass it to the parent
      if (message.type === 'llmResponse' && message.final) {
        onMessageReceived(message.text);
      }
    },
    onError: (error) => {
      console.error('ElevenLabs AI error:', error);
      onMessageReceived("I encountered an error connecting to my voice system. Let's continue with text chat.");
    }
  });

  // Check for microphone permission
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasPermission(permissionStatus.state === 'granted');
        
        permissionStatus.onchange = () => {
          setHasPermission(permissionStatus.state === 'granted');
        };
      } catch (error) {
        console.error('Error checking microphone permission:', error);
        setHasPermission(false);
      }
    };
    
    checkMicPermission();
  }, []);

  // Connect to ElevenLabs when component mounts and is open
  useEffect(() => {
    const connectToElevenLabs = async () => {
      if (isOpen && hasPermission) {
        try {
          await conversation.startSession({
            agentId: ELEVENLABS_AGENT_ID
          });
        } catch (error) {
          console.error('Failed to start ElevenLabs session:', error);
        }
      }
    };

    if (isOpen && hasPermission) {
      connectToElevenLabs();
    }

    return () => {
      if (conversation.status === 'connected') {
        conversation.endSession();
      }
    };
  }, [isOpen, hasPermission, conversation]);

  // Handle mute/unmute
  const toggleMute = async () => {
    if (conversation.status === 'connected') {
      try {
        await conversation.setVolume({ volume: isMuted ? 1 : 0 });
        setIsMuted(!isMuted);
      } catch (error) {
        console.error('Failed to toggle mute:', error);
      }
    }
  };

  // Request microphone permission
  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      setHasPermission(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.voiceControls}>
      {hasPermission === false && (
        <button 
          onClick={requestMicPermission} 
          className={styles.voiceButton}
          title="Enable microphone"
        >
          <Mic size={18} />
          <span>Enable voice</span>
        </button>
      )}
      
      {hasPermission === true && (
        <>
          <div className={styles.voiceStatus}>
            <span>Voice {conversation.status === 'connected' ? 'connected' : 'connecting...'}</span>
            {conversation.isSpeaking && <span className={styles.speakingIndicator}>Speaking</span>}
          </div>
          
          <button 
            onClick={toggleMute} 
            className={styles.voiceButton}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </>
      )}
    </div>
  );
};

export default VoiceOracleAI;
