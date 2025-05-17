
// Conversational AI utilities for DeepTalk

export interface ConversationIntent {
  action?: 'analyze' | 'recommend' | 'compare' | 'info' | 'help' | 'query';
  origin?: string;
  destination?: string;
  weight?: number;
  urgent?: boolean;
  emergency?: boolean;
  mode?: string;
  criteria?: string[];
}

export interface ConversationMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  parsedIntent?: ConversationIntent;
}

export const initVoiceSystem = async () => {
  console.log('Voice system initialization stubbed');
  return {
    status: 'initialized',
    message: 'Voice system initialized as stub'
  };
};

export const processUserQuery = async (query: string) => {
  return {
    response: `This is a stub response for: "${query}"`,
    confidence: 0.85
  };
};

export const parseConversationalIntent = (text: string): ConversationIntent => {
  // Simple intent parser - in a real system this would use NLP
  const lowerText = text.toLowerCase();
  
  const intent: ConversationIntent = {};
  
  // Detect action type
  if (lowerText.includes('analyze') || lowerText.includes('analysis')) {
    intent.action = 'analyze';
  } else if (lowerText.includes('recommend') || lowerText.includes('suggestion')) {
    intent.action = 'recommend';
  } else if (lowerText.includes('compare') || lowerText.includes('versus') || lowerText.includes('vs')) {
    intent.action = 'compare';
  } else if (lowerText.includes('help') || lowerText.includes('how to')) {
    intent.action = 'help';
  } else if (lowerText.match(/what|when|where|who|why|how/)) {
    intent.action = 'query';
  } else {
    intent.action = 'info';
  }
  
  // Simple location extraction - in a real system use named entity recognition
  const fromMatch = lowerText.match(/from\s+([a-z\s]+)(?:\s+to|\s+[,.]|$)/i);
  if (fromMatch) {
    intent.origin = fromMatch[1].trim();
  }
  
  const toMatch = lowerText.match(/to\s+([a-z\s]+)(?:\s+from|\s+[,.]|$)/i);
  if (toMatch) {
    intent.destination = toMatch[1].trim();
  }
  
  // Extract weight if mentioned
  const weightMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos|kilograms|ton|tons)/i);
  if (weightMatch) {
    intent.weight = parseFloat(weightMatch[1]);
  }
  
  // Check for urgency/emergency indicators
  intent.urgent = lowerText.includes('urgent') || lowerText.includes('quickly') || lowerText.includes('fast');
  intent.emergency = lowerText.includes('emergency') || lowerText.includes('immediate') || lowerText.includes('crisis');
  
  // Check for transportation mode
  if (lowerText.includes('air') || lowerText.includes('fly') || lowerText.includes('plane')) {
    intent.mode = 'air';
  } else if (lowerText.includes('sea') || lowerText.includes('ship') || lowerText.includes('ocean')) {
    intent.mode = 'sea';
  } else if (lowerText.includes('road') || lowerText.includes('truck') || lowerText.includes('lorry')) {
    intent.mode = 'road';
  } else if (lowerText.includes('rail') || lowerText.includes('train')) {
    intent.mode = 'rail';
  }
  
  return intent;
};

export const generateResponse = (intent: ConversationIntent, analysisResults?: any): string => {
  if (intent.action === 'analyze') {
    if (intent.origin && intent.destination) {
      return `I'll analyze the shipment route from ${intent.origin} to ${intent.destination}. ${
        analysisResults ? 'Here are the key insights:' + JSON.stringify(analysisResults).slice(0, 100) + '...' : 
        'Analysis request submitted. I'll have results shortly.'
      }`;
    } else {
      return "I'd be happy to analyze a shipping route for you. Could you please specify the origin and destination?";
    }
  }
  
  if (intent.action === 'recommend') {
    if (intent.origin && intent.destination) {
      return `Based on our analysis, for shipping from ${intent.origin} to ${intent.destination}, I recommend using ${
        intent.emergency ? 'air freight with DHL Express for fastest delivery' :
        intent.urgent ? 'air freight with a balance of cost and time' : 
        'sea freight as the most cost-effective option'
      }.`;
    } else {
      return "I can provide recommendations for your shipping needs. Could you please provide more details about your shipment?";
    }
  }
  
  if (intent.action === 'compare') {
    return "I'll prepare a comparison of the available options based on cost, transit time, and reliability.";
  }
  
  if (intent.action === 'help') {
    return "I can help you analyze shipping routes, recommend optimal carriers, compare options, and provide general logistics guidance. Just let me know what you need!";
  }
  
  if (intent.action === 'query') {
    if (intent.origin && intent.destination) {
      return `The typical transit time from ${intent.origin} to ${intent.destination} is approximately 5-7 business days by air and 25-30 days by sea.`;
    }
    
    return "I'm happy to answer any logistics queries you have. Could you please provide more specific details?";
  }
  
  // Default response
  return "I'm DeepCAL's logistics assistant. How can I help with your shipping needs today?";
};

export const intentToShipmentDetails = (intent: ConversationIntent) => {
  return {
    origin: intent.origin || null,
    destination: intent.destination || null,
    weight: intent.weight || null,
    mode: intent.mode || null,
    urgent: intent.urgent || false,
    emergency: intent.emergency || false
  };
};

export const getFallbackRecommendation = (intent: ConversationIntent): string => {
  // This provides basic responses when in field mode with limited connectivity
  if (intent.emergency) {
    return "Emergency mode activated. Based on cached data, fastest transport option is air freight with premium carrier. Response will be updated when reconnected.";
  }
  
  if (intent.origin && intent.destination) {
    return `Working with limited connectivity mode. For routes from ${intent.origin} to ${intent.destination}, our cached analysis suggests using established carriers like DHL or Maersk depending on your timeframe.`;
  }
  
  return "I'm currently operating in field mode with limited connectivity. I can provide basic guidance based on cached data, but for detailed analysis, we'll need to reconnect to the main system.";
};

// Simple voice interface helper
export const voiceReply = async (text: string) => {
  console.log('[Voice] Would speak:', text);
  // In a real implementation, this would use web speech API or similar
  return {
    success: true
  };
};
