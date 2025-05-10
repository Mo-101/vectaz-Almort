
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrainingNode } from '@/lib/training-status';
import { Loader2, Server, AlertCircle } from 'lucide-react';

interface NodeGridProps {
  nodes: TrainingNode[];
}

const NodeGrid: React.FC<NodeGridProps> = ({ nodes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {nodes.map((node) => (
        <Card 
          key={node.name} 
          className={`overflow-hidden border transition-all ${
            node.status === 'online' 
              ? 'border-green-600/30 shadow-green-900/10' 
              : 'border-red-600/30 shadow-red-900/10'
          }`}
        >
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-gray-400" />
                <h3 className="font-medium text-sm">{node.name}</h3>
              </div>
              <StatusIndicator status={node.status} />
            </div>
            
            {node.status === 'online' ? (
              <div className="mt-2">
                <ResourceBar label="CPU" value={node.cpuUsage} />
                <ResourceBar label="Memory" value={node.memoryUsage} />
                {node.gpuUsage && <ResourceBar label="GPU" value={node.gpuUsage} />}
                <div className="text-xs mt-2 text-gray-400">
                  Last seen: {formatLastSeen(node.lastSeen)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <p className="text-xs">Offline since {formatLastSeen(node.lastSeen)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface StatusIndicatorProps {
  status: 'online' | 'offline';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  return status === 'online' ? (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-xs text-green-400">ONLINE</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 bg-red-500 rounded-full" />
      <span className="text-xs text-red-400">OFFLINE</span>
    </div>
  );
};

interface ResourceBarProps {
  label: string;
  value: number;
}

const ResourceBar: React.FC<ResourceBarProps> = ({ label, value }) => {
  const getBarColor = (value: number) => {
    if (value > 90) return 'bg-red-500';
    if (value > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-1.5">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getBarColor(value)} transition-all`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
};

function formatLastSeen(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return `yesterday`;
  
  return `${diffDays} days ago`;
}

export default NodeGrid;
