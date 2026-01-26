'use client';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ProductConversion } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ConversionRatesChartProps {
  data: ProductConversion[];
  isLoading?: boolean;
}

// Helper function to calculate quartiles and box plot statistics
const calculateBoxPlotStats = (data: ProductConversion[]) => {
  const rates = data.map((p) => p.conversionRate).sort((a, b) => a - b);
  const n = rates.length;

  // Calculate quartiles
  const q1Index = Math.floor(n * 0.25);
  const q2Index = Math.floor(n * 0.5);
  const q3Index = Math.floor(n * 0.75);

  const min = rates[0];
  const q1 = rates[q1Index];
  const median = rates[q2Index];
  const q3 = rates[q3Index];
  const max = rates[n - 1];

  // Calculate IQR for outliers
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return {
    min,
    q1,
    median,
    q3,
    max,
    iqr,
    lowerBound,
    upperBound,
    outliers: rates.filter((r) => r < lowerBound || r > upperBound),
  };
};

// All Products Box Plot Chart
const AllProductsBoxPlot = ({ data }: { data: ProductConversion[] }) => {
  // Sort products by conversion rate
  const sortedData = [...data].sort((a, b) => b.conversionRate - a.conversionRate);
  
  // Calculate percentile positions for each product based on their conversion rate
  const calculateProductStats = (product: ProductConversion) => {
    const rate = product.conversionRate;
    // Create a range around each product's conversion rate
    const range = Math.max(100, rate * 0.1);
    const min = Math.max(0, rate - range);
    const q1 = min + range * 0.25;
    const median = rate;
    const q3 = rate + range * 0.25;
    const max = rate + range;
    
    return [min, q1, median, q3, max];
  };
  
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'boxPlot',
      height: 450,
      fontFamily: 'inherit',
      background: 'transparent',
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
    },
    colors: ['#3b82f6'],
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#3b82f6',
          lower: '#60a5fa',
        },
      },
    },
    xaxis: {
      categories: sortedData.map((p) => p.productName),
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#475569',
        },
        rotate: -45,
        rotateAlways: true,
      },
      axisBorder: {
        color: '#e2e8f0',
      },
      axisTicks: {
        color: '#e2e8f0',
      },
    },
    yaxis: {
      title: {
        text: 'Conversion Rate (%)',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#475569',
        },
      },
      labels: {
        style: {
          fontSize: '13px',
          colors: '#64748b',
        },
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 3,
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const product = sortedData[dataPointIndex];
        
        return `
          <div class="bg-white p-3 rounded-lg shadow-xl border border-slate-200 min-w-[220px]">
            <div class="font-bold text-slate-800 mb-2">${product.productName}</div>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-600">Conversion Rate:</span>
                <span class="font-semibold text-blue-600">${product.conversionRate.toFixed(1)}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Purchases:</span>
                <span class="font-semibold">${product.purchases}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Cart Additions:</span>
                <span class="font-semibold">${product.cartAdditions}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Abandonment:</span>
                <span class="font-semibold text-red-600">${product.abandonmentRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        `;
      },
    },
  };

  const series = [
    {
      name: 'Conversion Rate Distribution',
      data: sortedData.map((product) => ({
        x: product.productName,
        y: calculateProductStats(product),
      })),
    },
  ];

  return <ReactApexChart options={options} series={series} type="boxPlot" height="100%" />;
};

