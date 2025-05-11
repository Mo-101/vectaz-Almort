
/**
 * Debug utility to trace calculation flow in DeepCAL
 */

export function traceCalculation(
  stage: string, 
  input: any,
  output?: any,
  options?: { logToConsole?: boolean, traceLevel?: 'basic' | 'detailed' }
) {
  const defaultOptions = {
    logToConsole: true,
    traceLevel: 'basic' as const
  };
  
  const config = { ...defaultOptions, ...(options || {}) };
  const timestamp = new Date().toISOString();
  
  const trace = {
    timestamp,
    stage,
    input: config.traceLevel === 'detailed' ? input : summarizeInput(input),
    output: output !== undefined ? (config.traceLevel === 'detailed' ? output : summarizeOutput(output)) : undefined,
  };
  
  if (config.logToConsole) {
    console.log(`[DeepCAL Trace] ${stage}:`, trace);
  }
  
  return trace;
}

// Helper to summarize large input objects for logging
function summarizeInput(input: any): any {
  if (!input) return null;
  
  // If it's a basic type, return as is
  if (typeof input !== 'object') return input;
  
  // If it's an array, summarize its length and first item
  if (Array.isArray(input)) {
    return {
      type: 'array',
      length: input.length,
      sample: input.length > 0 ? summarizeSample(input[0]) : null
    };
  }
  
  // For objects, show keys and sample values
  return {
    type: 'object',
    keys: Object.keys(input),
    sampleValues: Object.keys(input).reduce((acc, key) => {
      acc[key] = summarizeSample(input[key]);
      return acc;
    }, {} as Record<string, any>)
  };
}

// Helper to summarize output objects
function summarizeOutput(output: any): any {
  if (!output) return null;
  
  // For arrays (like forwarder scores), show compact form
  if (Array.isArray(output) && output.length > 0 && output[0]?.forwarder) {
    return output.map(item => ({
      forwarder: item.forwarder,
      score: item.score,
      ...(item.costPerformance ? { 
        performances: {
          cost: item.costPerformance,
          time: item.timePerformance,
          reliability: item.reliabilityPerformance
        }
      } : {})
    }));
  }
  
  return output;
}

// Helper to summarize a sample value
function summarizeSample(value: any): any {
  if (value === null || value === undefined) return value;
  
  // For basic types, return as is
  if (typeof value !== 'object') return value;
  
  // For objects, return type and keys
  if (Array.isArray(value)) {
    return `Array(${value.length})`;
  }
  
  return `Object{${Object.keys(value).join(',')}}`;
}

// Utility to verify if a calculation is dynamic or static
export function verifyCalculation<T>(
  calculationFn: (input: any) => T, 
  testInput1: any,
  testInput2: any
): { isDynamic: boolean; results: [T, T] } {
  const result1 = calculationFn(testInput1);
  const result2 = calculationFn(testInput2);
  
  // Check if results are different when inputs are different
  const isDynamic = JSON.stringify(result1) !== JSON.stringify(result2);
  
  return {
    isDynamic,
    results: [result1, result2]
  };
}
