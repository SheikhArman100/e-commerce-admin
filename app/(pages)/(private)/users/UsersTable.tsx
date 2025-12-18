'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronUp, ChevronDown, Eye } from 'lucide-react';

import ProfileImage from '@/components/ProfileImage';
import { formatDateTime } from '@/lib/helpers';
import { ScreenLoader } from '@/components/screen-loader';
import { useUsers } from '@/hooks/useUsers';
import { IUser } from '@/types/user.types';
import PaginationTable from '@/components/PaginationTable';

export default function UsersTable() {
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchTerm = searchParams.get('searchTerm') || '';
  const isVerified = searchParams.get('isVerified') || '';
  const role = searchParams.get('role') || '';

  // Build filters object matching API expectations
  const filters = {
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(isVerified && isVerified !== 'all' && { isVerified }),
    ...(role && role !== 'all' && { role }),
    sortBy,
    sortOrder,
  };

  const { data: usersData, isLoading, error } = useUsers(filters);

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
    </TableRow>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-400 ';
      case 'INACTIVE':
        return 'bg-gray-400 ';
      case 'SUSPENDED':
      default:
        return 'bg-red-400 ';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'user':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    if (newLimit !== 10) {
      params.set('limit', newLimit.toString());
    } else {
      params.delete('limit');
    }
    // Reset to page 1 when changing limit
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (error) {
    console.error('Users fetch error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Users
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred while fetching users.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const users: IUser[] = usersData?.data || [];
  const totalCount = usersData?.meta?.count || 0;

  return (
    <div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[200px]"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center justify-between">
                  <span>Name</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'name' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'name' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[250px]"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center justify-between">
                  <span>Email</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'email' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'email' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('phoneNumber')}
              >
                <div className="flex items-center justify-between">
                  <span>Phone</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'phoneNumber' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'phoneNumber' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center justify-between">
                  <span>Role</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'role' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'role' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[150px]">
                <span>Verification</span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[200px]"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Created Date</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: limit }, (_, index) => renderSkeletonRow(index))
              : users.length > 0
              ? users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <ProfileImage image={null} />
                        </Avatar>
                        <Link
                          href={`/users/${user.id}`}
                          className="font-medium hover:text-blue-800 hover:underline"
                        >
                          {user.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleColor(user.role)} rounded-full capitalize`}>
                        {user.role.split('_').join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </TableCell>
                    <TableCell className="">
                      {formatDateTime(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/users/${user.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground h-80">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {users.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            Showing
            <input
              type="number"
              defaultValue={Math.min(limit, totalCount)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = parseInt((e.target as HTMLInputElement).value) || 10;
                  handleLimitChange(value);
                }
              }}
              className="w-16 px-2 py-1 border rounded text-center"
              min="1"
              max="100"
            />
            of {totalCount} Records
          </div>
          <PaginationTable count={totalCount} limit={limit} />
        </div>
      )}
    </div>
  );
}
