'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Package } from 'lucide-react';
import { CategoryProductAnalysis } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CategoryAnalysisChartProps {
  data: CategoryProductAnalysis[];
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

export default function CategoryAnalysisChart({ data, isLoading }: CategoryAnalysisChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <PieChart className="h-5 w-5 text-slate-600" />
            Category Performance Overview
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

  // Prepare data for pie chart
  const chartData = data.map((category, index) => ({
    name: category.categoryName,
    value: category.totalRevenue,
    products: category.totalProducts,
    topProduct: category.topProduct,
    averageRevenue: category.averageRevenue,
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'pie',
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
    colors: ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'],
    labels: chartData.map(item => item.name),
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontWeight: 500,
      markers: {
        size: 8,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      y: {
        formatter: (value: number) => {
          return formatCurrency(value);
        },
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const category = chartData[dataPointIndex];
        return `
          <div class="p-4 bg-white border border-slate-200 rounded-lg shadow-xl min-w-[280px]">
            <div class="font-bold text-slate-800 mb-3 text-base">
              ${category.name}
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span className="text-slate-600">Total Revenue:</span>
                <span className="font-semibold text-emerald-700">${formatCurrency(category.value)}</span>
              </div>
              <div class="flex justify-between items-center">
                <span className="text-slate-600">Total Products:</span>
                <span className="font-semibold text-slate-800">${formatNumber(category.products)}</span>
              </div>
              <div class="flex justify-between items-center">
                <span className="text-slate-600">Avg Revenue/Product:</span>
                <span className="font-semibold text-blue-700">${formatCurrency(category.averageRevenue)}</span>
              </div>
              <div class="pt-2 mt-2 border-t border-slate-100">
                <div class="text-sm text-slate-600 mb-1">Top Product:</div>
                <div class="font-medium text-slate-800">${category.topProduct.name}</div>
                <div class="text-sm text-emerald-600">${formatCurrency(category.topProduct.revenue)}</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        return val.toFixed(1) + '%';
      },
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#ffffff'],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.6,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 350,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
      },
    ],
  };

  const series = chartData.map(item => item.value);

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <PieChart className="h-5 w-5 text-slate-600" />
          Category Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg pt-4">
        <div className="h-[450px]">
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}