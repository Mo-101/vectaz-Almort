
import { supabase } from '@/integrations/supabase/client';

export interface TrainingNode {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  lastHeartbeat: string;
  role: string;
  cpuUsage?: number;
  memoryUsage?: number;
  gpuUsage?: number;
  lastSeen: string;
}

export interface TrainingStatus {
  id: string;
  timestamp: string;
  systemStatus: string;
  trainingStatus: string;
  nextScheduled: string | null;
  trainingMetrics: {
    accuracy?: number;
    loss?: number;
    epochsDone?: number;
    totalEpochs?: number;
    trainingSamples?: number;
  };
  nodes: TrainingNode[];
  resources: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkBandwidth: number;
    time?: string[];
    cpu?: number[];
    memory?: number[];
    gpu?: number[];
  };
  events: TimelineEvent[];
  nextTraining?: string;
  trainingInterval?: string;
  uptime?: string;
  responseTime?: string;
  pendingUpdates?: number;
  lastIncident?: string;
  lastUpdated?: string;
  metrics?: {
    accuracy?: number;
    loss?: number;
    epochsDone?: number;
    totalEpochs?: number;
  };
}

// Fetch training status from various sources
export async function fetchTrainingStatus(): Promise<TrainingStatus> {
  // Try to get status from internal engine first
  try {
    // This would connect to your actual engine API
    // const response = await fetch('/api/engine/training-status');
    // if (response.ok) {
    //   return await response.json();
    // }
    // For now, just throw to move to fallback
    throw new Error('Engine API not available');
  } catch (engineError) {
    console.log('Engine API not available, falling back to mock data');
    
    // Try to get from Supabase if it exists
    try {
      // Check if the training_status table exists in Supabase
      // If you create a table, you can use this code to fetch from it
      // const { data, error } = await supabase.from('training_status').select('*').order('timestamp', { ascending: false }).limit(1);
      // if (error) throw error;
      // if (data && data.length > 0) {
      //   return data[0] as TrainingStatus;
      // }
      throw new Error('No training data in Supabase');
    } catch (supabaseError) {
      console.log('Supabase data not available, using fallback mock data');
      
      // Final fallback - use mock data
      return getMockTrainingStatus();
    }
  }
}

// Generate mock training status data
function getMockTrainingStatus(): TrainingStatus {
  const now = new Date();
  const nextTraining = new Date(now);
  nextTraining.setHours(nextTraining.getHours() + 2);
  
  return {
    id: 'training-1',
    timestamp: now.toISOString(),
    systemStatus: 'operational',
    trainingStatus: 'idle',
    nextScheduled: nextTraining.toISOString(),
    nextTraining: '2 hours',
    trainingInterval: '4 hours',
    uptime: '99.98%',
    responseTime: '42ms',
    pendingUpdates: 2,
    lastIncident: '3d ago',
    lastUpdated: 'just now',
    trainingMetrics: {
      accuracy: 0.89,
      loss: 0.23,
      epochsDone: 42,
      totalEpochs: 50,
      trainingSamples: 1243
    },
    metrics: {
      accuracy: 0.89,
      loss: 0.23,
      epochsDone: 42,
      totalEpochs: 50
    },
    nodes: [
      {
        id: 'node-1',
        name: 'Primary Training Node',
        status: 'online',
        lastHeartbeat: now.toISOString(),
        role: 'training',
        cpuUsage: 65,
        memoryUsage: 78,
        lastSeen: now.toISOString()
      },
      {
        id: 'node-2',
        name: 'Inference Node',
        status: 'online',
        lastHeartbeat: now.toISOString(),
        role: 'inference',
        cpuUsage: 42,
        memoryUsage: 55,
        lastSeen: now.toISOString()
      },
      {
        id: 'node-3',
        name: 'Data Processing Node',
        status: 'online',
        lastHeartbeat: now.toISOString(),
        role: 'data',
        cpuUsage: 38,
        memoryUsage: 45,
        lastSeen: now.toISOString()
      },
      {
        id: 'node-4',
        name: 'Backup Node',
        status: 'offline',
        lastHeartbeat: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        role: 'backup',
        cpuUsage: 0,
        memoryUsage: 0,
        lastSeen: new Date(now.getTime() - 86400000).toISOString()
      }
    ],
    resources: {
      cpuUsage: 42.5,
      memoryUsage: 68.3,
      diskUsage: 47.2,
      networkBandwidth: 21.5,
      time: ['1h ago', '45m ago', '30m ago', '15m ago', 'now'],
      cpu: [35, 42, 38, 45, 42.5],
      memory: [62, 65, 70, 68, 68.3],
      gpu: [50, 48, 52, 55, 53]
    },
    events: getTrainingTimelineEvents()
  };
}

export type EventType = 'error' | 'warning' | 'info' | 'success';

export interface TimelineEvent {
  id: number;
  type: EventType;
  title: string;
  description: string;
  time: string;
}

// Get timeline events for the activity feed
export function getTrainingTimelineEvents(): TimelineEvent[] {
  const now = new Date();
  
  return [
    {
      id: 1,
      type: 'success',
      title: 'Training Completed',
      description: 'Model v2.4.1 training completed with 89% accuracy',
      time: new Date(now.getTime() - 3600000).toISOString()
    },
    {
      id: 2,
      type: 'info',
      title: 'Evaluation Started',
      description: 'Starting evaluation on validation dataset',
      time: new Date(now.getTime() - 3900000).toISOString()
    },
    {
      id: 3,
      type: 'warning',
      title: 'High Resource Usage',
      description: 'CPU usage exceeded 80% threshold',
      time: new Date(now.getTime() - 86400000).toISOString()
    },
    {
      id: 4,
      type: 'error',
      title: 'Node Connection Lost',
      description: 'Connection to backup node has been lost',
      time: new Date(now.getTime() - 172800000).toISOString()
    },
    {
      id: 5,
      type: 'info',
      title: 'Data Import Complete',
      description: 'Successfully imported 1,243 new training samples',
      time: new Date(now.getTime() - 259200000).toISOString()
    },
    {
      id: 6,
      type: 'success',
      title: 'Model Deployed',
      description: 'Model v2.4.0 deployed to production',
      time: new Date(now.getTime() - 345600000).toISOString()
    }
  ];
}
