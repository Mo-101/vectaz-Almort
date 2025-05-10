
// Add this function to fix the "Cannot find name 'checkNCR'" error at line 93
export function checkNCR(value: number): boolean {
  // Implementation depends on what checkNCR is supposed to do
  return value > 0.1; // Example implementation
}

// Add or update this function to fix the MoScriptResult properties issues
export function processScriptResult(result: any) {
  return {
    ...result,
    allScores: result.allScores || [],
    rawTopsisScores: result.rawTopsisScores || [],
    greyGrades: result.greyGrades || [],
    executionTime: result.executionTime || 0
  };
}
