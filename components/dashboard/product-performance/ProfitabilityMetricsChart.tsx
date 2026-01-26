'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { ProductProfitability } from '@/types/dashboard.types';
import { useMemo } from 'react';

interface ProfitabilityMetricsTableProps {
  data: ProductProfitability[];
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

const formatShortCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

// Define colors for the segments
const COST_COLOR = '#ef4444'; // Red for cost
const PROFIT_COLOR = '#10b981'; // Green for profit

// Custom tooltip component for detailed breakdown
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const costPercentage = data.revenue > 0 ? ((data.costOfGoods / data.revenue) * 100).toFixed(1) : 0;
  const profitPercentage = data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-lg">
      <div className="font-semibold text-slate-800 mb-2">{label}</div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COST_COLOR }}
            />
            <span className="text-sm text-slate-600">Cost of Goods</span>
          </div>
          <div className="text-right">
            <div className="font-medium text-slate-800">{formatCurrency(data.costOfGoods)}</div>
            <div className="text-xs text-slate-500">({costPercentage}%)</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: PROFIT_COLOR }}
            />
            <span className="text-sm text-slate-600">Profit</span>
          </div>
          <div className="text-right">
            <div className="font-medium text-slate-800">{formatCurrency(data.profit)}</div>
            <div className="text-xs text-slate-500">({profitPercentage}%)</div>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Total Revenue</span>
            <span className="font-bold text-slate-800">{formatCurrency(data.revenue)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-slate-600">Profit Margin</span>
            <span className="font-medium text-green-600">{data.profitMargin.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfitabilityMetricsChart({ data, isLoading }: ProfitabilityMetricsTableProps) {
  // Prepare chart data for stacked bar chart
  const chartData = useMemo(() => {
    if (isLoading || data.length === 0) return [];
    
    // Sort by revenue (highest first) for better visualization
    const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);
    
    return sortedData.map((product, index) => ({
      productName: product.productName,
      revenue: product.revenue,
      profit: product.profit,
      costOfGoods: product.costOfGoods,
      profitMargin: product.profitMargin
    }));
  }, [data, isLoading]);

  // Calculate overall financial metrics
  const financialMetrics = useMemo(() => {
    if (isLoading || data.length === 0) return null;
    
    const totalRevenue = data.reduce((sum, product) => sum + product.revenue, 0);
    const totalProfit = data.reduce((sum, product) => sum + product.profit, 0);
    const totalCostOfGoods = data.reduce((sum, product) => sum + product.costOfGoods, 0);
    const overallProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const avgProfitMargin = data.reduce((sum, product) => sum + product.profitMargin, 0) / data.length;
    const highRevenueLowProfitProducts = data.filter(p => p.revenue > totalRevenue * 0.1 && p.profitMargin < avgProfitMargin);
    
    return {
      totalRevenue,
      totalProfit,
      totalCostOfGoods,
      overallProfitMargin,
      avgProfitMargin,
      highRevenueLowProfitProducts
    };
  }, [data, isLoading]);

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value, dataKey } = props;
    
    // For cost of goods (very small values), show label outside if segment is too small
    if (dataKey === 'costOfGoods' && height < 30) {
      return (
        <text
          x={x + width / 2}
          y={y - 5}
          fill="#ef4444"
          textAnchor="middle"
          dominantBaseline="text-before-edge"
          fontSize={10}
          fontWeight={600}
        >
          {formatShortCurrency(value)}
        </text>
      );
    }
    
    // Only show label inside if the bar segment is tall enough
    if (height < 40) return null;
    
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight={600}
      >
        {formatShortCurrency(value)}
      </text>
    );
  };

  const renderTotalLabel = (props: any) => {
    const { x, y, width, height, index } = props;
    const chartDataItem = chartData[index];
    const total = chartDataItem.revenue;
    
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#1f2937"
        textAnchor="middle"
        dominantBaseline="text-before-edge"
        fontSize={13}
        fontWeight={700}
      >
        {formatShortCurrency(total)}
      </text>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <DollarSign className="h-5 w-5 text-slate-600" />
            Revenue vs Profit Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="space-y-6">
            {/* Loading skeleton for chart */}
            <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Loading skeleton for summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white/60 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <DollarSign className="h-5 w-5 text-slate-600" />
            Revenue vs Profit Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="text-center py-8 text-slate-500">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No profitability data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="bg-white rounded-t-lg border-b border-slate-200">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <DollarSign className="h-5 w-5 text-slate-600" />
          Revenue Breakdown: Cost vs Profit
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white rounded-b-lg p-6">
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: COST_COLOR }}
              />
              <span className="text-sm text-slate-700">Cost of Goods</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: PROFIT_COLOR }}
              />
              <span className="text-sm text-slate-700">Profit</span>
            </div>
          </div>

          {/* Vertical Stacked Bar Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
                width={1200}
                height={500}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={true} />
                <XAxis 
                  type="category"
                  dataKey="productName" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  type="number"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatShortCurrency(value)}
                  domain={[0, 'dataMax']}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar 
                  dataKey="costOfGoods" 
                  stackId="a"
                  fill={COST_COLOR}
                  radius={[0, 0, 0, 0]}
                >
                  <LabelList dataKey="costOfGoods" content={renderCustomizedLabel} />
                </Bar>
                <Bar 
                  dataKey="profit" 
                  stackId="a"
                  fill={PROFIT_COLOR}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey="profit" content={renderCustomizedLabel} />
                  <LabelList position="top" content={renderTotalLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Summary Cards */}
          {financialMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="text-sm text-slate-600 mb-1">Total Revenue</div>
                <div className="text-lg font-bold text-slate-800">
                  {formatCurrency(financialMetrics.totalRevenue)}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Across {data.length} products
                </div>
              </div>

              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="text-sm text-red-700 mb-1">Total Cost of Goods</div>
                <div className="text-lg font-bold text-red-800">
                  {formatCurrency(financialMetrics.totalCostOfGoods)}
                </div>
                <div className="text-xs text-red-600 mt-1">
                  {((financialMetrics.totalCostOfGoods / financialMetrics.totalRevenue) * 100).toFixed(1)}% of revenue
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="text-sm text-green-700 mb-1">Total Profit</div>
                <div className="text-lg font-bold text-green-800">
                  {formatCurrency(financialMetrics.totalProfit)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {financialMetrics.overallProfitMargin.toFixed(1)}% margin
                </div>
              </div>

              {/* <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="text-sm text-slate-600 mb-1">High Rev/Low Profit</div>
                <div className="text-lg font-bold text-slate-800">
                  {financialMetrics.highRevenueLowProfitProducts.length}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Products to optimize
                </div>
              </div> */}
            </div>
          )}

          
        </div>
      </CardContent>
    </Card>
  );
}
