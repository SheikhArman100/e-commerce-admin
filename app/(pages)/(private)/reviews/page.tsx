'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import ReviewsTable from './ReviewsTable';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import ProductFilter from '@/components/filters/ProductFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

const ratingFilters = [
  { value: '1', label: '1 Star', color: '#ef4444' },
  { value: '2', label: '2 Stars', color: '#f97316' },
  { value: '3', label: '3 Stars', color: '#eab308' },
  { value: '4', label: '4 Stars', color: '#22c55e' },
  { value: '5', label: '5 Stars', color: '#10b981' },
];

const visibilityFilters = [
  { value: 'true', label: 'Hidden', color: '#6b7280' },
  { value: 'false', label: 'Visible', color: '#10b981' },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Review Management
          </h1>
          <p className="text-muted-foreground">Manage customer reviews and ratings</p>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <SearchFilter
                  paramName="searchTerm"
                  placeholder="Search reviews by comment"
                />
                <ProductFilter
                  paramName="productId"
                  placeholder="Filter by product"
                />
                <StatusFilter
                  filters={ratingFilters}
                  paramName="rating"
                  placeholder="Filter by rating"
                />
                <StatusFilter
                  filters={visibilityFilters}
                  paramName="isHidden"
                  placeholder="Filter by visibility"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <ReviewsTable />
        </CardContent>
      </Card>
    </div>
  );
}
