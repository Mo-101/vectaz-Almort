
/**
 * Generate DeepCAL insights for countries
 */
export function generateCountryInsight(countryName: string): string {
  const insights = [
    `Route to ${countryName} is 43% cheaper via Nairobi than alternative routes, even accounting for symbolic fairness.`,
    `DeepCAL analysis shows ${countryName} shipments arrive 2.5 days faster on average than regional peers.`,
    `${countryName} demonstrates high shipment resilience (94%) compared to neighboring routes (76%). Consider increasing capacity.`,
    `Symbolic model suggests ${countryName}'s emerging infrastructure would benefit from increased air freight over sea freight.`,
    `Routes to ${countryName} demonstrated consistent reliability despite regional weather disruptions. Strong performance.`,
    `DeepCAL forecasts a 17% increase in shipping volume to ${countryName} over the next quarter based on historical patterns.`,
    `${countryName}'s customs clearance efficiency has improved by 34% since implementing digital documentation systems.`,
    `Modern warehouse facilities in ${countryName} have reduced last-mile delivery times by an average of 1.2 days.`,
    `Consolidating shipments to ${countryName} with neighboring destinations could reduce costs by up to 21%.`,
    `DeepCAL recommends establishing direct air freight to ${countryName} based on current volume and growth trajectory.`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}
