import React from 'react';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.sender}:</strong> {message.text}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
