
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface VerificationLogsProps {
  logs: string[];
}

const VerificationLogs: React.FC<VerificationLogsProps> = ({ logs }) => {
  return (
    <div className="bg-blue-950/40 border border-blue-900/50 rounded-md p-3 mb-6 max-h-32 overflow-auto backdrop-blur-sm">
      <p className="text-xs text-blue-300 font-semibold mb-2 font-mono">System Verification Log:</p>
      <div className="overflow-y-auto scrollbar-hide">
        {logs.map((status, index) => (
          <div 
            key={index} 
            className="flex items-center text-xs font-mono mb-1.5 transition-all duration-500 text-blue-200/90 opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 0.4}s` }}
          >
            <CheckCircle size={12} className="mr-2 text-emerald-400 flex-shrink-0" />
            <span className="break-words">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationLogs;
