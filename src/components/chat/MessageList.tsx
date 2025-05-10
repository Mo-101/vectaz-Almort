
import React from 'react';
import { MessageListProps, Message } from './types';
import MessageItem from './MessageItem';
import { Loader2 } from 'lucide-react';

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing = false }) => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {messages.map((message, index) => {
        // Ensure message conforms to the Message interface
        const processedMessage: Message = {
          id: message.id || `msg-${index}`, // Ensure id is always present
          text: message.text,
          sender: message.sender,
          timestamp: message.timestamp || new Date() // Provide a default timestamp if not provided
        };
        
        return (
          <MessageItem 
            key={processedMessage.id} 
            message={processedMessage}
          />
        );
      })}
      
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
