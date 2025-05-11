
import React from 'react';
import { WarehousePerformance } from '@/types/deeptrack';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Building2, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface WarehouseAnalyticsProps {
  warehouses: WarehousePerformance[];
  symbolicResults?: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const WarehouseAnalytics: React.FC<WarehouseAnalyticsProps> = ({ warehouses, symbolicResults }) => {
  // Sort warehouses by reliability score in descending order
  const sortedWarehouses = [...warehouses].sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  
  // Get top 5 warehouses for analytics
  const topWarehouses = sortedWarehouses.slice(0, 5);
  
  // Prepare data for charts
  const reliabilityData = topWarehouses.map(wh => ({
    name: wh.name,
    reliability: Math.round(wh.reliabilityScore)
  }));
  
  const pickPackData = topWarehouses.map(wh => ({
    name: wh.name,
    time: wh.avgPickPackTime
  }));
  
  const failureData = topWarehouses.map(wh => ({
    name: wh.name,
    packaging: wh.packagingFailureRate,
    dispatch: wh.missedDispatchRate,
    rescheduled: wh.rescheduledShipmentsRatio
  }));
  
  // Calculate average metrics
  const avgReliability = warehouses.reduce((sum, wh) => sum + wh.reliabilityScore, 0) / warehouses.length;
  const avgPickPackTime = warehouses.reduce((sum, wh) => sum + wh.avgPickPackTime, 0) / warehouses.length;
  const totalShipments = warehouses.reduce((sum, wh) => sum + wh.totalShipments, 0);
  
  // Calculate dispatch success vs failure
  const dispatchSuccess = warehouses.reduce((sum, wh) => sum + (wh.totalShipments * (1 - (wh.missedDispatchRate / 100))), 0);
  const dispatchFailure = totalShipments - dispatchSuccess;
  
  const dispatchData = [
    { name: 'Success', value: dispatchSuccess },
    { name: 'Failure', value: dispatchFailure }
  ];
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Total Warehouses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active logistics hubs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Avg. Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPickPackTime.toFixed(1)} hrs</div>
            <p className="text-xs text-gray-500 mt-1">Pick & pack timeframe</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedWarehouses[0]?.name || 'N/A'}</div>
            <p className="text-xs text-gray-500 mt-1">Highest reliability score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {warehouses.sort((a, b) => a.reliabilityScore - b.reliabilityScore)[0]?.name || 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Lowest reliability score</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reliability Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Reliability Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reliabilityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reliability" fill="#4f46e5" name="Reliability Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Pick & Pack Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Average Pick & Pack Time (Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pickPackData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="time" fill="#06b6d4" name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Failure Rates Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Failure Rates by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={failureData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="packaging" name="Packaging Failure (%)" fill="#ef4444" />
                  <Bar dataKey="dispatch" name="Missed Dispatch (%)" fill="#f97316" />
                  <Bar dataKey="rescheduled" name="Rescheduled (%)" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Dispatch Success Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Dispatch Success vs Failure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dispatchData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dispatchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#ef4444'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} shipments`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Warehouse Table */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Warehouse</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-right">Reliability</th>
                  <th className="px-4 py-2 text-right">Pick & Pack</th>
                  <th className="px-4 py-2 text-right">Shipments</th>
                  <th className="px-4 py-2 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {sortedWarehouses.map((wh, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{wh.name}</td>
                    <td className="px-4 py-2">{wh.location}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end">
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          wh.reliabilityScore > 80 ? 'bg-green-500' : 
                          wh.reliabilityScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        {Math.round(wh.reliabilityScore)}%
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">{wh.avgPickPackTime.toFixed(1)} hrs</td>
                    <td className="px-4 py-2 text-right">{wh.totalShipments}</td>
                    <td className="px-4 py-2 text-right">${wh.costDiscrepancy.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Symbolic insights if available */}
      {symbolicResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Symbolic Warehouse Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
              <h3 className="font-medium mb-1">Processing Time Optimization</h3>
              <p className="text-sm">
                {topWarehouses[0]?.name} could reduce processing time by 14% through workflow restructuring, saving approximately 
                {Math.round(topWarehouses[0]?.avgPickPackTime * 0.14 * topWarehouses[0]?.totalShipments)} hours annually.
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-md border border-amber-100">
              <h3 className="font-medium mb-1">Resource Allocation Alert</h3>
              <p className="text-sm">
                Consider reallocating 20% of staff from {topWarehouses[1]?.name} to {sortedWarehouses[sortedWarehouses.length - 1]?.name} during peak periods to balance capacity constraints.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WarehouseAnalytics;
