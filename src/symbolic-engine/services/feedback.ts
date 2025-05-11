
// feedback.ts - Adjust trust score based on delivery deviations

export interface ForwarderTrust {
  name: string;
  reliability: number;
  [key: string]: any;
}

export function updateForwarderTrust(
  forwarder: ForwarderTrust, 
  actualTime: number, 
  expectedTime: number
): ForwarderTrust {
  const deviation = Math.abs(actualTime - expectedTime);
  return {
    ...forwarder,
    reliability: Math.max(0, forwarder.reliability - deviation * 0.03)
  };
}
