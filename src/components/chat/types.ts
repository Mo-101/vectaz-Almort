
export interface Message {
  id?: string;
  text: string;
  sender: "user" | "ai";
  timestamp?: Date;
}

export interface MessageListProps {
  messages: Message[];
  isProcessing?: boolean;
}
