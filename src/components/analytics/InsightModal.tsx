
import React from 'react';
import { useVoice } from '@/hooks/useVoice';

const InsightModal: React.FC = () => {
  const voice = useVoice();

  const handleClick = () => {
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

export default InsightModal;
