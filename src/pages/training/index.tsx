
import React, { useEffect, useState } from 'react';
import { fetchTrainingStatus, TrainingStatus } from '@/lib/training-status';
import SystemStatusCard from '@/components/training/SystemStatusCard';
import NodeGrid from '@/components/training/NodeGrid';
import ResourceChart from '@/components/training/ResourceChart';
import TrainingMetrics from '@/components/training/TrainingMetrics';
import ActivityTimeline from '@/components/training/ActivityTimeline';
import { Loader2 } from 'lucide-react';

const TrainingDashboard: React.FC = () => {
  const [status, setStatus] = useState<TrainingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchTrainingStatus();
        setStatus(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch training status:', err);
        setError('Failed to load training dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Set up polling for live updates
    const intervalId = setInterval(loadData, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-lg">Loading DeepCAL++ training data...</p>
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center max-w-md p-6 bg-red-950/20 border border-red-800/30 rounded-lg">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-300">{error || 'Failed to load training data.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">DeepCAL++ Training Dashboard</h1>
        
        <SystemStatusCard
          systemStatus={status.systemStatus}
          trainingStatus={status.trainingStatus}
          nextTraining={status.nextTraining || "Unknown"}
          trainingInterval={status.trainingInterval || "Unknown"}
          uptime={status.uptime || "Unknown"}
          responseTime={status.responseTime || "Unknown"}
          pendingUpdates={status.pendingUpdates || 0}
          lastIncident={status.lastIncident || "None"}
          lastUpdated={status.lastUpdated || "Unknown"}
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <ResourceChart 
            resources={status.resources} 
            metrics={status.metrics || status.trainingMetrics}
          />
          <TrainingMetrics metrics={status.metrics || status.trainingMetrics} />
        </div>
        
        <NodeGrid nodes={status.nodes} />
        
        <ActivityTimeline events={status.events} />
      </div>
    </div>
  );
};

export default TrainingDashboard;
