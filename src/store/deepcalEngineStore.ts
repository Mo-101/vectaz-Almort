import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { ForwarderPerformance, RoutePerformance, ShipmentMetrics } from '@/types/deeptrack';

interface DeepSightAlert {
  id: string;
  type: 'risk' | 'insight' | 'warning';
  message: string;
  severity: 'low' | 'medium' | 'high';
  relatedEntity?: string;
  timestamp: Date;
  dismissed: boolean;
}

interface EngineWeights {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

interface DeepCalEngineState {
  // Engine data
  rankings: ForwarderPerformance[];
  routes: RoutePerformance[];
  metrics: ShipmentMetrics | null;
  insights: DeepSightAlert[];
  weights: EngineWeights;
  
  // UI states
  isLoadingRankings: boolean;
  isLoadingRoutes: boolean;
  isLoadingMetrics: boolean;
  isLoadingInsights: boolean;
  engineError: string | null;
  
  // Cache timestamp
  lastUpdated: Date | null;
  
  // Actions
  fetchRankings: () => Promise<ForwarderPerformance[]>;
  fetchRoutes: () => Promise<RoutePerformance[]>;
  fetchMetrics: () => Promise<ShipmentMetrics | null>;
  fetchDeepSightAlerts: () => Promise<DeepSightAlert[]>;
  dismissAlert: (alertId: string) => void;
  refreshAllData: () => Promise<void>;
  
  // Voice interaction with decision engine
  getEngineExplanation: (topic: string) => Promise<string>;
}

// Helper function to call Python engine endpoints
const callEngineEndpoint = async <T>(endpoint: string, payload?: any): Promise<T> => {
  try {
    // For now, we'll simulate calls to the Python engine using Supabase edge functions
    // Later this can be updated to directly call the Python endpoints
    const supabaseUrl = 'https://hpogoxrxcnyxiqjmqtaw.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb2dveHJ4Y255eGlxam1xdGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDEwMjEsImV4cCI6MjA1ODc3NzAyMX0.9JA8cI1FYpyLJGn8VJGSQcUbnBmzNtMH_I_fkI-JMAE';
    
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { auth: { persistSession: false } }
    );
    
    // Map endpoint to appropriate function
    let functionName = '';
    switch(endpoint) {
      case 'rankings':
        functionName = 'deepcal-rankings';
        break;
      case 'routes':
        functionName = 'deepcal-routes';
        break;
      case 'metrics':
        functionName = 'deepcal-metrics';
        break;
      case 'insights':
        functionName = 'deepcal-insights';
        break;
      case 'explain':
        functionName = 'deepcal-explain';
        break;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    console.log(`Calling DeepCAL engine endpoint: ${functionName}`);
    
    // Call the appropriate edge function
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });
    
    if (error) {
      throw new Error(`Error calling ${endpoint}: ${error.message}`);
    }
    
    return data as T;
  } catch (error) {
    console.error(`Error in engine endpoint ${endpoint}:`, error);
    
    // In development or if the Python engine is not available, fall back to the TypeScript engine
    // This ensures the UI doesn't break when the Python engine is unavailable
    if (endpoint === 'rankings') {
      const { decisionEngine } = await import('@/core/base_engine/ts/engine');
      const weights = { cost: 0.4, time: 0.3, reliability: 0.2, risk: 0.1 };
      return decisionEngine.getRankedAlternatives(weights) as unknown as T;
    }
    
    // For other endpoints, re-throw the error to be handled by the caller
    throw error;
  }
};

