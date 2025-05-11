
// insightEngine.ts - Extract symbolic anomalies or forwarder issues

export interface Forwarder {
  name: string;
  reliability?: number;
  delayRate?: number;
  [key: string]: any;
}

export interface Insight {
  name: string;
  issue: string;
}

export function detectAnomalies(forwarders: Forwarder[]): Insight[] {
  return forwarders
    .filter(f => (f.reliability !== undefined && f.reliability < 0.65) || 
                 (f.delayRate !== undefined && f.delayRate > 0.3))
    .map(f => ({
      name: f.name,
      issue: `⚠️ Delay trend detected: ${Math.round((f.delayRate || 0) * 100)}%`
    }));
}
