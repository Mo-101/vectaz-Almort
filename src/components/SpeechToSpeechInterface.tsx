
import React from 'react';
import { useVoice } from '@/hooks/useVoice';

const SpeechToSpeechInterface: React.FC = () => {
  const voice = useVoice();

  const handleClick = () => {
    // Handle toggle mute functionality
    voice.toggleMute();
  };

  return (
    <div>
      <button onClick={handleClick}>
        {voice.isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

export default SpeechToSpeechInterface;