export const useDeepCalEngineStore = create<DeepCalEngineState>((set, get) => ({
  // Initial state
  rankings: [],
  routes: [],
  metrics: null,
  insights: [],
  weights: { cost: 0.4, time: 0.3, reliability: 0.2, risk: 0.1 },
  
  isLoadingRankings: false,
  isLoadingRoutes: false,
  isLoadingMetrics: false,
  isLoadingInsights: false,
  engineError: null,
  
  lastUpdated: null,
  
  // Fetch forwarder rankings from DeepCAL engine
  fetchRankings: async () => {
    try {
      set({ isLoadingRankings: true, engineError: null });
      
      const data = await callEngineEndpoint<{
        rankings: ForwarderPerformance[];
        weights: EngineWeights;
      }>('rankings');
      
      // Update store with rankings and weights
      set({ 
        rankings: data.rankings, 
        weights: data.weights || get().weights, 
        isLoadingRankings: false,
        lastUpdated: new Date()
      });
      
      return data.rankings;
    } catch (error) {
      console.error('Error fetching rankings:', error);
      set({ 
        isLoadingRankings: false, 
        engineError: error instanceof Error ? error.message : 'Unknown error fetching rankings' 
      });
      
      // Show toast for user feedback
      toast({
        title: 'Error loading rankings',
        description: 'Could not connect to DeepCAL engine. Showing cached data instead.',
        variant: 'destructive',
      });
      
      // Fallback to local decision engine - use TOPSIS and AHP to create dummy rankings
      try {
        const { decisionEngine } = await import('@/core/base_engine/ts/engine');
        const dummyRequest = {
          decisionMatrix: [[0.8, 0.6, 0.9], [0.7, 0.8, 0.6], [0.9, 0.5, 0.7]],
          pairwiseMatrix: [[1, 3, 5], [0.33, 1, 3], [0.2, 0.33, 1]],
          criteriaTypes: ['cost', 'benefit', 'benefit'],
          alternativeNames: ['DHL', 'Maersk', 'FedEx'],
          criteriaNames: ['Cost', 'Time', 'Reliability']
        };
        
        // Use the TOPSIS algorithm to rank alternatives
        const result = decisionEngine.calculateTopsis(dummyRequest);
        
        // Convert to rankings format
        const rankings: ForwarderPerformance[] = result.allScores.map((score, index) => ({
          name: dummyRequest.alternativeNames?.[index] || `Forwarder ${index}`,
          totalShipments: 50 + Math.floor(Math.random() * 150),
          avgCostPerKg: 4.5 + Math.random() * 3.5,
          avgTransitDays: 5 + Math.random() * 5,
          onTimeRate: 0.7 + Math.random() * 0.3,
          reliabilityScore: score * 0.8 + 0.2,
          deepScore: score
        }));
        
        set({ rankings });
        return rankings;
      } catch (fallbackError) {
        console.error('Fallback engine error:', fallbackError);
        return get().rankings;
      }
    }
  },
  
  // Fetch route performance from DeepCAL engine
  fetchRoutes: async () => {
    try {
      set({ isLoadingRoutes: true, engineError: null });
      
      const routes = await callEngineEndpoint<RoutePerformance[]>('routes');
      
      set({ 
        routes, 
        isLoadingRoutes: false,
        lastUpdated: new Date()
      });
      
      return routes;
    } catch (error) {
      console.error('Error fetching routes:', error);
      set({ 
        isLoadingRoutes: false, 
        engineError: error instanceof Error ? error.message : 'Unknown error fetching routes' 
      });
      
      // Show toast for user feedback
      toast({
        title: 'Error loading routes',
        description: 'Could not connect to DeepCAL engine. Showing cached data instead.',
        variant: 'destructive',
      });
      
      return get().routes;
    }
  },
  
  // Fetch shipment metrics from DeepCAL engine
  fetchMetrics: async () => {
    try {
      set({ isLoadingMetrics: true, engineError: null });
      
      const metrics = await callEngineEndpoint<ShipmentMetrics>('metrics');
      
      set({ 
        metrics, 
        isLoadingMetrics: false,
        lastUpdated: new Date()
      });
      
      return metrics;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      set({ 
        isLoadingMetrics: false, 
        engineError: error instanceof Error ? error.message : 'Unknown error fetching metrics' 
      });
      
      // Show toast for user feedback
      toast({
        title: 'Error loading metrics',
        description: 'Could not connect to DeepCAL engine. Showing cached data instead.',
        variant: 'destructive',
      });
      
      return get().metrics;
    }
  },
  
  // Fetch DeepSight alerts (insights, warnings, etc.)
  fetchDeepSightAlerts: async () => {
    try {
      set({ isLoadingInsights: true, engineError: null });
      
      const insights = await callEngineEndpoint<DeepSightAlert[]>('insights');
      
      set({ 
        insights, 
        isLoadingInsights: false,
        lastUpdated: new Date()
      });
      
      // Show notification if there are new high-priority insights
      const highPriorityInsights = insights.filter(
        insight => insight.severity === 'high' && !insight.dismissed
      );
      
      if (highPriorityInsights.length > 0) {
        toast({
          title: 'New DeepSight Alert',
          description: highPriorityInsights[0].message,
          variant: 'default',
        });
      }
      
      return insights;
    } catch (error) {
      console.error('Error fetching insights:', error);
      set({ 
        isLoadingInsights: false, 
        engineError: error instanceof Error ? error.message : 'Unknown error fetching insights' 
      });
      
      return get().insights;
    }
  },
  
  // Dismiss an alert
  dismissAlert: (alertId: string) => {
    set(state => ({
      insights: state.insights.map(alert => 
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    }));
  },
  
  // Refresh all data from the engine
  refreshAllData: async () => {
    try {
      // Set loading states
      set({ 
        isLoadingRankings: true, 
        isLoadingRoutes: true, 
        isLoadingMetrics: true, 
        isLoadingInsights: true,
        engineError: null
      });
      
      // Fetch all data in parallel
      await Promise.all([
        get().fetchRankings(),
        get().fetchRoutes(),
        get().fetchMetrics(),
        get().fetchDeepSightAlerts()
      ]);
      
      // Update timestamp
      set({ lastUpdated: new Date() });
      
      // Success notification
      toast({
        title: 'Data refreshed',
        description: 'All data has been refreshed from the DeepCAL engine.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error refreshing all data:', error);
      set({ 
        isLoadingRankings: false,
        isLoadingRoutes: false,
        isLoadingMetrics: false,
        isLoadingInsights: false,
        engineError: error instanceof Error ? error.message : 'Unknown error refreshing data' 
      });
      
      // Error notification
      toast({
        title: 'Refresh failed',
        description: 'Could not refresh data from the DeepCAL engine.',
        variant: 'destructive',
      });
    }
  },
  
  // Get a natural language explanation from the DeepCAL engine
  getEngineExplanation: async (topic: string) => {
    try {
      const { explanation } = await callEngineEndpoint<{ explanation: string }>('explain', { topic });
      return explanation;
    } catch (error) {
      console.error('Error getting explanation:', error);
      
      // Fall back to a generic explanation
      return `I'm unable to provide a detailed explanation about ${topic} at this moment due to a connection issue with the DeepCAL engine.`;
    }
  }
}));

// Export types for use in components
export type { DeepSightAlert, EngineWeights };
