'use client';

import { Plus, Users as UsersIcon } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UsersTable from './UsersTable';
import Link from 'next/link';
import SearchFilter from '@/components/filters/SearchFilter';
import StatusFilter from '@/components/filters/StatusFilter';
import RoleFilter from '@/components/filters/RoleFilter';
import ClearAllFiltersButton from '@/components/filters/ClearAllFiltersButton';

const verificationFilters = [
  { value: 'true', label: 'Verified', color: '#10b981' },
  { value: 'false', label: 'Unverified', color: '#f59e0b' },
];

export default function UsersPage() {
  // Get users data for potential stats or loading states
  const { data: usersData, isLoading } = useUsers({
    page: 1,
    limit: 10
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground">Manage Users and their Access</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/users/create-user">
            <Button size="md">
              <Plus className="w-4 h-4 mr-1" />
              Add New User
            </Button>
          </Link>
        </div>
      </div>

      

      <Card>
        {/* <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader> */}
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <SearchFilter
                  paramName="searchTerm"
                  placeholder="Search users by name"
                />
                <StatusFilter
                  filters={verificationFilters}
                  paramName="isVerified"
                  placeholder="Filter by verification"
                />
                <RoleFilter
                  paramName="role"
                  placeholder="Filter by role"
                />
              </div>
              <ClearAllFiltersButton />
            </div>
          </div>

          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
}
