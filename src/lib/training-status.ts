
import { supabase } from '@/integrations/supabase/client';

export interface TrainingNode {
  name: string;
  status: 'online' | 'offline';
  lastSeen: string;
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage?: number;
}

export interface TrainingStatus {
  systemStatus: string;
  trainingStatus: string;
  nextTraining: string;
  trainingInterval: string;
  uptime: string;
  responseTime: string;
  pendingUpdates: number;
  lastIncident: string;
  lastUpdated: string;
  metrics: {
    accuracy: number;
    loss: number;
    epoch: number;
    totalEpochs: number;
  };
  nodes: TrainingNode[];
  resources: {
    time: string[];
    cpu: number[];
    memory: number[];
    gpu?: number[];
  };
}

export async function fetchTrainingStatus(): Promise<TrainingStatus> {
  try {
    // First try internal engine endpoint
    const engineData = await fetchFromEngine();
    if (engineData) return engineData;
    
    // Fallback to Supabase
    const supabaseData = await fetchFromSupabase();
    if (supabaseData) return supabaseData;
    
  } catch (error) {
    console.error('Error fetching training status:', error);
  }
  
  // Return mock data as final fallback
  return getMockTrainingStatus();
}

async function fetchFromEngine(): Promise<TrainingStatus | null> {
  try {
    // Implement actual engine fetch when available
    return null;
  } catch (error) {
    console.error('Error fetching from engine:', error);
    return null;
  }
}

async function fetchFromSupabase(): Promise<TrainingStatus | null> {
  try {
    const { data, error } = await supabase
      .from('training_status')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    if (!data || data.length === 0) return null;
    
    // Transform Supabase data to our TrainingStatus interface
    return transformSupabaseData(data[0]);
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return null;
  }
}

function transformSupabaseData(data: any): TrainingStatus {
  // Transform Supabase data to match our interface
  // This is a placeholder - implement actual transformation based on your schema
  return {
    systemStatus: data.system_status || 'unknown',
    trainingStatus: data.training_status || 'unknown',
    nextTraining: data.next_training || 'unknown',
    trainingInterval: data.training_interval || '2 hours',
    uptime: data.uptime || '0%',
    responseTime: data.response_time || '0ms',
    pendingUpdates: data.pending_updates || 0,
    lastIncident: data.last_incident || 'None',
    lastUpdated: new Date(data.created_at).toLocaleString(),
    metrics: {
      accuracy: data.accuracy || 0,
      loss: data.loss || 0,
      epoch: data.current_epoch || 0,
      totalEpochs: data.total_epochs || 0,
    },
    nodes: data.nodes || [],
    resources: data.resources || { time: [], cpu: [], memory: [] },
  };
}

function getMockTrainingStatus(): TrainingStatus {
  const now = new Date();
  
  // Generate some mock time series data for charts
  const timePoints = Array(24).fill(0).map((_, i) => {
    const time = new Date(now);
    time.setHours(now.getHours() - (24 - i));
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  
  const cpuData = Array(24).fill(0).map(() => Math.floor(Math.random() * 60) + 20); // 20-80% CPU
  const memoryData = Array(24).fill(0).map(() => Math.floor(Math.random() * 40) + 40); // 40-80% Memory
  const gpuData = Array(24).fill(0).map(() => Math.floor(Math.random() * 70) + 20); // 20-90% GPU
  
  return {
    systemStatus: "operational",
    trainingStatus: "in_progress",
    nextTraining: "1h 59m",
    trainingInterval: "2 hours",
    uptime: "99.98%",
    responseTime: "42ms",
    pendingUpdates: 2,
    lastIncident: "3/15/2025, 11:42:11 AM",
    lastUpdated: now.toLocaleString(),
    metrics: {
      accuracy: 0.87,
      loss: 0.13,
      epoch: 7,
      totalEpochs: 10
    },
    nodes: [
      { 
        name: "Primary Node", 
        status: "online",
        lastSeen: now.toISOString(),
        cpuUsage: 68,
        memoryUsage: 74
      },
      { 
        name: "Secondary Node", 
        status: "online",
        lastSeen: now.toISOString(),
        cpuUsage: 42,
        memoryUsage: 51
      },
      { 
        name: "Analytics Node", 
        status: "online",
        lastSeen: now.toISOString(),
        cpuUsage: 56,
        memoryUsage: 62
      },
      { 
        name: "Training Node", 
        status: "online",
        lastSeen: now.toISOString(),
        cpuUsage: 89,
        memoryUsage: 77,
        gpuUsage: 92
      },
      { 
        name: "Backup Node", 
        status: "offline",
        lastSeen: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        cpuUsage: 0,
        memoryUsage: 12
      },
    ],
    resources: {
      time: timePoints,
      cpu: cpuData,
      memory: memoryData,
      gpu: gpuData
    }
  };
}
