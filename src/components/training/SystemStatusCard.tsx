
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SystemStatusCardProps {
  systemStatus: string;
  trainingStatus: string;
  nextTraining: string;
  trainingInterval: string;
  uptime: string;
  responseTime: string;
  pendingUpdates: number;
  lastIncident: string;
  lastUpdated: string;
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  systemStatus,
  trainingStatus,
  nextTraining,
  trainingInterval,
  uptime,
  responseTime,
  pendingUpdates,
  lastIncident,
  lastUpdated
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
      case 'online':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'in_progress':
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'offline':
      case 'error':
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <Card className="border-mostar-light-blue/15 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold tracking-tight">DeepCAL++ System Status</CardTitle>
          <Badge variant="outline" className="text-xs font-normal">
            Last updated: {lastUpdated}
          </Badge>
        </div>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="System" value={systemStatus} className={getStatusColor(systemStatus)} />
          <Metric label="Training" value={trainingStatus} className={getStatusColor(trainingStatus)} />
          <Metric label="Next Training" value={nextTraining} />
          <Metric label="Training Interval" value={trainingInterval} />
          <Metric label="Uptime" value={uptime} />
          <Metric label="Response Time" value={responseTime} />
          <Metric label="Pending Updates" value={pendingUpdates.toString()} />
          <Metric label="Last Incident" value={lastIncident} />
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricProps {
  label: string;
  value: string;
  className?: string;
}

const Metric: React.FC<MetricProps> = ({ label, value, className = "bg-slate-800/50 text-white" }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-gray-400">{label}</p>
      <Badge variant="outline" className={className}>
        {value}
      </Badge>
    </div>
  );
};

export default SystemStatusCard;
