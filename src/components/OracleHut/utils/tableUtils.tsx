
import React from 'react';
import { Table as UITable, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const processResponseWithTables = (text: string): React.ReactNode => {
  // Check if the response contains a table marker
  if (text.includes('|') && (text.includes('\n|') || text.includes('|-'))) {
    try {
      // Extract table content
      const parts = text.split('```');
      let result = [];
      let currentIndex = 0;

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // This is regular text
          if (parts[i].trim()) {
            result.push(<div key={`text-${currentIndex}`}>{parts[i]}</div>);
            currentIndex++;
          }
        } else {
          // This might be a table or code
          if (parts[i].trim().startsWith('table') || parts[i].includes('|')) {
            const tableContent = parts[i].replace('table', '').trim();
            const rows = tableContent.split('\n').filter(row => row.includes('|'));
            
            if (rows.length >= 2) {
              // Process header row
              const headers = rows[0].split('|')
                .map(h => h.trim())
                .filter(h => h);
              
              // Process data rows
              const dataRows = rows.slice(2); // Skip header and separator rows
              
              result.push(
                <div key={`table-${currentIndex}`} className="my-4 overflow-x-auto bg-slate-800/80 rounded-lg border border-[#00FFD1]/30">
                  <UITable>
                    <TableHeader>
                      <TableRow className="border-b border-[#00FFD1]/20">
                        {headers.map((header, idx) => (
                          <TableHead key={`header-${idx}`} className="text-[#00FFD1]">{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataRows.map((row, rowIdx) => {
                        const cells = row.split('|')
                          .map(cell => cell.trim())
                          .filter(cell => cell !== '');
                        
                        return (
                          <TableRow key={`row-${rowIdx}`} className="border-b border-[#00FFD1]/10">
                            {cells.map((cell, cellIdx) => (
                              <TableCell key={`cell-${rowIdx}-${cellIdx}`}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </UITable>
                </div>
              );
              currentIndex++;
            } else {
              result.push(<div key={`code-${currentIndex}`}><pre>{parts[i]}</pre></div>);
              currentIndex++;
            }
          } else {
            result.push(<div key={`code-${currentIndex}`}><pre>{parts[i]}</pre></div>);
            currentIndex++;
          }
        }
      }
      
      return <>{result}</>;
    } catch (e) {
      console.error("Error parsing table:", e);
      return text;
    }
  }
  
  return text;
};
