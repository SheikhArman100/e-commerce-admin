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
import { useCategories } from '@/hooks/useCategories';
import { ICategory } from '@/types/category.types';
import PaginationTable from '@/components/PaginationTable';

export default function CategoriesTable() {
  const [sortBy, setSortBy] = useState<string>('displayOrder');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentLimit, setCurrentLimit] = useState<number>(10);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchTerm = searchParams.get('searchTerm') || '';
  const isActive = searchParams.get('isActive') || '';

  // Update currentLimit when limit changes
  React.useEffect(() => {
    setCurrentLimit(limit);
  }, [limit]);

  // Build filters object matching API expectations
  const filters = {
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(isActive && isActive !== 'all' && { isActive }),
    sortBy,
    sortOrder,
  };

  const { data: categoriesData, isLoading, error } = useCategories(filters);

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
    console.error('Categories fetch error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Categories
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred while fetching categories.
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

  const categories: ICategory[] = categoriesData?.data || [];
  const totalCount = categoriesData?.meta?.count || 0;

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
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[200px]"
                onClick={() => handleSort('slug')}
              >
                <div className="flex items-center justify-between">
                  <span>Slug</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'slug' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'slug' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('displayOrder')}
              >
                <div className="flex items-center justify-between">
                  <span>Order</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'displayOrder' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'displayOrder' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[150px]">
                <span>Status</span>
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
              : categories.length > 0
              ? categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <ProfileImage image={category.image || null} />
                        </Avatar>
                        <Link
                          href={`/categories/${category.id}`}
                          className="font-medium hover:text-blue-800 hover:underline"
                        >
                          {category.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.displayOrder}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(category.isActive ? 'ACTIVE' : 'INACTIVE')}`}></span>
                        <span className="text-sm text-muted-foreground">{category.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="">
                      {formatDateTime(category.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/categories/${category.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground h-80">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            Showing
            <input
              type="number"
              value={totalCount && (currentLimit > totalCount) ? totalCount : currentLimit}
              onChange={(e) => setCurrentLimit(parseInt(e.target.value) || 10)}
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
         <div>
 <PaginationTable count={totalCount} limit={limit} />
</div>
        </div>
      )}
    </div>
  );
}
