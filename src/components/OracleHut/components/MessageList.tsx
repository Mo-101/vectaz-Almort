
import React, { useRef, useEffect } from 'react';
import styles from '../styles.module.css';

interface Message {
  role: 'user' | 'oracle';
  content: string | React.ReactNode;
  id: string;
  hasTable?: boolean;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`${styles.messages} h-[calc(100%-180px)] overflow-y-auto`}>
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
  );
};

export default MessageList;
