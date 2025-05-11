
import React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { CountryPerformance } from '@/types/deeptrack';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Globe, MapPin, Clock, X, Flag, Brain } from 'lucide-react';

const VALID_FORWARDERS = [
  'Kuehne Nagel', 'Freight in Time', 'Scan Global', 'Siginon Logistics',
  'DHL Express', 'DHL Global', 'BWOSI', 'AGL'
];

interface CountryAnalyticsProps {
  countries: CountryPerformance[];
  symbolicResults?: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A288E3', '#FF6B6B'];

const CountryAnalytics: React.FC<CountryAnalyticsProps> = ({ countries, symbolicResults }) => {
  const topCountries = countries.slice(0, 6);

  const volumeData = topCountries.map(c => ({ name: c.country, shipments: c.totalShipments }));
  const costData = topCountries.map(c => ({ name: c.country, cost: c.avgCostPerRoute }));
  const resilienceData = topCountries.map(c => ({ name: c.country, index: c.resilienceIndex }));

  const allModes = Array.from(new Set(countries.map(c => c.preferredMode)));
  const modeData = allModes.map(mode => ({ name: mode, value: countries.filter(c => c.preferredMode === mode).length }));

  const totalShipments = countries.reduce((acc, cur) => acc + cur.totalShipments, 0);
  const totalWeight = countries.reduce((acc, cur) => acc + (cur.totalWeight || 0), 0);
  const totalVolume = countries.reduce((acc, cur) => acc + (cur.totalVolume || 0), 0);
  const totalCost = countries.reduce((acc, cur) => acc + (cur.totalCost || 0), 0);

  const avgCostPerKg = totalWeight ? totalCost / totalWeight : 0;
  const avgVolumePerKg = totalWeight ? totalVolume / totalWeight : 0;
  const density = totalVolume ? totalWeight / totalVolume : 0;

  const avgDelay = countries.reduce((sum, c) => sum + (c.avgDelayDays || 0), 0) / countries.length;

  const ffTotalCost = countries.reduce((acc: number, c: CountryPerformance) => acc + (c.totalCost || 0), 0);
  const ffTotalWeight = countries.reduce((acc: number, c: CountryPerformance) => acc + (c.totalWeight || 0), 0);
  const ffEfficiency = ffTotalWeight ? ffTotalCost / ffTotalWeight : 0;

  const costs = countries.map(c => c.avgCostPerRoute);
  const meanCost = costs.reduce((a, b) => a + b, 0) / costs.length;
  const stdDev = Math.sqrt(costs.reduce((a, b) => a + Math.pow(b - meanCost, 2), 0) / costs.length);

  const costAnomalies = countries.map(c => ({
    country: c.country,
    zScore: stdDev ? ((c.avgCostPerRoute - meanCost) / stdDev).toFixed(2) : '0.00'
  })).sort((a, b) => parseFloat(b.zScore) - parseFloat(a.zScore));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle><Globe className="h-4 w-4 mr-2 inline" />Countries</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{countries.length}</div><p className="text-xs text-muted-foreground">Unique destinations</p></CardContent>
        </Card>
        <Card><CardHeader><CardTitle><Flag className="h-4 w-4 mr-2 inline text-green-500" />Most Resilient</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{countries.sort((a, b) => b.resilienceIndex - a.resilienceIndex)[0]?.country || 'N/A'}</div><p className="text-xs text-muted-foreground">Highest resilience</p></CardContent>
        </Card>
        <Card><CardHeader><CardTitle><Clock className="h-4 w-4 mr-2 inline text-yellow-500" />Avg Delay</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{avgDelay.toFixed(1)} days</div><p className="text-xs text-muted-foreground">Avg delay per country</p></CardContent>
        </Card>
        <Card><CardHeader><CardTitle><X className="h-4 w-4 mr-2 inline text-red-500" />Highest Risk</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{countries.sort((a, b) => b.deliveryFailureRate - a.deliveryFailureRate)[0]?.country || 'N/A'}</div><p className="text-xs text-muted-foreground">Failure-prone route</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Avg. Cost/kg</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${avgCostPerKg.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Avg. Volume/kg</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{avgVolumePerKg.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Density (kg/m³)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{density.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>FF Efficiency</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${ffEfficiency.toFixed(2)}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Shipment Volume</CardTitle></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={volumeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="shipments" fill="#6366f1" /></BarChart></ResponsiveContainer></CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Transport Mode Split</CardTitle></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={modeData} dataKey="value" nameKey="name" outerRadius={100} label>{modeData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart></ResponsiveContainer></CardContent>
        </Card>
      </div>

      <Card><CardHeader><CardTitle>Top Cost Anomalies (Z-Score)</CardTitle></CardHeader>
        <CardContent><ul className="text-sm space-y-2">{costAnomalies.slice(0, 5).map((item, idx) => (<li key={idx}><strong>{item.country}</strong> → Z: {item.zScore}</li>))}</ul></CardContent>
      </Card>

      {symbolicResults && (
        <Card><CardHeader><CardTitle className="flex items-center"><Brain className="h-5 w-5 mr-2 text-blue-500" />DeepSight™ Country Insights</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-md border">
                <h4 className="font-semibold">Cost Optimization</h4>
                <p className="text-sm text-muted-foreground">{costAnomalies[0]?.country} is showing unusual cost patterns. Recommend renegotiation or route shift.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-md border">
                <h4 className="font-semibold">Risk Hotspot</h4>
                <p className="text-sm text-muted-foreground">{countries.sort((a, b) => b.deliveryFailureRate - a.deliveryFailureRate)[0]?.country} leads in failures. Evaluate local partners and customs engagement strategies.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CountryAnalytics;
