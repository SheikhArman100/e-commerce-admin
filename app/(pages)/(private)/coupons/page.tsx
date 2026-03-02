'use client';

import { Plus, Ticket } from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CouponsTable from './CouponsTable';  
import Link from 'next/link';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

const activeStatusFilters = [
  { value: 'true', label: 'Active', color: '#10b981' },
  { value: 'false', label: 'Inactive', color: '#6b7280' },
];

const discountTypeFilters = [
  { value: 'FIXED', label: 'Fixed Amount', color: '#10b981' },
  { value: 'PERCENTAGE', label: 'Percentage', color: '#8b5cf6' },
];

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Coupon Management
          </h1>
          <p className="text-muted-foreground">Manage discount codes and promotional offers</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/coupons/create-coupon">
            <Button size="md">
              <Plus className="w-4 h-4 mr-1" />
              Add New Coupon
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <SearchFilter
                  paramName="searchTerm"
                  placeholder="Search coupons by code"
                />
                <StatusFilter
                  filters={activeStatusFilters}
                  paramName="isActive"
                  placeholder="Filter by status"
                />
                <StatusFilter
                  filters={discountTypeFilters}
                  paramName="discountType"
                  placeholder="Filter by type"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <CouponsTable />
        </CardContent>
      </Card>
    </div>
  );
}
