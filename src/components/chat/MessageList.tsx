
import React from 'react';
import { Message, MessageListProps } from './types';
import { Loader2 } from 'lucide-react';

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing = false }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className="mb-2 p-2 rounded border border-gray-700">
          <strong>{message.sender}:</strong> {message.text}
        </div>
      ))}
      {isProcessing && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;
