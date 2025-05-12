
import React from 'react';
import { ForwarderPerformance } from '@/types/forwarder';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { AlertTriangle } from 'lucide-react';

interface ForwarderRankingTableProps {
  forwarders: ForwarderPerformance[];
  symbolicInsights?: Array<{
    name: string;
    issue: string;
  }>;
}

const ForwarderRankingTable: React.FC<ForwarderRankingTableProps> = ({ 
  forwarders,
  symbolicInsights = []
}) => {
  // Sort forwarders by performance score
  const sortedForwarders = [...forwarders].sort((a, b) => 
    (b.reliabilityScore || 0) - (a.reliabilityScore || 0)
  );

  // Helper to check if a forwarder has an insight/anomaly
  const getForwarderInsight = (forwarderName: string) => {
    return symbolicInsights.find(
      insight => insight.name.toLowerCase() === forwarderName.toLowerCase()
    );
  };

  return (
    <div className="relative overflow-x-auto rounded-md">
      <Table>
        <TableHeader className="bg-gray-800/50">
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Forwarder</TableHead>
            <TableHead className="text-right">Reliability</TableHead>
            <TableHead className="text-right">On-Time %</TableHead>
            <TableHead className="text-right">Cost Efficiency</TableHead>
            <TableHead className="text-right">Response Time</TableHead>
            <TableHead className="text-right">Anomalies</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedForwarders.map((forwarder, index) => {
            const insight = getForwarderInsight(forwarder.name);
            
            return (
              <TableRow key={index} className={insight ? 'bg-amber-900/10' : ''}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {forwarder.name}
                    {insight && (
                      <span className="text-amber-400">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  {insight && (
                    <div className="text-xs text-amber-400 mt-1">
                      {insight.issue}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${Math.min(100, Math.max(0, forwarder.reliabilityScore * 100))}%` }}
                      />
                    </div>
                    <div>
                      {Math.round(forwarder.reliabilityScore * 100)}%
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {forwarder.onTimeRate ? `${Math.round(forwarder.onTimeRate)}%` : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  {forwarder.avgCostPerKg ? 
                    `$${forwarder.avgCostPerKg.toFixed(2)}` : 'N/A'
                  }
                </TableCell>
                <TableCell className="text-right">
                  {/* Use avgTransitDays as a fallback for response time */}
                  {(forwarder as any).avgResponseTime ? 
                    `${(forwarder as any).avgResponseTime.toFixed(1)} hrs` : 
                    (forwarder.avgTransitDays ? 
                      `~${forwarder.avgTransitDays.toFixed(1)} days` : 'N/A')
                  }
                </TableCell>
                <TableCell className="text-right">
                  {insight ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 text-xs">
                      Detected
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-900/30 text-green-400 text-xs">
                      Clear
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ForwarderRankingTable;
