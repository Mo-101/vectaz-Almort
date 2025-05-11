
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ForwarderScore } from '../types';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface CalculatedMetricsTableProps {
  results: ForwarderScore[];
}

const CalculatedMetricsTable: React.FC<CalculatedMetricsTableProps> = ({ results }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-[#00FFD1]">Performance Metrics</h3>
      <div className="overflow-x-auto">
        <Table className="bg-[#0A1A2F]/60 border border-[#00FFD1]/10 rounded-lg">
          <TableCaption>Comprehensive forwarder performance analysis</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-[#00FFD1]/5 border-b border-[#00FFD1]/10">
              <TableHead className="w-[180px]">Forwarder</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Cost</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Reliability</TableHead>
              <TableHead className="text-center">Neutrosophic</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((forwarder, index) => (
              <TableRow 
                key={forwarder.forwarder} 
                className={index === 0 ? "bg-[#00FFD1]/10 hover:bg-[#00FFD1]/15" : "hover:bg-[#0A1A2F]/80"}
              >
                <TableCell className="font-medium">
                  {index === 0 ? (
                    <span className="flex items-center">
                      <span className="h-2 w-2 bg-[#00FFD1] rounded-full mr-2"></span>
                      {forwarder.forwarder}
                    </span>
                  ) : (
                    forwarder.forwarder
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-block min-w-[45px] px-2 py-1 bg-[#00FFD1]/10 border border-[#00FFD1]/20 rounded text-[#00FFD1] font-medium">
                    {(forwarder.score * 100).toFixed(0)}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {(forwarder.costPerformance * 100).toFixed(0)}%
                </TableCell>
                <TableCell className="text-center">
                  {(forwarder.timePerformance * 100).toFixed(0)}%
                </TableCell>
                <TableCell className="text-center">
                  {(forwarder.reliabilityPerformance * 100).toFixed(0)}%
                </TableCell>
                <TableCell>
                  {forwarder.neutrosophic ? (
                    <div className="flex justify-center items-center space-x-2 text-xs">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        <span>{forwarder.neutrosophic.T.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{forwarder.neutrosophic.I.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center">
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        <span>{forwarder.neutrosophic.F.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CalculatedMetricsTable;
