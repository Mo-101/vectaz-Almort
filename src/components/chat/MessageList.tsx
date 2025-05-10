
import React from 'react';
import { MessageListProps } from './types';
import MessageItem from './MessageItem';
import { Loader2 } from 'lucide-react';

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing = false }) => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {messages.map((message, index) => (
        <MessageItem 
          key={message.id || index} 
          message={{
            ...message,
            id: message.id || `msg-${index}` // Ensure id is always present
          }} 
          isProcessing={false} 
        />
      ))}
      
      {isProcessing && (
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;
