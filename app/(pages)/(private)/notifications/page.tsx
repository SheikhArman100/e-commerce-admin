'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import NotificationsTable from './NotificationsTable';
import SearchFilter from '@/components/filters/SearchFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Realtime alerts for orders, payments, stock and reviews
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <SearchFilter
                paramName="searchTerm"
                placeholder="Search notifications by title or body"
              />
              <ClearAllFiltersButton />
            </div>
          </div>

          <NotificationsTable />
        </CardContent>
      </Card>
    </div>
  );
}
