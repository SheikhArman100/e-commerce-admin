'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import WishlistsTable from './WishlistsTable';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import ProductFilter from '@/components/filters/ProductFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

// const userFilters = [
//   { value: 'admin', label: 'Admin Users', color: '#ef4444' },
//   { value: 'user', label: 'Regular Users', color: '#10b981' },
// ];

export default function WishlistsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Wishlist Management
          </h1>
          <p className="text-muted-foreground">Manage customer wishlists and saved products</p>
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
                  placeholder="Search wishlists by product"
                />
                <ProductFilter
                  paramName="productId"
                  placeholder="Filter by product"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <WishlistsTable />
        </CardContent>
      </Card>
    </div>
  );
}
