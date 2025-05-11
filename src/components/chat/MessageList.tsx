
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
  isProcessing?: boolean; // Added isProcessing prop
}

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageItem key={message.id || `msg-${Date.now()}`} message={message} />
      ))}
      {isProcessing && (
        <div className="flex items-center text-sm text-gray-400 animate-pulse">
          <span className="mr-2">●</span>
          <span className="mr-1">●</span>
          <span>●</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
