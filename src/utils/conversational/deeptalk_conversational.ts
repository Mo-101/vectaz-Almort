
import { ShipmentDetails } from '@/hooks/freight/types';

// Conversation message type
export interface ConversationMessage {
  id?: string;
  text: string;
  isUser?: boolean;
  timestamp: Date;
  isLoading?: boolean;
  isPending?: boolean;
  intent?: ConversationIntent;
  parsedIntent?: ConversationIntent;
}

// Conversation intent types
export interface ConversationIntent {
  action: 'info' | 'quote' | 'book' | 'track' | 'cancel' | 'help' | 'analyze' | 'recommend';
  origin?: string;
  destination?: string;
  cargo?: string;
  cargoType?: string;
  weight?: number;
  volume?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  emergency?: boolean;
  timeline?: string;
  hasAttachments?: boolean;
  trackingNumber?: string;
  needsApproval?: boolean;
}

/**
 * Parses natural language input to extract shipping details and intent
 */
export function parseConversationalIntent(input: string): ConversationIntent {
  const intent: ConversationIntent = {
    action: 'info'
  };

  // Check for emergency keywords
  const emergencyKeywords = ['emergency', 'urgent', 'critical', 'priority', 'immediate', 'cholera', 'disaster'];
  intent.emergency = emergencyKeywords.some(keyword => input.toLowerCase().includes(keyword));

  // Parse origin location
  const fromRegex = /from\s+([A-Za-z\s]+?)(?:\s+to|\s+for|\s+with|\s+$)/i;
  const originMatch = input.match(fromRegex);
  if (originMatch && originMatch[1]) {
    intent.origin = originMatch[1].trim();
  }

  // Parse destination location
  const toRegex = /(?:to|for)\s+([A-Za-z\s]+?)(?:\s+from|\s+with|\s+$)/i;
  const destMatch = input.match(toRegex);
  if (destMatch && destMatch[1]) {
    intent.destination = destMatch[1].trim();
  }

  // Check for country/location names directly
  const countries = [
    'Kenya', 'Nairobi', 'DRC', 'Congo', 'Uganda', 'Tanzania', 'Ethiopia', 
    'Sudan', 'South Sudan', 'Rwanda', 'Burundi', 'Somalia'
  ];
  
  countries.forEach(country => {
    if (input.includes(country)) {
      // If we already have an origin but not destination, set as destination
      if (intent.origin && !intent.destination) {
        intent.destination = country;
      } 
      // If we already have a destination but not origin, set as origin
      else if (intent.destination && !intent.origin) {
        intent.origin = country;
      }
      // If we have neither, determine based on context
      else if (!intent.origin && !intent.destination) {
        if (input.indexOf(country) < input.length / 2) {
          intent.origin = country;
        } else {
          intent.destination = country;
        }
      }
    }
  });

  // Parse cargo type
  const cargoTypes = [
    { keyword: 'Emergency Health Kits', type: 'Emergency Health Kits' },
    { keyword: 'Biomedical Equipment', type: 'Biomedical Equipment' },
    { keyword: 'Cold Chain Equipments', type: 'Cold Chain Equipments' },
    { keyword: 'Field Support Materials', type: 'Field Support Materials' },
    { keyword: 'Lab & Diagnostics', type: 'Lab & Diagnostics' },
    { keyword: 'WASH/IPC Materials', type: 'WASH/IPC Materials' },
    { keyword: 'Biomedical Consumables', type: 'Biomedical Consumables' },
    { keyword: 'PPE', type: 'PPE' },
    { keyword: 'Pharmaceuticals', type: 'Pharmaceuticals' },
    { keyword: 'Visibility Materials', type: 'Visibility Materials' }
  ];

  for (const cargo of cargoTypes) {
    if (input.toLowerCase().includes(cargo.keyword)) {
      intent.cargoType = cargo.type;
      break;
    }
  }

  // Parse weight
  const weightRegex = /(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)/i;
  const weightMatch = input.match(weightRegex);
  if (weightMatch && weightMatch[1]) {
    intent.weight = parseFloat(weightMatch[1]);
  }

  // Parse volume
  const volumeRegex = /(\d+(?:\.\d+)?)\s*(?:m3|cubic meters|cbm)/i;
  const volumeMatch = input.match(volumeRegex);
  if (volumeMatch && volumeMatch[1]) {
    intent.volume = parseFloat(volumeMatch[1]);
  }

  // Determine action based on keywords
  if (input.toLowerCase().includes('track') || input.toLowerCase().includes('where')) {
    intent.action = 'track';
  } else if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('best')) {
    intent.action = 'analyze';
  } else if (input.toLowerCase().includes('recommend') || input.toLowerCase().includes('suggest')) {
    intent.action = 'recommend';
  }

  return intent;
}

