
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react';
import { EventType, TimelineEvent } from '@/lib/training-status';

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  const getIconForType = (type: EventType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColorForType = (type: EventType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10';
      case 'error':
        return 'bg-red-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      case 'info':
      default:
        return 'bg-blue-500/10';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'unknown time';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

        {events.map((event) => (
          <div key={event.id} className="relative pl-10">
            <div className="absolute left-[0.75rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background">
              {getIconForType(event.type)}
            </div>
            <div className={`rounded-lg p-3 ${getBgColorForType(event.type)}`}>
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTimeAgo(event.time)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
