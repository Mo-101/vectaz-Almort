import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Database, Workflow } from 'lucide-react';
import NodeGrid from '@/components/training/NodeGrid';
import { TrainingNode } from '@/lib/training-status';

/**
 * Ultra-futuristic Training Page Component
 * Displays training nodes and allows control of the DeepCAL training pipeline
 */
const TrainingPage: React.FC = () => {
  // Initialize training nodes with sample data
  const [nodes, setNodes] = useState<TrainingNode[]>([
    {
      name: "Primary NLU Processor",
      status: "online",
      cpuUsage: 12,
      memoryUsage: 24,
      lastSeen: new Date().toISOString()
    },
    {
      name: "Entity Recognition Engine",
      status: "online",
      cpuUsage: 8,
      memoryUsage: 18,
      lastSeen: new Date().toISOString()
    },
    {
      name: "Voice Synthesis Bridge",
      status: "online",
      cpuUsage: 15,
      memoryUsage: 22,
      lastSeen: new Date().toISOString()
    }
  ]);

  return (
    <div className="container py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/20 bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Server className="h-6 w-6 text-primary" />
              DeepCAL Training System
            </CardTitle>
            <CardDescription>
              Ultra-futuristic training interface for voice and model configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NodeGrid nodes={nodes} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TrainingPage;
