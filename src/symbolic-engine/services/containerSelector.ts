
// containerSelector.ts - Container decision engine

export function selectContainer(weightKg: number, volumeCbm: number): string {
  if (weightKg <= 28000 && volumeCbm <= 33) return '20ft Container';
  if (weightKg <= 28000 && volumeCbm <= 67) return '40ft Container';
  return 'Break Bulk or Multi-Unit';
}
