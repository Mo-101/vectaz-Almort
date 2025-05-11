
// simulator.ts - Runs forwarder performance simulations

export interface ForwarderSimulation {
  name: string;
  reliability: number;
  delayRate: number;
  simulations?: {
    deliveryTime: number;
  }[];
  [key: string]: any;
}

export function simulateRoutes(
  forwarders: ForwarderSimulation[], 
  times = 10
): ForwarderSimulation[] {
  return forwarders.map(f => ({
    ...f,
    simulations: Array.from({ length: times }, () => ({
      deliveryTime: Math.random() * 7 + 2 // Random delivery time between 2-9 days
    }))
  }));
}
