'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import PaymentsTable from './PaymentsTable';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import AmountRangeFilter from '@/components/filters/AmountRangeFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

const paymentStatusFilters = [
  { value: 'PENDING', label: 'Pending', color: '#eab308' },
  { value: 'PAID', label: 'Paid', color: '#10b981' },
  { value: 'FAILED', label: 'Failed', color: '#ef4444' },
  { value: 'CANCELLED', label: 'Cancelled', color: '#6b7280' },
  { value: 'REFUNDED', label: 'Refunded', color: '#3b82f6' },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Payment Management
          </h1>
          <p className="text-muted-foreground">Monitor and manage customer transactions and gateway logs</p>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1">
                <SearchFilter
                  paramName="searchTerm"
                  placeholder="Search Transaction / Bank ID"
                />
                <SearchFilter
                  paramName="orderId"
                  placeholder="Search by Order ID"
                />
                <StatusFilter
                  filters={paymentStatusFilters}
                  paramName="paymentStatus"
                  placeholder="Filter by status"
                />
                <AmountRangeFilter
                  paramNameMin="minAmount"
                  paramNameMax="maxAmount"
                  placeholder="Filter by amount"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <PaymentsTable />
        </CardContent>
      </Card>
    </div>
  );
}
