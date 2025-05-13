
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import styles from '../styles.module.css';

interface InputAreaProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputArea}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder="Ask the Oracle for symbolic insights..."
        disabled={isLoading}
        className="w-full"
      />
      <button 
        onClick={handleSend} 
        disabled={!input.trim() || isLoading}
        aria-label="Send"
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default InputArea;
