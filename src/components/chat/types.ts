
export interface Message {
  id?: string;  // Made optional to fix compatibility issues
  text: string;
  sender: "user" | "ai";
  timestamp?: Date;  // Optional timestamp
}

export interface MessageListProps {
  messages: Message[];
  isProcessing?: boolean;
}
