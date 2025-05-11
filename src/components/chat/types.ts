
export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  // Backward compatibility with DeepTalk component
  sender?: 'user' | 'ai';
  text?: string;
  personality?: string;
  model?: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface ChatAction {
  type: 'add_message' | 'set_typing' | 'clear';
  payload?: any;
}

export interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
}
