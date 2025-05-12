
import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import styles from './styles.module.css';
import { OracleHutEngine } from './OracleHutEngine';

interface Message {
  role: 'user' | 'oracle';
  content: string;
  id: string;
}

const OracleHutWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Example prompts to help users get started
  const samplePrompts = [
    "Compare Nairobi and Dubai",
    "Best forwarder for electronics?",
    "Container recommendation for 15 tons",
    "Route analysis from Kenya to Zimbabwe"
  ];

  useEffect(() => {
    if (open && messages.length === 0) {
      // Add welcome message when first opened
      setMessages([
        {
          role: 'oracle',
          content: "🔮 Welcome to Oracle Hut. I can provide symbolic insights on logistics operations, forwarder rankings, and route efficiency. How can I assist your supply chain today?",
          id: 'welcome'
        }
      ]);
    }
  }, [open]);

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
        content: "⚠️ I encountered an error processing your request. Please try again with a different query.",
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

  return (
    <div className={styles.oracleHutContainer}>
      {open ? (
        <div className={styles.chatBox}>
          <div className={styles.header}>
            <span><span className={styles.symbolIcon}>🔮</span>Oracle Hut</span>
            <button 
              className={styles.closeButton} 
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className={styles.messages}>
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
          
          <div className={styles.prompt}>
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
          
          <div className={styles.inputArea}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask the Oracle..."
              disabled={isLoading}
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
      ) : (
        <button 
          className={styles.openButton} 
          onClick={() => setOpen(true)}
          aria-label="Open Oracle Hut"
        >
          <span className={styles.symbolIcon}>🔮</span> Ask Oracle
        </button>
      )}
    </div>
  );
};

export default OracleHutWidget;
