
export interface Message {
  id?: string;
  text: string;
  sender: string;
  timestamp?: Date;
}

export interface MessageListProps {
  messages: Message[];
  isProcessing?: boolean;
}
