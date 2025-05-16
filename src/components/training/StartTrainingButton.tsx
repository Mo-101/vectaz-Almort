import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TrainingDataConnector } from '@/symbolic-engine/services/trainingConnector';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface StartTrainingButtonProps {
  onComplete?: (success: boolean, metrics?: any) => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
}

/**
 * Ultra-futuristic training activation button that connects real shipment data
 * to the symbolic engine training system
 */
const StartTrainingButton: React.FC<StartTrainingButtonProps> = ({ 
  onComplete,
  variant = 'default'
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const startTraining = async () => {
    setIsTraining(true);
    setTrainingStatus('idle');
    
    try {
      // Use the training connector to start symbolic engine training with real data
      const result = await TrainingDataConnector.trainWithRealData();
      
      if (result.success) {
        setTrainingStatus('success');
        
        toast({
          title: "Training Complete",
          description: `Processed ${result.trainingMetrics?.samplesProcessed || 0} shipments with ${result.trainingMetrics?.accuracy.toFixed(2)}% accuracy.`,
          variant: "default",
        });
        
        if (onComplete) {
          onComplete(true, result.trainingMetrics);
        }
      } else {
        setTrainingStatus('error');
        
        toast({
          title: "Training Failed",
          description: result.error || "An unknown error occurred during training.",
          variant: "destructive",
        });
        
        if (onComplete) {
          onComplete(false);
        }
      }
    } catch (error) {
      setTrainingStatus('error');
      
      toast({
        title: "Training Error",
        description: error instanceof Error ? error.message : "An unknown error occurred during training.",
        variant: "destructive",
      });
      
      if (onComplete) {
        onComplete(false);
      }
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <Button 
      onClick={startTraining}
      disabled={isTraining}
      variant={variant}
      className="min-w-[150px]"
    >
      {isTraining ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Training...
        </>
      ) : trainingStatus === 'success' ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
          Train Engine
        </>
      ) : trainingStatus === 'error' ? (
        <>
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          Train Engine
        </>
      ) : (
        <>
          Train Engine
        </>
      )}
    </Button>
  );
};

export default StartTrainingButton;
