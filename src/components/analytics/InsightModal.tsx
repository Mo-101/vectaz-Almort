
import React from 'react';
import { useVoice } from '@/hooks/useVoice';

const InsightModal: React.FC = () => {
  const voice = useVoice();

  const handleClick = () => {
    voice.toggleMute();
  };

  const handleSpeak = () => {
    voice.speak("This is an insight from the analysis", "en-US", 1.2, 1.3);
  };

  return (
    <div>
      <button onClick={handleClick}>
        {voice.isMuted ? 'Unmute' : 'Mute'}
      </button>
      <button onClick={handleSpeak}>
        Speak Insight
      </button>
    </div>
  );
};

export default InsightModal;
