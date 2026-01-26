'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, BarChart3, AlertTriangle, Target, TrendingDown } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ProductLifecycle } from '@/types/dashboard.types';
import { useMemo } from 'react';

interface LifecycleAnalysisCardsProps {
  data: ProductLifecycle[];
  isLoading?: boolean;
}

const getLifecycleColor = (stage: string) => {
  switch (stage) {
    case 'new':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'growing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'mature':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'declining':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getLifecycleIcon = (stage: string) => {
  switch (stage) {
    case 'new':
      return <TrendingUp className="h-4 w-4" />;
    case 'growing':
      return <TrendingUp className="h-4 w-4" />;
    case 'mature':
      return <BarChart3 className="h-4 w-4" />;
    case 'declining':
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// Custom tooltip for lifecycle matrix
const LifecycleTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const quadrant = getQuadrant(data.ageInDays, data.consistencyScore);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-lg">
      <div className="font-semibold text-slate-800 mb-2">{data.productName}</div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Product Age:</span>
          <span className="text-sm font-medium">{data.ageInDays} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Consistency Score:</span>
          <span className="text-sm font-medium">{data.consistencyScore.toFixed(1)}/2</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Lifecycle Stage:</span>
          <Badge className={getLifecycleColor(data.lifecycleStage)}>
            {getLifecycleIcon(data.lifecycleStage)}
            {data.lifecycleStage.charAt(0).toUpperCase() + data.lifecycleStage.slice(1)}
          </Badge>
        </div>
        <div className="border-t border-slate-200 pt-2">
          <div className="text-sm font-semibold text-slate-700">Quadrant:</div>
          <div className="text-sm text-slate-600">{quadrant}</div>
        </div>
      </div>
    </div>
  );
};

// Determine quadrant based on age and consistency
const getQuadrant = (age: number, consistency: number) => {
  // Define thresholds (can be adjusted based on business logic)
  const ageThreshold = 90; // 3 months
  const consistencyThreshold = 1.0; // Mid-point of 0-2 scale

  if (age >= ageThreshold && consistency >= consistencyThreshold) {
    return "Mature & Consistent";
  } else if (age < ageThreshold && consistency >= consistencyThreshold) {
    return "New & Promising";
  } else if (age >= ageThreshold && consistency < consistencyThreshold) {
    return "Declining";
  } else {
    return "Struggling New Products";
  }
};

// Get quadrant color for scatter plot
const getQuadrantColor = (age: number, consistency: number) => {
  const ageThreshold = 90;
  const consistencyThreshold = 1.0;

  if (age >= ageThreshold && consistency >= consistencyThreshold) {
    return '#8b5cf6'; // Purple for Mature & Consistent
  } else if (age < ageThreshold && consistency >= consistencyThreshold) {
    return '#22c55e'; // Green for New & Promising
  } else if (age >= ageThreshold && consistency < consistencyThreshold) {
    return '#ef4444'; // Red for Declining
  } else {
    return '#f59e0b'; // Orange for Struggling New Products
  }
};

export default function LifecycleAnalysisCards({ data, isLoading }: LifecycleAnalysisCardsProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Target className="h-5 w-5 text-slate-600" />
            Product Lifecycle Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="space-y-6">
            {/* Loading skeleton for chart */}
            <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Loading skeleton for quadrant legend */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
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
            <Target className="h-5 w-5 text-slate-600" />
            Product Lifecycle Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="text-center py-8 text-slate-500">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No lifecycle data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="bg-white rounded-t-lg border-b border-slate-200">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Target className="h-5 w-5 text-slate-600" />
          Product Lifecycle Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white rounded-b-lg p-6">
        <div className="space-y-6">
         

          {/* Lifecycle Matrix Chart */}
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart 
                data={data}
                margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number"
                  dataKey="ageInDays"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Product Age (Days)', position: 'insideBottom', offset: -10, fill: '#6b7280' }}
                  domain={[0, 'dataMax']}
                />
                <YAxis 
                  type="number"
                  dataKey="consistencyScore"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Consistency Score', angle: -90, position: 'insideLeft', offset: 10, fill: '#6b7280' }}
                  domain={[0, 2]}
                  ticks={[0, 0.5, 1, 1.5, 2]}
                />
                <Tooltip 
                  content={<LifecycleTooltip />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Scatter 
                  dataKey="consistencyScore"
                  fill="#8b5cf6"
                  shape="circle"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getQuadrantColor(entry.ageInDays, entry.consistencyScore)} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

           {/* Quadrant Legend */}
          <div className="flex flex-wrap items-center justify-center  gap-4">
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="font-semibold text-slate-700">Mature & Consistent</span>
              </div>
              {/* <p className="text-sm text-slate-600">Established products with stable performance</p> */}
            </div>
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-semibold text-slate-700">New & Promising</span>
              </div>
              {/* <p className="text-sm text-slate-600">Recent products showing strong consistency</p> */}
            </div>
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="font-semibold text-slate-700">Declining</span>
              </div>
              {/* <p className="text-sm text-slate-600">Mature products losing consistency</p> */}
            </div>
            <div className="">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="font-semibold text-slate-700">Struggling New</span>
              </div>
              {/* <p className="text-sm text-slate-600">New products with inconsistent performance</p> */}
            </div>
          </div>

          {/* Product Details Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((product) => (
              <div
                key={product.productId}
                className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium text-slate-800 mb-2 truncate">
                  {product.productName}
                </div>
                <Badge className={`flex items-center gap-1 mb-3 ${getLifecycleColor(product.lifecycleStage)}`}>
                  {getLifecycleIcon(product.lifecycleStage)}
                  {product.lifecycleStage.charAt(0).toUpperCase() + product.lifecycleStage.slice(1)}
                </Badge>
                <div className="space-y-1 text-sm text-slate-600">
                  <div>Age: {product.ageInDays} days</div>
                  <div>Consistency: {product.consistencyScore.toFixed(1)}/2</div>
                  <div className="font-medium text-slate-700">
                    Quadrant: {getQuadrant(product.ageInDays, product.consistencyScore)}
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}

