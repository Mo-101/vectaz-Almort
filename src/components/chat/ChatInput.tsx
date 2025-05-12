
import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  setInput, 
  handleSendMessage, 
  isProcessing 
}) => {
  const { toast } = useToast();

  return (
    <div className="p-2 sm:p-4 border-t border-blue-500/20">
      <div className="flex items-center gap-1 sm:gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about routes, forwarders, or risk metrics..."
          className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-blue-500/20 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <Button 
          onClick={handleSendMessage}
          disabled={!input.trim() || isProcessing}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 sm:h-10 sm:w-10"
        >
          {isProcessing ? (
            <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
          ) : (
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
