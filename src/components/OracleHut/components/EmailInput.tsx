
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmailInputProps {
  onSendEmail: (email: string) => Promise<void>;
  sendingEmail: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ onSendEmail, sendingEmail }) => {
  const [emailInput, setEmailInput] = useState('');

  const handleSendEmail = () => {
    onSendEmail(emailInput);
  };

  return (
    <div className="bg-slate-800/90 p-3 border-b border-[#00FFD1]/20 flex items-center gap-2">
      <input
        type="email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1 text-sm text-white"
      />
      <Button 
        size="sm" 
        className="bg-[#00FFD1] hover:bg-[#00FFD1]/80 text-slate-900"
        onClick={handleSendEmail}
        disabled={sendingEmail}
      >
        {sendingEmail ? "Sending..." : "Send Insight"}
      </Button>
    </div>
  );
};

export default EmailInput;
