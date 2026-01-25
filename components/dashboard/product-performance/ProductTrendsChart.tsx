'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Package } from 'lucide-react';
import { ProductTrend } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ProductTrendsCardsProps {
  data: ProductTrend[];
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

const getGrowthIcon = (growthRate: number) => {
  if (growthRate > 0) {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  } else if (growthRate < 0) {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return <BarChart3 className="h-4 w-4 text-gray-600" />;
};

export default function ProductTrendsCards({ data, isLoading }: ProductTrendsCardsProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <BarChart3 className="h-5 w-5 text-slate-600" />
            Product Trends & Growth
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

  // Use real data from API - create time series based on current vs previous period
  const months = ['Current', 'Previous'];
  const topProducts = data.slice(0, 5); // Show top 5 products

  const series = topProducts.map((product, index) => {
    const currentRevenue = product.currentPeriod.revenue;
    const previousRevenue = product.previousPeriod.revenue || 0;

    // Create simple comparison data
    const data = [currentRevenue, previousRevenue];

    return {
      name: product.productName,
      data: data,
      growthRate: product.growthRate,
      isHighGrowth: product.growthRate >= 100, // Highlight 100%+ growth
    };
  });

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 400,
      fontFamily: 'inherit',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
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
    colors: series.map((item, index) =>
      item.isHighGrowth ? '#dc2626' : // Red for high growth
      ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'][index] // Normal colors
    ),
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: series.map(item => item.isHighGrowth ? 4 : 2), // Thicker lines for high growth
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.2,
        opacityFrom: series.map(item => item.isHighGrowth ? 0.4 : 0.2), // More opacity for high growth
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
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
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
        formatter: (value) => {
          if (value >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return '$' + (value / 1000).toFixed(1) + 'K';
          }
          return '$' + value.toFixed(0);
        },
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
        top: 20,
        right: 40,
        bottom: 20,
        left: 40,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      fontWeight: 500,
      markers: {
        size: 6,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 4,
      },
      formatter: function(seriesName, opts) {
        const item = series[opts.seriesIndex];
        const trendIcon = item.growthRate > 0 ? '↑' : item.growthRate < 0 ? '↓' : '→';
        const growthText = `${item.growthRate > 0 ? '+' : ''}${item.growthRate.toFixed(1)}%`;
        return `${seriesName} ${trendIcon} ${growthText}`;
      },
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

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <BarChart3 className="h-5 w-5 text-slate-600" />
          Product Trends & Growth
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {series.filter(item => item.isHighGrowth).map((item, index) => (
            <Badge key={index} variant="destructive" className="text-xs">
              🔥 {item.name}: +{item.growthRate.toFixed(1)}%
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg pt-4">
        <div className="h-[450px]">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
