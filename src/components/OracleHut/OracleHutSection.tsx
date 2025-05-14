
import React, { useState, useEffect } from 'react';
import { OracleHutEngine } from './OracleHutEngine';
import VoiceOracleAI from './VoiceOracleAI';
import { toast } from "sonner";
import styles from './styles.module.css';
import { Message } from './types/types';
import { processResponseWithTables } from './utils/tableUtils';

// Import our new components
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import EmailInput from './components/EmailInput';
import PromptSuggestions from './components/PromptSuggestions';
import ChatHeader from './components/ChatHeader';

const OracleHutSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Sample prompts for the suggestions
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

  const handleSend = async (userMessage: string) => {
    if (!userMessage || isLoading) return;

    const newMessage: Message = {
      role: 'user',
      content: userMessage,
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Process through the symbolic engine - Uses in-app data only
      const response = await OracleHutEngine(userMessage);
      
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
      
      // Save the last message for potential email sending
      sessionStorage.setItem('lastOracleResponse', response);
      
      // Log to oracle_logs for feedback, training data (write-only)
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('oracle_logs').insert({
          user_query: userMessage,
          oracle_response: response,
          timestamp: new Date().toISOString(),
          has_table: hasTable,
          model_version: '1.0'
        });
      } catch (logError) {
        console.error('Failed to log oracle interaction:', logError);
        // Non-critical, continue without error to user
      }
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
    
    // Log voice interactions to voice_training_log (write-only)
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.from('voice_training_log').insert({
        message,
        source: 'elevenlabs',
        agent_id: 'kWY3sE6znRmHQqPy48sk',
        timestamp: new Date().toISOString()
      }).then(() => {
        console.log('Voice interaction logged');
      });
    } catch (logError) {
      console.error('Failed to log voice interaction:', logError);
      // Non-critical, continue without error to user
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };
  
  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  // Function to send the last oracle response via email
  const sendInsightToEmail = async (email: string) => {
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setSendingEmail(true);
    
    const lastResponse = sessionStorage.getItem('lastOracleResponse');
    if (!lastResponse) {
      toast.error("No Oracle insight available to send");
      setSendingEmail(false);
      return;
    }

    try {
      // Updated payload to use content instead of htmlContent
      const payload = {
        to: email,
        subject: '🔮 Oracle Hut: Logistics Insight',
        content: lastResponse,
        queryType: 'logistics'
      };

      const response = await fetch('https://hpogoxrxcnyxiqjmqtaw.supabase.co/functions/v1/send-oracle-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Insight sent to your email!");
        setShowEmailInput(false);
      } else {
        toast.error("Failed to send email: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error sending insight via email:", error);
      toast.error("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="container mx-auto px-4 h-[calc(100vh-100px)] max-w-6xl">
      <div className={`${styles.chatBox} h-[calc(100vh-120px)] w-full`}>
        <ChatHeader 
          voiceEnabled={voiceEnabled}
          onToggleVoice={toggleVoice}
          onToggleEmailInput={() => setShowEmailInput(!showEmailInput)}
        />
        
        {showEmailInput && (
          <EmailInput 
            onSendEmail={sendInsightToEmail}
            sendingEmail={sendingEmail}
          />
        )}
        
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
        />
        
        {voiceEnabled && <VoiceOracleAI isOpen={true} onMessageReceived={handleVoiceMessage} />}
        
        <PromptSuggestions 
          prompts={samplePrompts}
          onPromptClick={handlePromptClick}
        />
        
        <InputArea 
          isLoading={isLoading}
          onSendMessage={handleSend}
        />
      </div>
    </div>
  );
};

export default OracleHutSection;