// Individual Product Conversion Card
const ProductConversionCard = ({ product, allData }: { product: ProductConversion; allData: ProductConversion[] }) => {
  const allRates = allData.map((p) => p.conversionRate);
  const maxRate = Math.max(...allRates);
  const avgRate = (allRates.reduce((a, b) => a + b, 0) / allRates.length);
  
  const rank = [...allData]
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .findIndex((p) => p.productId === product.productId) + 1;

  const percentageOfMax = ((product.conversionRate / maxRate) * 100).toFixed(1);
  const isAboveAverage = product.conversionRate > avgRate;

  return (
    <Card className="overflow-hidden border-slate-200 hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-slate-800 truncate flex-1">
            {product.productName}
          </CardTitle>
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
            <span className="text-xs font-bold text-blue-700">#{rank}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main Conversion Rate */}
          <div className="text-center py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-xs text-slate-600 font-medium mb-1">Conversion Rate</div>
            <div className="text-3xl font-bold text-blue-700">{product.conversionRate.toFixed(1)}%</div>
            {isAboveAverage && (
              <div className="text-xs text-emerald-600 font-semibold mt-1">↑ Above Average</div>
            )}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-600">vs Highest</span>
              <span className="text-xs font-semibold text-slate-700">{percentageOfMax}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${percentageOfMax}%` }}
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-amber-50 rounded border border-amber-100">
              <div className="text-xs text-amber-600 font-medium">Cart Additions</div>
              <div className="text-xl font-bold text-amber-800">{product.cartAdditions}</div>
            </div>
            <div className="p-2 bg-green-50 rounded border border-green-100">
              <div className="text-xs text-green-600 font-medium">Purchases</div>
              <div className="text-xl font-bold text-green-800">{product.purchases}</div>
            </div>
          </div>

          {/* Abandonment Rate */}
          <div className="p-2 bg-red-50 rounded border border-red-100">
            <div className="text-xs text-red-600 font-medium">Abandonment Rate</div>
            <div className="text-lg font-bold text-red-700">{product.abandonmentRate.toFixed(1)}%</div>
          </div>

          {/* Conversion Formula */}
          <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
            <div className="font-semibold text-slate-700 mb-1">Calculation</div>
            <div>{product.purchases} purchases ÷ {product.cartAdditions} cart additions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Box Plot Chart - Distribution of conversion rates
const ConversionRateBoxPlot = ({ data }: { data: ProductConversion[] }) => {
  const stats = calculateBoxPlotStats(data);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'boxPlot',
      height: 350,
      fontFamily: 'inherit',
      background: 'transparent',
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
    },
    colors: ['#3b82f6'],
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#3b82f6',
          lower: '#60a5fa',
        },
      },
    },
    xaxis: {
      categories: ['Conversion Rates'],
      labels: {
        style: {
          fontSize: '13px',
          fontWeight: 500,
          colors: '#475569',
        },
      },
      axisBorder: {
        color: '#e2e8f0',
      },
      axisTicks: {
        color: '#e2e8f0',
      },
    },
    yaxis: {
      title: {
        text: 'Conversion Rate (%)',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#475569',
        },
      },
      labels: {
        style: {
          fontSize: '13px',
          colors: '#64748b',
        },
      },
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 3,
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
    },
  };

  const series = [
    {
      name: 'Conversion Rate Distribution',
      data: [
        {
          x: 'Conversion Rates',
          y: [stats.min, stats.q1, stats.median, stats.q3, stats.max],
        },
      ],
    },
  ];

  return <ReactApexChart options={options} series={series} type="boxPlot" height="100%" />;
};

export default function ConversionRatesChart({ data, isLoading }: ConversionRatesChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <BarChart3 className="h-5 w-5 text-slate-600" />
            Product Conversion Rates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-200/70 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <BarChart3 className="h-5 w-5 text-slate-600" />
            Product Conversion Rates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center text-slate-500">
          <BarChart3 className="h-14 w-14 mx-auto mb-4 opacity-60" />
          <p className="text-lg">No conversion data available</p>
        </CardContent>
      </Card>
    );
  }

  const stats = calculateBoxPlotStats(data);
  const allRates = data.map((p) => p.conversionRate);
  const avgRate = (allRates.reduce((a, b) => a + b, 0) / allRates.length).toFixed(1);
  const highestProduct = data.reduce((prev, current) =>
    current.conversionRate > prev.conversionRate ? current : prev
  );
  const lowestProduct = data.reduce((prev, current) =>
    current.conversionRate < prev.conversionRate ? current : prev
  );

  // Sort by conversion rate
  const sortedData = [...data].sort((a, b) => b.conversionRate - a.conversionRate);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-white border-b">
        <CardTitle className="flex items-center gap-2.5">
          <BarChart3 className="h-5 w-5 text-slate-600" />
          Product Conversion Rates
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div>
          {/* <h3 className="text-sm font-semibold text-slate-700 mb-4">Product-by-Product Comparison (Box Plot)</h3> */}
          <div className="h-[500px] w-full ">
            <AllProductsBoxPlot data={data} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}