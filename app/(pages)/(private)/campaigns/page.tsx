'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CampaignsTable from './CampaignsTable';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import DateFilter from '@/components/filters/DateFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

const campaignStatusFilters = [
  { value: 'true', label: 'Active', color: '#10b981' },
  { value: 'false', label: 'Inactive', color: '#ef4444' },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Campaign Management
          </h1>
          <p className="text-muted-foreground">Create and manage seasonal promotions and product discounts</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/create-campaign">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1">
                <SearchFilter
                  paramName="searchTerm"
                  placeholder="Search by title, slug..."
                />
                <StatusFilter
                  filters={campaignStatusFilters}
                  paramName="isActive"
                  placeholder="Filter by status"
                />
                <DateFilter
                  paramNameFrom="startDate"
                  paramNameTo="endDate"
                  placeholder="Filter by duration"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <CampaignsTable />
        </CardContent>
      </Card>
    </div>
  );
}
