
// modelTrainer.ts - Relearn preferences based on pattern changes

export interface ShipmentHistory {
  name: string;
  actualTime: number;
  predictedTime: number;
  [key: string]: any;
}

export interface TrainingDelta {
  name: string;
  delta: number;
}

export async function trainForwarderModels(
  historical: ShipmentHistory[]
): Promise<TrainingDelta[]> {
  const changes = historical.map(h => ({
    name: h.name,
    delta: h.actualTime - h.predictedTime
  }));
  return changes;
}
