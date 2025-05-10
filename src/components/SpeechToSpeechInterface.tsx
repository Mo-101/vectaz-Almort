
import React from 'react';
import { useVoice } from '@/hooks/useVoice';

const SpeechToSpeechInterface: React.FC = () => {
  const voice = useVoice();

  const handleClick = () => {
    // Handle toggle mute functionality
    voice.toggleMute();
  };

  const handleSpeak = () => {
    voice.speak("Hello, this is a test message", "en-US", 1.2, 1.3);
  };

  return (
    <div>
      <button onClick={handleClick}>
        {voice.isMuted ? 'Unmute' : 'Mute'}
      </button>
      <button onClick={handleSpeak}>
        Speak Test Message
      </button>
    </div>
  );
};

export default SpeechToSpeechInterface;
