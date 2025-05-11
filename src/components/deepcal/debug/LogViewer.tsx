
import React from 'react';

interface LogEntry {
  type: string;
  timestamp: Date;
  content: any[];
}

interface LogViewerProps {
  logs: LogEntry[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  // Format timestamp for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  // Determine the color class based on log type
  const getLogTypeClass = (type: string) => {
    switch(type) {
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-200';
    }
  };

  // Format log content for display
  const formatLogContent = (content: any[]) => {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        return <span key={index}>{item}</span>;
      } else if (item && typeof item === 'object') {
        try {
          return (
            <pre key={index} className="text-xs overflow-auto max-h-40 bg-black/30 p-2 rounded mt-1">
              {JSON.stringify(item, null, 2)}
            </pre>
          );
        } catch (e) {
          return <span key={index}>[Object]</span>;
        }
      }
      return <span key={index}>{String(item)}</span>;
    });
  };

  return (
    <div className="h-64 overflow-y-auto text-xs p-3">
      {logs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No traces captured yet. Run a calculation to see logs.
        </div>
      ) : (
        logs.map((log, index) => (
          <div key={index} className={`mb-2 ${getLogTypeClass(log.type)}`}>
            <div className="flex">
              <span className="text-gray-500 mr-2">{formatTime(log.timestamp)}</span>
              <div className="flex-1">{formatLogContent(log.content)}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LogViewer;
