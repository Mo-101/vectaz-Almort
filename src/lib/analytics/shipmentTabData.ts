
// Find and fix the error in line 153
// Update line 153 to properly convert string to number before addition
export function someFunction(value: string | number) {
  // Convert to number if it's a string
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  return numberValue + 10; // Now it's adding number + number
}
