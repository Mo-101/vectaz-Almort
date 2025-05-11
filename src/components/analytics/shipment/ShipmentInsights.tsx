
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics } from '@/types/deeptrack';
import { TrendingUp, AlertTriangle, CheckCircle, ThumbsUp, Map, ArrowUpRight } from 'lucide-react';
import { metricAnalyzers } from '@/core/base_engine/ts/metricReasoner';

interface ShipmentInsightsProps {
  metrics: ShipmentMetrics;
}

const ShipmentInsights: React.FC<ShipmentInsightsProps> = ({ metrics }) => {
  // Get detailed insights from the metric reasoner
  const resilienceDetails = metricAnalyzers.resilience(metrics);
  const disruptionDetails = metricAnalyzers.disruption(metrics);
  const networkHealthDetails = metricAnalyzers.networkHealth(metrics);

  // Helper function to get icon based on sentiment
  const getInsightIcon = (text: string) => {
    if (text.includes('High risk') || text.includes('Critical') || text.includes('limited')) {
      return <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />;
    }
    if (text.includes('Moderate') || text.includes('specific') || text.includes('partial')) {
      return <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />;
    }
    return <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />;
  };
  
  // Get recommendations based on metrics
  const getRecommendations = () => {
    const recommendations = [];
    
    if (metrics.resilienceScore < 70) {
      recommendations.push('Develop backup carrier relationships for critical routes');
    }
    
    if (metrics.disruptionProbabilityScore > 5) {
      recommendations.push('Implement early warning system for high-risk corridors');
    }
    
    if (metrics.avgTransitTime > 7) {
      recommendations.push('Review route optimization for shipments exceeding 7-day transit time');
    }
    
    if (metrics.noQuoteRatio > 0.2) {
      recommendations.push('Expand forwarder base to reduce no-quote instances');
    }
    
    // Always add some standard recommendations
    recommendations.push('Monitor cost trends by region to identify optimization opportunities');
    recommendations.push('Consider mode shifts where appropriate to balance cost and speed');
    
    return recommendations;
  };

  return (
    <Card>
      <CardHeader className="border-b border-border/40 bg-black/30">
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          DeepSight™ Shipment Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-950/40 to-purple-950/40 p-4 rounded-lg border border-blue-900/50">
            <h3 className="font-medium text-mostar-light-blue mb-2 flex items-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Network Health: {networkHealthDetails.value.toFixed(1)}
            </h3>
            <div className="space-y-2">
              {networkHealthDetails.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start text-sm text-muted-foreground">
                  {getInsightIcon(insight)}
                  <span className="ml-2">{insight}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-950/30 to-red-950/30 rounded-lg border border-amber-900/50">
              <h3 className="font-medium text-amber-300 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Disruption Analysis
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {metrics.disruptionProbabilityScore > 5 
                  ? `Your shipment disruption risk is elevated at ${metrics.disruptionProbabilityScore.toFixed(1)}/10. Consider diversifying carriers or routes to mitigate risk.` 
                  : `Your shipment disruption risk is well-managed at ${metrics.disruptionProbabilityScore.toFixed(1)}/10. Continue monitoring high-value corridors for potential changes.`}
              </p>
              <div className="mt-1 text-xs text-amber-200/70">Based on analysis of {disruptionDetails.sampleSize} shipments</div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-emerald-950/30 to-cyan-950/30 rounded-lg border border-emerald-900/50">
              <h3 className="font-medium text-emerald-300 mb-2 flex items-center">
                <Map className="h-4 w-4 mr-2" />
                Network Resilience
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {metrics.resilienceScore > 75 
                  ? `Strong network resilience score of ${metrics.resilienceScore.toFixed(1)}. Your supply chain demonstrates robust contingency capabilities.` 
                  : `Moderate network resilience score of ${metrics.resilienceScore.toFixed(1)}. Consider developing redundancy for critical routes.`}
              </p>
              <div className="mt-1 text-xs text-emerald-200/70">Confidence: {resilienceDetails.confidence}</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-mostar-light-blue mb-2 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Recommendations
            </h3>
            <div className="space-y-2">
              {getRecommendations().map((recommendation, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="h-5 w-5 mr-2 rounded-full bg-gradient-to-r from-mostar-light-blue/20 to-mostar-light-blue/10 flex items-center justify-center text-xs text-mostar-light-blue">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-muted-foreground">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentInsights;
