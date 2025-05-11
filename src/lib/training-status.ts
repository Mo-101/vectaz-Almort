
import { supabase } from '@/integrations/supabase/client';
import { symbolicStats } from './symbolic-runtime';

export interface TrainingNode {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  cpuUsage?: number;
  memoryUsage?: number;
  gpuUsage?: number;
  lastSeen: string;
}

export interface TrainingMetrics {
  epochsDone?: number;
  totalEpochs?: number;
  accuracy?: number;
  loss?: number;
  learningRate?: number;
  epoch?: number;
}

export interface ResourceMetrics {
  time?: string[];
  cpu?: number[];
  memory?: number[];
  gpu?: number[];
}

export type EventType = 'info' | 'warning' | 'error' | 'success';

export interface TrainingEvent {
  id: string;
  timestamp: string;
  type: EventType;
  message: string;
  details?: string;
}

export type TimelineEvent = TrainingEvent;

export interface TrainingStatus {
  systemStatus: 'operational' | 'degraded' | 'maintenance' | 'offline';
  trainingStatus: 'idle' | 'in_progress' | 'completed' | 'failed';
  nextTraining?: string;
  trainingInterval?: string;
  uptime?: string;
  responseTime?: string;
  pendingUpdates?: number;
  lastIncident?: string;
  lastUpdated?: string;
  nodes: TrainingNode[];
  metrics?: TrainingMetrics;
  trainingMetrics?: TrainingMetrics;
  resources: ResourceMetrics;
  events?: TrainingEvent[];
}

export async function fetchTrainingStatus(): Promise<TrainingStatus> {
  // Get symbolic stats directly from the symbolic engine
  const symStats = await symbolicStats();
  
  // Generate current timestamps
  const now = new Date();
  const nowISO = now.toISOString();
  
  // Create time series for the last 24 hours (24 data points)
  const timeSeries = Array(24).fill(0).map((_, i) => {
    const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return time.toISOString();
  });
  
  // Define nodes based on symbolic engine health
  const nodes: TrainingNode[] = [
    { 
      name: 'Primary Training Node', 
      status: 'online',
      cpuUsage: 78,
      memoryUsage: 64,
      gpuUsage: 92,
      lastSeen: nowISO
    },
    { 
      name: 'Symbolic Engine Node', 
      status: 'online',
      cpuUsage: 65,
      memoryUsage: 48,
      gpuUsage: 76,
      lastSeen: nowISO
    },
    { 
      name: 'Inference Node', 
      status: symStats?.anomalies && symStats.anomalies > 2 ? 'degraded' : 'online',
      cpuUsage: symStats?.anomalies && symStats.anomalies > 2 ? 94 : 56,
      memoryUsage: symStats?.anomalies && symStats.anomalies > 2 ? 89 : 62,
      gpuUsage: symStats?.anomalies && symStats.anomalies > 2 ? 97 : 70,
      lastSeen: nowISO
    }
  ];
  
  // Generate events based on symbolic insights
  const events: TrainingEvent[] = [
    {
      id: '1',
      timestamp: nowISO,
      type: 'info',
      message: 'Symbolic engine active',
      details: `Memory utilization: ${symStats?.memory || 'N/A'}`
    }
  ];
  
  // Add anomaly events if detected
  if (symStats?.anomalies && symStats.anomalies > 0) {
    events.push({
      id: '2',
      timestamp: nowISO,
      type: 'warning',
      message: `${symStats.anomalies} anomalies detected`,
      details: 'Review forwarder performance metrics'
    });
  }
  
  // Add trust drift event if significant
  if (symStats?.trustDrift && parseFloat(symStats.trustDrift) > 3.0) {
    events.push({
      id: '3',
      timestamp: nowISO,
      type: 'error',
      message: 'Significant trust drift detected',
      details: `Trust drift: ${symStats.trustDrift}`
    });
  }
  
  // Add insights if available
  if (symStats?.insights && symStats.insights.length > 0) {
    events.push({
      id: '4',
      timestamp: nowISO,
      type: 'success',
      message: 'New insights generated',
      details: `${symStats.insights.length} insights available`
    });
  }
  
  return {
    systemStatus: 'operational',
    trainingStatus: 'in_progress',
    nextTraining: '1h 23m',
    trainingInterval: 'dynamic',
    uptime: '99.9%',
    responseTime: 'live',
    pendingUpdates: symStats?.anomalies || 0,
    lastIncident: symStats?.anomalies && symStats.anomalies > 0 ? '1 hour ago' : 'None',
    lastUpdated: nowISO,
    nodes: nodes,
    metrics: {
      epochsDone: 78,
      totalEpochs: 100,
      accuracy: 0.876,
      loss: 0.124,
      learningRate: 0.001,
      epoch: 78
    },
    resources: {
      time: timeSeries,
      cpu: timeSeries.map((_, i) => 30 + Math.floor(Math.min(symStats?.memory || 30, 60) / 10) + i * 0.5),
      memory: timeSeries.map((_, i) => 40 + Math.floor(Math.min(symStats?.memory || 40, 50) / 10) + i * 0.3),
      gpu: timeSeries.map((_, i) => 50 + Math.floor(Math.min(symStats?.anomalies || 1, 3) * 10) + i * 0.4)
    },
    events: events
  };
}
