
export interface Message {
  id?: string;
  text: string;
  sender: "user" | "ai";
  timestamp?: Date;  // Changed from required to optional
}

export interface MessageListProps {
  messages: Message[];
  isProcessing?: boolean;
}
