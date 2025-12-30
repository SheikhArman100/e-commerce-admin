'use client';

import { Plus, Package } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';
import CategoryFilter from '@/components/filters/CategoryFilter';
import ProductsTable from './ProductsTable';

const activeStatusFilters = [
  { value: 'true', label: 'Active', color: '#10b981' },
  { value: 'false', label: 'Inactive', color: '#6b7280' },
];

const stockFilters = [
  { value: 'true', label: 'In Stock', color: '#10b981' },
  { value: 'false', label: 'Out of Stock', color: '#ef4444' },
];

export default function ProductsPage() {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Product Management
          </h1>
          <p className="text-muted-foreground">Manage Products, Variants, and Inventory</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/products/create-product">
            <Button size="md">
              <Plus className="w-4 h-4 mr-1" />
              Add New Product
            </Button>
          </Link>
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
                  placeholder="Search products by title"
                />
                <CategoryFilter placeholder="Filter by category" />
                <StatusFilter
                  filters={activeStatusFilters}
                  paramName="isActive"
                  placeholder="Filter by status"
                />
                <StatusFilter
                  filters={stockFilters}
                  paramName="inStock"
                  placeholder="Filter by stock"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <ProductsTable />
        </CardContent>
      </Card>
    </div>
  );
}
