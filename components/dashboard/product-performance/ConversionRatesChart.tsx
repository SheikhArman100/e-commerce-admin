'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Funnel, ShoppingCart, Eye } from 'lucide-react';
import { ProductConversion } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ConversionRatesChartProps {
  data: ProductConversion[];
  isLoading?: boolean;
}

export default function ConversionRatesChart({ data, isLoading }: ConversionRatesChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Funnel className="h-5 w-5 text-slate-600" />
            Purchase Funnel Analysis
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

  // Take top 5 products by conversion rate for the funnel
  const topProducts = data
    .filter(item => item.views !== null) // Only products with view data
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 5);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 400,
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
    },
    colors: ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 2,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter: (val: number) => {
        return val.toFixed(1) + '%';
      },
      style: {
        fontSize: '11px',
        fontWeight: 600,
        colors: ['#ffffff'],
      },
      offsetX: 5,
    },
    xaxis: {
      categories: topProducts.map(item => item.productName),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
        formatter: (value) => {
          return value + '%';
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
        maxWidth: 120,
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const product = topProducts[dataPointIndex];
        return `
          <div class="p-4 bg-white border border-slate-200 rounded-lg shadow-xl min-w-[280px]">
            <div class="font-bold text-slate-800 mb-3 text-base">
              ${product.productName}
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span className="text-slate-600 flex items-center gap-1">
                  <Eye className="h-3 w-3" /> Views:
                </span>
                <span className="font-semibold text-slate-800">${product.views || 'N/A'}</span>
              </div>
              <div class="flex justify-between items-center">
                <span className="text-slate-600 flex items-center gap-1">
                  <ShoppingCart className="h-3 w-3" /> Cart Additions:
                </span>
                <span className="font-semibold text-slate-800">${product.cartAdditions}</span>
              </div>
              <div class="flex justify-between items-center">
                <span className="text-slate-600">Purchases:</span>
                <span className="font-semibold text-emerald-700">${product.purchases}</span>
              </div>
              <div class="pt-2 mt-2 border-t border-slate-100 space-y-1">
                <div class="flex justify-between items-center">
                  <span className="text-slate-600">Conversion Rate:</span>
                  <span className="font-semibold text-emerald-600">${product.conversionRate.toFixed(1)}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span className="text-slate-600">Abandonment Rate:</span>
                  <span className="font-semibold text-red-600">${product.abandonmentRate.toFixed(1)}%</span>
                </div>
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
    },
    legend: {
      show: false,
    },
  };

  const series = [{
    name: 'Conversion Rate',
    data: topProducts.map(item => item.conversionRate),
  }];

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Funnel className="h-5 w-5 text-slate-600" />
          Purchase Funnel Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg pt-4">
        <div className="h-[450px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}