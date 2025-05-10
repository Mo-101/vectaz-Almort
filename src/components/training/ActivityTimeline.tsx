
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, AlertCircle, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for the timeline
const mockEvents = [
  { 
    id: 1, 
    type: 'success', 
    title: 'Training completed', 
    description: 'Model v2.3.4 trained successfully', 
    time: '10 minutes ago' 
  },
  { 
    id: 2, 
    type: 'process', 
    title: 'Data preprocessing started', 
    description: 'Starting preprocessing pipeline for next batch', 
    time: '35 minutes ago' 
  },
  { 
    id: 3, 
    type: 'warning', 
    title: 'High GPU usage detected', 
    description: 'Training Node GPU utilization > 95%', 
    time: '1 hour ago' 
  },
  { 
    id: 4, 
    type: 'success', 
    title: 'Validation metrics improved', 
    description: 'Accuracy increased by 2.3%', 
    time: '2 hours ago' 
  },
  { 
    id: 5, 
    type: 'error', 
    title: 'Backup Node offline', 
    description: 'Connection lost to backup infrastructure', 
    time: '1 day ago' 
  },
];

type EventType = 'success' | 'error' | 'warning' | 'process';

interface TimelineEvent {
  id: number;
  type: EventType;
  title: string;
  description: string;
  time: string;
}

interface ActivityTimelineProps {
  events?: TimelineEvent[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events = mockEvents }) => {
  return (
    <Card className="border-mostar-light-blue/15 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">Recent Activity</CardTitle>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">LIVE</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <TimelineItem key={event.id} event={event} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface TimelineItemProps {
  event: TimelineEvent;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event }) => {
  const getIcon = (type: EventType) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'process':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getIconClasses = (type: EventType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'process':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div className="flex gap-3">
      <div className={cn(
        'shrink-0 flex items-center justify-center w-8 h-8 mt-0.5 rounded-full border',
        getIconClasses(event.type)
      )}>
        {getIcon(event.type)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <h4 className="font-medium text-sm">{event.title}</h4>
          <span className="text-xs text-gray-400">{event.time}</span>
        </div>
        <p className="text-sm text-gray-300">{event.description}</p>
      </div>
    </div>
  );
};

export default ActivityTimeline;
