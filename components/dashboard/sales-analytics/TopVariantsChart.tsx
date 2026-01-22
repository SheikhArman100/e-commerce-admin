'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { TopVariant } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface TopVariantsChartProps {
  data: TopVariant[];
  isLoading?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function TopVariantsChart({ data, isLoading }: TopVariantsChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <TrendingUp className="h-5 w-5 text-slate-600" />
            Top Product Variants
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded w-80"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate profit (revenue - estimated cost, assuming 60% gross margin for simplicity)
  // In a real app, this would come from the API
  const processedData = data.map((variant, index) => {
    const estimatedCost = variant.revenue * 0.4; // Assume 60% gross margin
    const profit = variant.revenue - estimatedCost;

    return {
      ...variant,
      profit: profit,
      // Normalize bubble size (profit relative to max profit)
      bubbleSize: Math.max(profit / 100, 5), // Minimum bubble size of 5
    };
  });

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bubble',
      height: 420,
      fontFamily: 'inherit',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true,
        },
      },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    colors: ['#059669'], // Emerald color matching dashboard theme
    dataLabels: {
      enabled: true,
      formatter: function(val: any, opts: any) {
        const dataPointIndex = opts.dataPointIndex;
        const item = processedData[dataPointIndex];
        return item.variant;
      },
      style: {
        fontSize: '10px',
        fontWeight: 600,
        colors: ['#000000'],
      },
      background: {
        enabled: true,
        foreColor: '#000000',
        padding: 3,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#059669',
        opacity: 0.9,
      },
      offsetY: 0,
    },
    fill: {
      opacity: 0.6,
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.4,
        gradientToColors: ['#10b981'], // Lighter emerald
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    xaxis: {
      title: {
        text: 'Orders',
        style: {
          color: '#475569',
          fontSize: '14px',
          fontWeight: 600,
        },
      },
      min: Math.min(...processedData.map(item => item.orders)) - 2, // Add padding for bubbles
      max: Math.max(...processedData.map(item => item.orders)) + 2, // Add padding for bubbles
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
        formatter: (value:any) => {
          return Math.round(value).toString();
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Revenue ($)',
        style: {
          color: '#475569',
          fontSize: '14px',
          fontWeight: 600,
        },
      },
      min: 0,
      max: Math.max(...processedData.map(item => item.revenue)) * 1.15, // Increased padding for bubbles
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
        formatter: (value) => {
          return formatCurrency(value);
        },
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const item = processedData[dataPointIndex];

        return `
          <div class="p-4 bg-white border border-slate-200 rounded-lg shadow-xl min-w-[280px]">
            <div class="font-bold text-slate-800 mb-2 text-base">
              ${item.variant}
            </div>
            <div class="text-sm text-slate-600 mb-3 pb-2 border-b border-slate-200">
              ${item.productName}
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-slate-600">Revenue:</span>
                <span class="font-semibold text-emerald-700">${formatCurrency(item.revenue)}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600">Orders:</span>
                <span class="font-semibold text-slate-800">${formatNumber(item.orders)}</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                <span class="text-slate-600">Est. Profit:</span>
                <span class="font-semibold text-emerald-600">${formatCurrency(item.profit)}</span>
              </div>
              <div class="text-xs text-slate-500 mt-1">
                Bubble size represents profit margin
              </div>
            </div>
          </div>
        `;
      },
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 30,
        right: 40,
        bottom: 20,
        left: 40,
      },
    },
    legend: {
      show: false, // Hide legend for cleaner look
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 360,
          },
          grid: {
            padding: {
              top: 15,
              right: 15,
              bottom: 15,
              left: 15,
            },
          },
        },
      },
    ],
  };

  const series = [{
    name: 'Product Variants',
    data: processedData.map((item, index) => ({
      x: item.orders,
      y: item.revenue,
      z: item.bubbleSize, // Bubble size based on profit
    })),
  }];

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <TrendingUp className="h-5 w-5 text-slate-600" />
          Top Product Variants
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg pt-4">
        <div className="h-[450px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bubble"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}