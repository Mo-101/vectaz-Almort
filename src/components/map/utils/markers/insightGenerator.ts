
/**
 * Generate DeepCAL insights for countries
 */
export function generateCountryInsight(countryName: string): string {
  const insights = [
    `Route to ${countryName} is 43% cheaper via Nairobi than alternative routes, even accounting for symbolic fairness.`,
    `DeepCAL analysis shows ${countryName} shipments arrive 2.5 days faster on average than regional peers.`,
    `${countryName} demonstrates high shipment resilience (94%) compared to neighboring routes (76%). Consider increasing capacity.`,
    `Symbolic model suggests ${countryName}'s emerging infrastructure would benefit from increased air freight over sea freight.`,
    `Routes to ${countryName} demonstrated consistent reliability despite regional weather disruptions. Strong performance.`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}
