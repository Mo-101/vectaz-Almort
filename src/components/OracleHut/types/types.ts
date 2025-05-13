
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

export interface OracleInsight {
  title: string;
  symbolicVerdict: string;
  tags: string[];
  insightType: "comparison" | "recommendation" | "forecast" | "scorecard";
  generatedAt: string;
  tables?: OracleTable[];
  charts?: OracleChart[];
  downloadLinks?: {
    csv?: string;
    json?: string;
    pdf?: string;
  };
}

export interface OracleTable {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface OracleChart {
  type: "bar" | "line" | "pie";
  title: string;
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

// Types for shipment data
export interface Shipment {
  id: string;
  origin_country: string;
  destination_country: string;
  mode_of_shipment: string;
  freight_carrier?: string;
  delivery_status?: string;
  risk_level?: string;
  origin_latitude?: number;
  origin_longitude?: number;
  destination_latitude?: number;
  destination_longitude?: number;
  created_at?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
}

// Types for forwarder data
export interface Forwarder {
  id: string;
  name: string;
  cost_rating?: number;
  time_rating?: number;
  reliability_rating?: number;
  active?: boolean;
}
