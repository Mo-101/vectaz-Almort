
import React, { useState, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DeepTalk() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Scroll to bottom
    setTimeout(() => scrollToBottom(), 100);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are DeepTalk, a helpful assistant for DeepCAL logistics software. You help users understand logistics concepts, shipping routes, and freight forwarding options. You are concise and helpful.' },
            ...messages,
            userMessage
          ],
        }),
      });
      
      const data = await response.json();
      if (data.choices && data.choices[0]?.message) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.choices[0].message.content 
        }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 h-16 w-16 rounded-full shadow-lg border border-[#00FFD1]/30 bg-[#0A1A2F]/90 hover:scale-105 transition-all duration-200"
        aria-label="Open DeepTalk"
      >
        <div className="flex items-center justify-center h-full">
          <span className="text-[#00FFD1] font-bold text-sm">
            DeepTalk
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-96 max-w-[90vw] rounded-lg border border-[#00FFD1]/30 bg-[#0A1A2F]/95 backdrop-blur-md shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-[#00FFD1]/30 p-4">
            <div>
              <h2 className="font-semibold text-lg text-[#00FFD1]">DeepTalk</h2>
              <p className="text-xs text-gray-400">Powered by DeepCAL</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-2 p-4 h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#00FFD1]/20 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 my-8">
                <p>How can I help you with DeepCAL today?</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm w-fit max-w-[90%]",
                  m.role === "user" 
                    ? "self-end bg-blue-600 text-white" 
                    : "self-start bg-[#001A2F] border border-[#00FFD1]/20 text-white"
                )}
              >
                {m.content}
              </div>
            ))}
            
            {isLoading && (
              <div className="self-start text-[#00FFD1] text-sm flex gap-1 px-3 py-2 rounded-lg bg-[#001A2F] border border-[#00FFD1]/20">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-200">.</span>
                <span className="animate-bounce delay-400">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="flex p-3 border-t border-[#00FFD1]/30">
            <input
              className="flex-1 border border-[#00FFD1]/30 bg-[#001A2F] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00FFD1]"
              placeholder="Ask about DeepCAL..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="ml-2 bg-[#00FFD1]/20 border border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/30"
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
