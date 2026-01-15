'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import CartsTable from './CartsTable';
import SearchFilter from '@/components/filters/SearchFilter';
import ProductFilter from '@/components/filters/ProductFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

export default function CartsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Cart Management
          </h1>
          <p className="text-muted-foreground">Manage customer shopping carts and cart items</p>
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
                  placeholder="Search carts by user's name"
                />
                <ProductFilter
                  paramName="productId"
                  placeholder="Filter by product"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <CartsTable />
        </CardContent>
      </Card>
    </div>
  );
}
