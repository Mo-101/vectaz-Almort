
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Table, TableProperties } from 'lucide-react';
import styles from './styles.module.css';
import { OracleHutEngine } from './OracleHutEngine';
import VoiceOracleAI from './VoiceOracleAI';
import { Table as UITable, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface Message {
  role: 'user' | 'oracle';
  content: string | React.ReactNode;
  id: string;
  hasTable?: boolean;
}

const OracleHutSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced prompts for the full page experience
  const samplePrompts = [
    "Compare Nairobi and Dubai logistics",
    "Best forwarder for electronics from Asia",
    "Container recommendation for 15 tons of medical supplies",
    "Route analysis from Kenya to Zimbabwe",
    "Show me logistics performance data in a table",
    "Generate a comparison table of freight carriers"
  ];

  useEffect(() => {
    // Add welcome message when component mounts
    setMessages([
      {
        role: 'oracle',
        content: "🔮 Welcome to the Oracle Hut. I provide symbolic insights on logistics operations, forwarder rankings, and route efficiency through ancient wisdom and modern analytics. How may I illuminate your supply chain today? I can display information in tables when appropriate.",
        id: 'welcome'
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to detect table format in text
  const processResponseWithTables = (text: string): React.ReactNode => {
    // Check if the response contains a table marker
    if (text.includes('|') && (text.includes('\n|') || text.includes('|-'))) {
      try {
        // Extract table content
        const parts = text.split('```');
        let result = [];
        let currentIndex = 0;

        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            // This is regular text
            if (parts[i].trim()) {
              result.push(<div key={`text-${currentIndex}`}>{parts[i]}</div>);
              currentIndex++;
            }
          } else {
            // This might be a table or code
            if (parts[i].trim().startsWith('table') || parts[i].includes('|')) {
              const tableContent = parts[i].replace('table', '').trim();
              const rows = tableContent.split('\n').filter(row => row.includes('|'));
              
              if (rows.length >= 2) {
                // Process header row
                const headers = rows[0].split('|')
                  .map(h => h.trim())
                  .filter(h => h);
                
                // Process data rows
                const dataRows = rows.slice(2); // Skip header and separator rows
                
                result.push(
                  <div key={`table-${currentIndex}`} className="my-4 overflow-x-auto bg-slate-800/80 rounded-lg border border-[#00FFD1]/30">
                    <UITable>
                      <TableHeader>
                        <TableRow className="border-b border-[#00FFD1]/20">
                          {headers.map((header, idx) => (
                            <TableHead key={`header-${idx}`} className="text-[#00FFD1]">{header}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataRows.map((row, rowIdx) => {
                          const cells = row.split('|')
                            .map(cell => cell.trim())
                            .filter(cell => cell !== '');
                          
                          return (
                            <TableRow key={`row-${rowIdx}`} className="border-b border-[#00FFD1]/10">
                              {cells.map((cell, cellIdx) => (
                                <TableCell key={`cell-${rowIdx}-${cellIdx}`}>{cell}</TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </UITable>
                  </div>
                );
                currentIndex++;
              } else {
                result.push(<div key={`code-${currentIndex}`}><pre>{parts[i]}</pre></div>);
                currentIndex++;
              }
            } else {
              result.push(<div key={`code-${currentIndex}`}><pre>{parts[i]}</pre></div>);
              currentIndex++;
            }
          }
        }
        
        return <>{result}</>;
      } catch (e) {
        console.error("Error parsing table:", e);
        return text;
      }
    }
    
    return text;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      // Process through the symbolic engine
      const response = await OracleHutEngine(userMessage.content as string);
      
      // Check if response contains table markers
      const hasTable = response.includes('|') && (response.includes('\n|') || response.includes('|-'));
      const processedContent = hasTable ? processResponseWithTables(response) : response;

      const oracleMessage: Message = {
        role: 'oracle',
        content: processedContent,
        id: `oracle-${Date.now()}`,
        hasTable
      };

      setMessages(prev => [...prev, oracleMessage]);
    } catch (error) {
      console.error('Oracle Hut error:', error);
      
      const errorMessage: Message = {
        role: 'oracle',
        content: "⚠️ The oracle's vision is clouded. Please reformulate your query to access the symbolic wisdom.",
        id: `error-${Date.now()}`
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceMessage = (message: string) => {
    // Add the AI's voice message to the chat
    const oracleMessage: Message = {
      role: 'oracle',
      content: message,
      id: `oracle-voice-${Date.now()}`
    };
    
    setMessages(prev => [...prev, oracleMessage]);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <div className="container mx-auto pt-20 pb-24 px-4 max-w-5xl">
      <div className={styles.chatBox + " h-[75vh]"}>
        <div className={styles.header}>
          <span><span className={styles.symbolIcon}>🔮</span>Oracle Hut</span>
          <div className={styles.headerControls}>
            <button
              className={styles.voiceToggle}
              onClick={toggleVoice}
              aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
              title={voiceEnabled ? "Disable voice" : "Enable voice"}
            >
              <Mic size={18} className={voiceEnabled ? styles.activeVoice : ''} />
            </button>
            
            <div className="ml-2 text-[#00FFD1] flex items-center">
              <Table size={16} className="mr-1" />
              <span className="text-xs">Table support enabled</span>
            </div>
          </div>
        </div>
        
        <div className={`${styles.messages} h-[calc(100%-180px)]`}>
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={msg.role === 'oracle' ? styles.oracleMsg : styles.userMsg}
            >
              {msg.content}
            </div>
          ))}
          
          {isLoading && (
            <div className={`${styles.oracleMsg} ${styles.loadingDots}`}>
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {voiceEnabled && <VoiceOracleAI isOpen={true} onMessageReceived={handleVoiceMessage} />}
        
        <div className={styles.prompt}>
          <div className="text-[#00FFD1] mb-2">Sample Inquiries:</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {samplePrompts.map((prompt, index) => (
              <button 
                key={index}
                className={styles.promptButton}
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.inputArea}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Ask the Oracle for symbolic insights..."
            disabled={isLoading}
            className="w-full"
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OracleHutSection;
