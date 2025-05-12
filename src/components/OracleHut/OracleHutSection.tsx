
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import styles from './styles.module.css';
import { OracleHutEngine } from './OracleHutEngine';
import VoiceOracleAI from './VoiceOracleAI';

interface Message {
  role: 'user' | 'oracle';
  content: string;
  id: string;
}

const OracleHutSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced prompts for the full page experience
  const samplePrompts = [
    "Compare Nairobi and Dubai logistics",
    "Best forwarder for electronics from Asia",
    "Container recommendation for 15 tons of medical supplies",
    "Route analysis from Kenya to Zimbabwe",
    "Logistics karmic consequences of South Sudan delays",
    "Symbolic insights on port congestion patterns"
  ];

  useEffect(() => {
    // Add welcome message when component mounts
    setMessages([
      {
        role: 'oracle',
        content: "🔮 Welcome to the Oracle Hut. I provide symbolic insights on logistics operations, forwarder rankings, and route efficiency through ancient wisdom and modern analytics. How may I illuminate your supply chain today?",
        id: 'welcome'
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      // Process through the symbolic engine
      const response = await OracleHutEngine(userMessage.content);

      const oracleMessage: Message = {
        role: 'oracle',
        content: response,
        id: `oracle-${Date.now()}`
      };

      setMessages(prev => [...prev, oracleMessage]);
    } catch (error) {
      console.error('Oracle Hut error:', error);
      
      const errorMessage: Message = {
        role: 'oracle',
        content: "⚠️ The oracle's vision is clouded. Please reformulate your query to access the symbolic wisdom.",
        id: `error-${Date.now()}`
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceMessage = (message: string) => {
    // Add the AI's voice message to the chat
    const oracleMessage: Message = {
      role: 'oracle',
      content: message,
      id: `oracle-voice-${Date.now()}`
    };
    
    setMessages(prev => [...prev, oracleMessage]);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <div className="container mx-auto pt-20 pb-24 px-4 max-w-4xl">
      <div className={styles.chatBox + " h-[75vh]"}>
        <div className={styles.header}>
          <span><span className={styles.symbolIcon}>🔮</span>Oracle Hut</span>
          <div className={styles.headerControls}>
            <button
              className={styles.voiceToggle}
              onClick={toggleVoice}
              aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
              title={voiceEnabled ? "Disable voice" : "Enable voice"}
            >
              <Mic size={18} className={voiceEnabled ? styles.activeVoice : ''} />
            </button>
          </div>
        </div>
        
        <div className={`${styles.messages} h-[calc(100%-180px)]`}>
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={msg.role === 'oracle' ? styles.oracleMsg : styles.userMsg}
            >
              {msg.content}
            </div>
          ))}
          
          {isLoading && (
            <div className={`${styles.oracleMsg} ${styles.loadingDots}`}>
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {voiceEnabled && <VoiceOracleAI isOpen={true} onMessageReceived={handleVoiceMessage} />}
        
        <div className={styles.prompt}>
          <div className="text-[#00FFD1] mb-2">Sample Inquiries:</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {samplePrompts.map((prompt, index) => (
              <button 
                key={index}
                className={styles.promptButton}
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
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
      </div>
    </div>
  );
};

export default OracleHutSection;
