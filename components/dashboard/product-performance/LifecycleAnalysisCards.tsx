'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import { ProductLifecycle } from '@/types/dashboard.types';

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

export default function LifecycleAnalysisCards({ data, isLoading }: LifecycleAnalysisCardsProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Clock className="h-5 w-5 text-slate-600" />
            Product Maturity Stages
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white/60 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Clock className="h-5 w-5 text-slate-600" />
          Product Maturity Stages
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((product) => (
            <div
              key={product.productId}
              className="p-4 border border-slate-200 rounded-lg bg-white/60 hover:bg-slate-100/80 transition-colors"
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
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No lifecycle data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}