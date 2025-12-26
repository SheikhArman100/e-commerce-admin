'use client';

import { Plus, Palette } from 'lucide-react';
import { useFlavors } from '@/hooks/useFlavors';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FlavorsTable from './FlavorsTable';  
import Link from 'next/link';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

const activeStatusFilters = [
  { value: 'true', label: 'Active', color: '#10b981' },
  { value: 'false', label: 'Inactive', color: '#6b7280' },
];

export default function FlavorsPage() {
  // Get flavors data for potential stats or loading states
  const { data: flavorsData, isLoading } = useFlavors({
    page: 1,
    limit: 10
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Flavor Management
          </h1>
          <p className="text-muted-foreground">Manage product flavors and color variations</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/flavors/create-flavor">
            <Button size="md">
              <Plus className="w-4 h-4 mr-1" />
              Add New Flavor
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
                  placeholder="Search flavors by name"
                />
                <StatusFilter
                  filters={activeStatusFilters}
                  paramName="isActive"
                  placeholder="Filter by status"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <FlavorsTable />
        </CardContent>
      </Card>
    </div>
  );
}
