'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import OrdersTable from './OrdersTable';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import DateFilter from '@/components/filters/DateFilter';
import AmountRangeFilter from '@/components/filters/AmountRangeFilter';
import ProductFilter from '@/components/filters/ProductFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';
import { OrderStatus } from '@/types/order.types';

const orderStatusFilters = [
  { value: OrderStatus.PENDING, label: 'Pending', color: '#eab308' },
  { value: OrderStatus.SHIPPED, label: 'Shipped', color: '#3b82f6' },
  { value: OrderStatus.DELIVERED, label: 'Delivered', color: '#10b981' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled', color: '#ef4444' },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Order Management
          </h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1">
                <SearchFilter
                  paramName="searchTerm"
                  placeholder="Search orders by customer"
                />
                <StatusFilter
                  filters={orderStatusFilters}
                  paramName="status"
                  placeholder="Filter by status"
                />
                <DateFilter
                  paramNameFrom="startDate"
                  paramNameTo="endDate"
                  placeholder="Filter by order date"
                />
                <AmountRangeFilter
                  paramNameMin="minAmount"
                  paramNameMax="maxAmount"
                  placeholder="Filter by amount"
                />
                <ProductFilter
                  paramName="productId"
                  placeholder="Filter by product"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <OrdersTable />
        </CardContent>
      </Card>
    </div>
  );
}
