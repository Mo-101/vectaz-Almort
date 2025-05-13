
export interface Message {
  role: 'user' | 'oracle';
  content: string | React.ReactNode;
  id: string;
  hasTable?: boolean;
}

export interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
}

// Symbolic engine input types
export interface SymbolicEngineInput {
  query: string;
  userData?: any;
  shipments?: any[];
  forwarders?: any[];
}

// Extended types for OracleHut functionality
export interface CachedShipmentData {
  data: any[];
  timestamp: number;
  expiresAt: number;
}

export interface ForwarderMetrics {
  name: string;
  shipmentCount: number;
  avgCost: number;
  avgTime: string | number;
  reliability: string;
  reliabilityScore: number;
  costScore: number;
  timeScore: number;
  delayRate: number;
}
