'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Calendar, MapPin, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { CustomerBehavior as CustomerBehaviorType } from '@/types/dashboard.types';
import CardInfo from '@/components/dashboard/CardInfo';

interface CustomerBehaviorChartProps {
  data: CustomerBehaviorType | undefined;
  isLoading: boolean;
}

export default function CustomerBehaviorChart({ data, isLoading }: CustomerBehaviorChartProps) {
  const behaviorData = data;

  if (!behaviorData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className=" w-full flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Avg Time Between Purchases</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Average days between consecutive orders per customer." />
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-slate-800">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${behaviorData.averageTimeBetweenPurchases} days`}
            </div>
            <div className="text-xs text-slate-600 mt-1">Average customer purchase interval</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className=" w-full flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Preferred Purchase Day</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Most popular day of week for placing orders." />
                <Calendar className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-slate-800">
              {isLoading ? <Skeleton className="h-8 w-24" /> : behaviorData.preferredPurchaseDay}
            </div>
            <div className="text-xs text-slate-600 mt-1">Most popular shopping day</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className=" w-full flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Preferred Purchase Hour</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Hour of day when most orders occur." />
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-slate-800">
              {isLoading ? <Skeleton className="h-8 w-12" /> : `${behaviorData.preferredPurchaseHour}:00`}
            </div>
            <div className="text-xs text-slate-600 mt-1">Peak shopping hour</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className=" w-full flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Average Cart Size</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Average number of items per order." />
                <ShoppingCart className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-slate-800">
              {isLoading ? <Skeleton className="h-8 w-12" /> : behaviorData.averageCartSize}
            </div>
            <div className="text-xs text-slate-600 mt-1">Average items per order</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className=" w-full flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Order Frequency</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Average number of orders placed per customer per year." />
                <TrendingUp className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-slate-800">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${behaviorData.averageOrderFrequency}x/year`}
            </div>
            <div className="text-xs text-slate-600 mt-1">Average orders per customer per year</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className=" w-full flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Cart Abandonment Rate</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Share of carts started but never converted to an order." />
                <Package className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className={`text-2xl font-bold ${
              behaviorData.cartAbandonmentRate < 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${Math.abs(behaviorData.cartAbandonmentRate)}%`}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {behaviorData.cartAbandonmentRate < 0 ? 'Cart recovery rate' : 'Cart abandonment rate'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Top Categories
            </CardTitle>
<CardInfo description="Most frequently purchased product categories." />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {behaviorData.topCategories.map((category, index) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <Card>
          <CardHeader>
<CardInfo description="Summary of purchase timing, shopping patterns,and customer loyalty." />
            <CardTitle>Customer Behavior Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Purchase Timing</div>
                    <div className="text-sm text-gray-600">Peak activity on {behaviorData.preferredPurchaseDay}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{behaviorData.preferredPurchaseHour}:00</div>
                    <div className="text-xs text-gray-500">Peak hour</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Shopping Patterns</div>
                    <div className="text-sm text-gray-600">Average {behaviorData.averageCartSize} items per cart</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{behaviorData.averageTimeBetweenPurchases} days</div>
                    <div className="text-xs text-gray-500">Between purchases</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Customer Loyalty</div>
                    <div className="text-sm text-gray-600">{behaviorData.averageOrderFrequency} orders/year</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      behaviorData.cartAbandonmentRate < 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(behaviorData.cartAbandonmentRate)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {behaviorData.cartAbandonmentRate < 0 ? 'Recovery rate' : 'Abandonment rate'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      {/* <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle>Behavior Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{behaviorData.preferredPurchaseDay}</div>
                <div className="text-sm text-gray-600">Peak Shopping Day</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{behaviorData.preferredPurchaseHour}:00</div>
                <div className="text-sm text-gray-600">Peak Shopping Hour</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{behaviorData.averageCartSize}</div>
                <div className="text-sm text-gray-600">Avg Items per Order</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{behaviorData.averageTimeBetweenPurchases} days</div>
                <div className="text-sm text-gray-600">Avg Time Between Purchases</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