/**
 * Converts parsed intent into ShipmentDetails format
 */
export function intentToShipmentDetails(intent: ConversationIntent): ShipmentDetails {
  return {
    origin: intent.origin || 'Unknown',
    destination: intent.destination || 'Unknown',
    weight: intent.weight || 0,
    volume: intent.volume || 0,
    cargo: intent.cargoType || 'General Cargo'
  };
}

/**
 * Generates a natural language response based on the parsed intent
 */
export function generateResponse(intent: ConversationIntent, analysisResults?: any): string {
  if (!intent.origin && !intent.destination) {
    return "I need more information about your shipment. Could you provide origin and destination?";
  }

  let response = '';

  // Add context based on emergency status
  if (intent.emergency) {
    response += "I've flagged this as an emergency shipment. ";
  }

  // Add shipment details confirmation
  let details = "Based on your message, ";
  if (intent.origin) details += `shipping from ${intent.origin} `;
  if (intent.destination) details += `to ${intent.destination} `;
  if (intent.cargoType) details += `carrying ${intent.cargoType} `;
  if (intent.weight) details += `weighing ${intent.weight}kg `;
  if (intent.volume) details += `with volume ${intent.volume}m³ `;
  
  response += details + ". ";

  // Add action-specific response
  switch (intent.action) {
    case 'analyze':
      response += "I'll analyze the optimal freight forwarding options for this shipment.";
      break;
    case 'track':
      response += "I'll check the tracking information for this shipment.";
      break;
    case 'recommend':
      if (analysisResults && analysisResults.results && analysisResults.results.length > 0) {
        const bestOption = analysisResults.results[0];
        response += `I recommend using ${bestOption.forwarderName} with a reliability score of ${(bestOption.topsisScore * 100).toFixed(1)}%.`;
      } else {
        response += "I'll calculate the recommended freight forwarder for this shipment.";
      }
      break;
    default:
      response += "I can help you analyze shipping options, track shipments, or recommend the best freight forwarder for your needs.";
  }

  return response;
}

/**
 * Fallback logic for when connection is limited
 */
export function getFallbackRecommendation(intent: ConversationIntent): string {
  // Default emergency recommendation based on region
  let recommendation = '';
  
  if (intent.emergency) {
    if (intent.destination?.toLowerCase().includes('congo') || 
        intent.destination?.toLowerCase().includes('drc')) {
      recommendation = "EMERGENCY MODE: For Congo/DRC emergency shipments, suggest Freight In Time via Goma corridor if security permits, or air freight via Ethiopian Airlines with UNHAS last-mile for cholera supplies. Reliability over cost.";
    } else if (intent.destination?.toLowerCase().includes('sudan')) {
      recommendation = "EMERGENCY MODE: For Sudan emergency shipments, route through UNHAS via Ethiopia or Kenya. Avoid Port Sudan due to regional conflicts. Coordinate with WFP logistics.";
    } else {
      recommendation = "EMERGENCY MODE: Prioritize DHL or Freight In Time for emergency shipments with proven medical supply experience. Notify destination of urgent medical incoming.";
    }
  } else {
    recommendation = "OFFLINE MODE: Standard shipment protocols apply. Cache this query and synchronize with optimal routes when connection restored.";
  }
  
  return recommendation;
}
