
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Message } from './types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start gap-4 mb-4', isUser ? 'flex-row-reverse' : '')}>
      <Avatar className={cn('mt-1', isUser ? 'bg-blue-600' : 'bg-[#00FFD1]/20')}>
        <AvatarImage src={isUser ? undefined : "/placeholder.svg"} />
        <AvatarFallback>
          {isUser ? 'U' : 'DC'}
        </AvatarFallback>
      </Avatar>
      <div className={cn('rounded-lg px-4 py-2 max-w-[85%]',
        isUser ? 'bg-blue-600 text-white' : 'bg-[#00FFD1]/10 border border-[#00FFD1]/30 text-white'
      )}>
        <p className={cn('text-sm leading-relaxed')}>{message.content}</p>
      </div>
    </div>
  );
};

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export default MessageItem;
