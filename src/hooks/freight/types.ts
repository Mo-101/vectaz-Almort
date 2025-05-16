
import { ForwarderRateProps } from '@/components/freight/components/RateInput';

export interface ShipmentDetails {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  cargo: string;
}

export interface ForwarderListItem {
  id: string;
  name: string;
}

// Conversation system types
export interface ConversationIntent {
  origin?: string;
  destination?: string;
  emergency?: boolean;
  cargoType?: string;
  weight?: number;
  volume?: number;
  context?: string;
  action?: 'analyze' | 'track' | 'recommend' | 'info';
}

export interface VoiceSettings {
  enabled: boolean;
  volume: number;
  voice: string;
  speed: number;
}

export interface ConversationMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  parsedIntent?: ConversationIntent;
}
