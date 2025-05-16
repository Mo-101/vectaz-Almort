import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, LineChart, PieChart as PieChartIcon,
  DollarSign, Package, Globe, Building2, Weight, Map, CalendarClock, CircleDollarSign,
  Database, FileWarning, Layers, ShieldAlert, BriefcaseBusiness, Zap, ArrowUpCircle,
  BarChart
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { useBaseDataStore } from '@/store/baseState';
import GlobalNavigation from '@/components/GlobalNavigation';

export function add(a: number, b: number): number {
    return a + b;
}

interface AggregatedLogisticsData {
  totalCost: number;
  totalShipments: number;
  totalFreightForwarders: number;
  totalCountries: number;
  totalWeight: number;
  totalVolume: number;
  avgTransportDays: number;
  avgCostPerKg: number;
  fleetEfficiency: number;
}

const COLORS = ['#15ABC0', '#62F3F7', '#DCCC82', '#3b82f6', '#6366f1'];

const AnalyticsPage: React.FC = () => {
  // Pull base data from Zustand store
  const aggregatedData = useBaseDataStore(state => state.aggregatedData) as AggregatedLogisticsData;
  const topCarriers = useBaseDataStore(state => state.topCarriers);
  const topDestinations = useBaseDataStore(state => state.topDestinations);
  const shipmentsByStatus = useBaseDataStore(state => state.shipmentsByStatus);
  const routePerformanceData = useBaseDataStore(state => state.routePerformanceData);
  const forwarderEfficiencyScores = useBaseDataStore(state => state.forwarderEfficiencyScores);
  const riskAssessment = useBaseDataStore(state => state.countryRiskAssessment);

  const [isLoading, setIsLoading] = useState(false);

  // Counter refs
  const costRef = useRef<HTMLDivElement>(null);
  const shipmentsRef = useRef<HTMLDivElement>(null);
  const forwardersRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const weightRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const transportDaysRef = useRef<HTMLDivElement>(null);
  const costPerKgRef = useRef<HTMLDivElement>(null);

  // Animate counters on data change
  useEffect(() => {
    animateCounter(costRef.current, 0, aggregatedData.totalCost, 1000, true);
    animateCounter(shipmentsRef.current, 0, aggregatedData.totalShipments, 1000);
    animateCounter(forwardersRef.current, 0, aggregatedData.totalFreightForwarders, 1000);
    animateCounter(countriesRef.current, 0, aggregatedData.totalCountries, 1000);
    animateCounter(weightRef.current, 0, aggregatedData.totalWeight, 1000);
    animateCounter(volumeRef.current, 0, aggregatedData.totalVolume, 1000);
    animateCounter(transportDaysRef.current, 0, aggregatedData.avgTransportDays, 1000);
    animateCounter(costPerKgRef.current, 0, aggregatedData.avgCostPerKg, 1000, true);
  }, [aggregatedData]);

  const animateCounter = (
    el: HTMLElement | null,
    start: number,
    end: number,
    duration: number,
    isCurrency = false
  ) => {
    if (!el) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = start + (end - start) * progress;
      if (isCurrency) {
        el.textContent = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(value);
      } else {
        el.textContent = Math.floor(value).toLocaleString();
      }
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Derived chart data
  const deliveryTimeData = routePerformanceData.map((r, i) => ({
    name: `R${i + 1}`,
    Air: r.deliveryTime * 0.5,
    Sea: r.deliveryTime * 2.5,
    Land: r.deliveryTime
  }));
  const fleetData = {
    total: shipmentsByStatus['in-transit'] + shipmentsByStatus['delivered'] + shipmentsByStatus['delayed'],
    onMove: shipmentsByStatus['in-transit'],
    maintenance: shipmentsByStatus['delayed'],
    idle: Math.round(shipmentsByStatus['delivered'] * 0.3)
  };
  const forwarderPerformanceData = Object.entries(forwarderEfficiencyScores).map(([name, score]) => ({
    name,
    leadTime: 15 - (score as number) / 10,
    onTimeRate: score as number
  }));
  const costEfficiencyData = Object.entries(forwarderEfficiencyScores).map(([name, score]) => ({
    name,
    air: (score as number) > 80 ? 10 - (score as number) / 10 : 0,
    sea: (score as number) > 50 ? 10 - (score as number) / 15 : 0,
    road: (score as number) > 30 ? 10 - (score as number) / 20 : 0
  }));
  
  return (
    <div className="h-screen w-full relative bg-gradient-to-b from-slate-950 to-blue-950">
      <GlobalNavigation />
      <div className="p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Logistics Analytics Dashboard</h1>
        <div className="grid grid-cols-12 gap-4">
          {/* KPI Cards */}
          <div className="col-span-3 space-y-4">
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center">
                <DollarSign className="text-teal-400" />
                <span className="ml-2 text-gray-300">Total Cost</span>
              </div>
              <div ref={costRef} className="text-white text-2xl">$0</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center">
                <Package className="text-teal-400" />
                <span className="ml-2 text-gray-300">Total Shipments</span>
              </div>
              <div ref={shipmentsRef} className="text-white text-2xl">0</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center">
                <Building2 className="text-teal-400" />
                <span className="ml-2 text-gray-300">Freight Forwarders</span>
              </div>
              <div ref={forwardersRef} className="text-white text-2xl">0</div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center">
                <Globe className="text-teal-400" />
                <span className="ml-2 text-gray-300">Total Countries</span>
              </div>
              <div ref={countriesRef} className="text-white text-2xl">0</div>
            </div>
          </div>
          {/* Main Charts */}
          <div className="col-span-9 space-y-4">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-gray-300 mb-2">Avg Delivery Time & Route Type</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsBarChart data={deliveryTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Air" fill="#62F3F7" />
                  <Bar dataKey="Sea" fill="#15ABC0" />
                  <Bar dataKey="Land" fill="#DCCC82" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-gray-300 mb-2">Forwarder Performance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsBarChart data={forwarderPerformanceData} layout="vertical">
                  <XAxis type="number" stroke="#aaa" />
                  <YAxis dataKey="name" type="category" stroke="#aaa" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leadTime" name="Lead Time" fill="#62F3F7" />
                  <Bar dataKey="onTimeRate" name="On-Time %" fill="#15ABC0" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;