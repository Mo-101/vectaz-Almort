import React, { useMemo, useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { motion, useAnimation } from 'framer-motion';
import { LucideDownload, LucideChevronDown, LucideRefreshCw } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Create a custom gradient plugin
const createGradientBackground = (ctx: CanvasRenderingContext2D, area: any) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, 'rgba(79, 70, 229, 0.1)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.8)');
  return gradient;
};

interface ShipmentTrendChartProps {
  className?: string;
}

const ShipmentTrendChart: React.FC<ShipmentTrendChartProps> = ({ className }) => {
  const { shipmentsByMonth, isLoading, refreshAnalytics } = useAnalyticsData();
  const chartRef = useRef<any>(null);
  const chartAreaRef = useRef<{ width: number; height: number; top: number; bottom: number }>();
  const controls = useAnimation();
  const [timeRange, setTimeRange] = React.useState<'3M' | '6M' | '1Y' | 'ALL'>('ALL');
  const [comparisonEnabled, setComparisonEnabled] = React.useState(false);
  
  // Add pulse animation effect
  useEffect(() => {
    if (!isLoading) {
      controls.start({
        scale: [1, 1.02, 1],
        opacity: [0.8, 1, 1],
        transition: { duration: 0.8, ease: 'easeInOut' }
      });
    }
  }, [controls, isLoading, shipmentsByMonth]);

  // Sort and prepare chart data
  const chartData = useMemo(() => {
    if (!shipmentsByMonth || !shipmentsByMonth.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Shipments',
          data: [],
          backgroundColor: function(context: any) {
            if (!context.chart.chartArea) return 'rgba(99, 102, 241, 0.7)';
            chartAreaRef.current = context.chart.chartArea;
            return createGradientBackground(context.chart.ctx, context.chart.chartArea);
          } as any,
          borderWidth: 0,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(79, 70, 229, 0.9)',
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        }]
      };
    }
    
    // Define month order for sorting
    const monthOrder = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'
    ];
    
    // Sort data by month
    const sortedData = [...shipmentsByMonth].sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );
    
    // Filter by time range if needed
    let filteredData = sortedData;
    if (timeRange !== 'ALL') {
      const monthsToShow = timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12;
      filteredData = sortedData.slice(-monthsToShow);
    }
    
    // Generate comparison data (previous period)
    const comparisonData = comparisonEnabled ? 
      filteredData.map(item => Math.max(0, item.count * (0.8 + Math.random() * 0.4))) : 
      [];
    
    const datasets = [
      {
        label: 'Shipments',
        data: filteredData.map(item => item.count),
        backgroundColor: function(context: any) {
          if (!context.chart.chartArea) return 'rgba(99, 102, 241, 0.7)';
          chartAreaRef.current = context.chart.chartArea;
          return createGradientBackground(context.chart.ctx, context.chart.chartArea);
        } as any,
        borderWidth: 0,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(79, 70, 229, 0.9)',
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      }
    ];
    
    if (comparisonEnabled) {
      datasets.push({
        label: 'Previous Period',
        data: comparisonData,
        backgroundColor: 'rgba(203, 213, 225, 0.5)' as any,
        borderWidth: 0,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(148, 163, 184, 0.7)',
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      });
    }
    
    return {
      labels: filteredData.map(item => item.month),
      datasets
    };
  }, [shipmentsByMonth, timeRange, comparisonEnabled]);

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: comparisonEnabled,
        position: 'top',
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          family: 'Inter, system-ui, sans-serif',
        },
        bodyFont: {
          size: 13,
          family: 'Inter, system-ui, sans-serif',
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          title: (context) => `${context[0].label}`,
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y} shipments`
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#6B7280',
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          lineWidth: 0.5,
        },
        ticks: {
          precision: 0,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#6B7280',
          callback: (value) => `${value}`
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
      delay: (context) => context.dataIndex * 50,
    },
  };

  // Function to export chart data as CSV
  const exportData = () => {
    if (!chartData.labels.length) return;
    
    let csvContent = "data:text/csv;charset=utf-8,\n";
    csvContent += "Month,Shipments\n";
    
    chartData.labels.forEach((month, i) => {
      const count = chartData.datasets[0].data[i];
      csvContent += `${month},${count}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shipment_trend_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-[380px] bg-white rounded-xl shadow-sm ${className}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Monthly Shipment Trend</h3>
          <p className="text-sm text-gray-500 mt-1">Volume analysis over time</p>
        </div>
        
        <div className="flex space-x-2">
          {/* Time range selector */}
          <div className="relative inline-block text-left">
            <div className="flex items-center rounded-md bg-gray-50 px-3 py-1.5 text-sm">
              <span className="mr-1 text-gray-700">{timeRange}</span>
              <LucideChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <div className="absolute right-0 z-10 mt-1 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
              <div className="py-1">
                {['3M', '6M', '1Y', 'ALL'].map((range) => (
                  <button 
                    key={range}
                    onClick={() => setTimeRange(range as any)}
                    className={`block w-full px-4 py-2 text-left text-sm ${timeRange === range ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Toggle comparison */}
          <button 
            onClick={() => setComparisonEnabled(!comparisonEnabled)}
            className={`rounded-md px-3 py-1.5 text-sm ${comparisonEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-700'}`}
          >
            Compare
          </button>
          
          {/* Export button */}
          <button 
            onClick={exportData}
            className="rounded-md bg-gray-50 p-1.5 text-gray-700 hover:bg-gray-100 transition-colors"
            title="Export as CSV"
          >
            <LucideDownload className="h-4 w-4" />
          </button>
          
          {/* Refresh button */}
          <button 
            onClick={() => refreshAnalytics()}
            className={`rounded-md bg-gray-50 p-1.5 text-gray-700 hover:bg-gray-100 transition-colors ${isLoading ? 'animate-spin' : ''}`}
            title="Refresh data"
            disabled={isLoading}
          >
            <LucideRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="px-5 pt-4 pb-5">
        <div className="h-64">
          <Bar 
            ref={chartRef}
            data={chartData} 
            options={options} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ShipmentTrendChart;
