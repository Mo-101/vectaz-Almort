
import React from 'react';
import { Mic, Mail, Table } from 'lucide-react';
import styles from '../styles.module.css';

interface ChatHeaderProps {
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onToggleEmailInput: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  voiceEnabled, 
  onToggleVoice, 
  onToggleEmailInput 
}) => {
  return (
    <div className={styles.header}>
      <span><span className={styles.symbolIcon}>🔮</span>Oracle Hut</span>
      <div className={styles.headerControls}>
        <button
          className={styles.voiceToggle}
          onClick={onToggleVoice}
          aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
          title={voiceEnabled ? "Disable voice" : "Enable voice"}
        >
          <Mic size={18} className={voiceEnabled ? styles.activeVoice : ''} />
        </button>
        
        <div className="ml-2 text-[#00FFD1] flex items-center">
          <Table size={16} className="mr-1" />
          <span className="text-xs">Table support enabled</span>
        </div>

        {/* Email button */}
        <button
          className="ml-3 text-[#00FFD1] hover:text-white transition-colors"
          onClick={onToggleEmailInput}
          title="Send insight to email"
        >
          <Mail size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
