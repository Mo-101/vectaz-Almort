
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

export interface TrainingEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
}

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
  try {
    // Try to fetch from API first
    const response = await fetch('/api/training-status');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('API fetch failed');
  } catch (error) {
    console.log('Falling back to mock data');
    
    // Try to get symbolic stats
    const symStats = await symbolicStats();
    
    // Generate mock demo data for UI development
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const nowISO = now.toISOString();
    const twoHoursAgoISO = twoHoursAgo.toISOString();
    
    // Mock time series for the last 24 hours (24 data points)
    const timeSeries = Array(24).fill(0).map((_, i) => {
      const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      return time.toISOString();
    });
    
    // Generate some random but realistic usage patterns
    const cpuSeries = timeSeries.map(() => Math.floor(30 + Math.random() * 60)); // 30-90%
    const memorySeries = timeSeries.map(() => Math.floor(40 + Math.random() * 40)); // 40-80%
    const gpuSeries = timeSeries.map(() => Math.floor(50 + Math.random() * 45)); // 50-95%
    
    return {
      systemStatus: 'operational',
      trainingStatus: 'in_progress',
      nextTraining: '1h 23m',
      trainingInterval: '2 hours',
      uptime: '99.8%',
      responseTime: '124ms',
      pendingUpdates: symStats?.anomalies || 3,
      lastIncident: '3 days ago',
      lastUpdated: nowISO,
      nodes: [
        { 
          name: 'Primary Training Node', 
          status: 'online',
          cpuUsage: 78,
          memoryUsage: 64,
          gpuUsage: 92,
          lastSeen: nowISO
        },
        { 
          name: 'Secondary Training Node', 
          status: 'online',
          cpuUsage: 45,
          memoryUsage: 38,
          gpuUsage: 76,
          lastSeen: nowISO
        },
        { 
          name: 'Analytics Node', 
          status: 'online',
          cpuUsage: 56,
          memoryUsage: 72,
          lastSeen: nowISO
        },
        { 
          name: 'Inference Node', 
          status: 'degraded',
          cpuUsage: 94,
          memoryUsage: 89,
          gpuUsage: 97,
          lastSeen: nowISO
        },
        { 
          name: 'Backup Node', 
          status: 'offline',
          lastSeen: twoHoursAgoISO
        }
      ],
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
        cpu: cpuSeries,
        memory: memorySeries,
        gpu: gpuSeries
      },
      events: [
        {
          id: '1',
          timestamp: nowISO,
          type: 'info',
          message: 'Training epoch 78/100 completed',
          details: 'Loss: 0.124, Accuracy: 87.6%'
        },
        {
          id: '2',
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          type: 'warning',
          message: 'Inference Node showing high memory usage',
          details: 'Memory usage at 89%, consider restarting'
        },
        {
          id: '3',
          timestamp: twoHoursAgoISO,
          type: 'error',
          message: 'Backup Node offline',
          details: 'Connection lost, trying to reconnect'
        },
        {
          id: '4',
          timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
          type: 'success',
          message: 'Model checkpoint saved',
          details: 'Checkpoint at epoch 75 saved successfully'
        }
      ]
    };
  }
}
