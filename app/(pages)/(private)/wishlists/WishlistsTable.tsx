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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, ChevronUp, ChevronDown, Eye, Heart, Trash2 } from 'lucide-react';

import { formatDateTime } from '@/lib/helpers';
import { ScreenLoader } from '@/components/screen-loader';
import { useWishlists } from '@/hooks/useWishlists';
import { IWishlist } from '@/types/wishlist.types';
import PaginationTable from '@/components/PaginationTable';
import DeleteWishlistModal from './DeleteWishlistModal';
import ProfileImage from '@/components/ProfileImage';

export default function WishlistsTable() {
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentLimit, setCurrentLimit] = useState<number>(10);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchTerm = searchParams.get('searchTerm') || '';
  const productId = searchParams.get('productId') || '';
  const userId = searchParams.get('userId') || '';

  // Update currentLimit when limit changes
  React.useEffect(() => {
    setCurrentLimit(limit);
  }, [limit]);

  // Build filters object matching API expectations
  const filters = {
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(productId && { productId }),
    ...(userId && { userId }),
    sortBy,
    sortOrder,
  };

  const { data: wishlistsData, isLoading, error } = useWishlists(filters);

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
    </TableRow>
  );

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
    console.error('Wishlists fetch error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Wishlists
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred while fetching wishlists.
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

  const wishlists: IWishlist[] = wishlistsData?.data || [];
  const totalCount = wishlistsData?.meta?.count || 0;

  return (
    <div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[250px]"
                onClick={() => handleSort('user.name')}
              >
                <div className="flex items-center justify-between">
                  <span>User</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'user.name' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'user.name' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[300px]"
                onClick={() => handleSort('product.title')}
              >
                <div className="flex items-center justify-between">
                  <span>Product</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'product.title' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'product.title' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[180px]"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Added Date</span>
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
              : wishlists.length > 0
              ? wishlists.map((wishlist) => (
                  <TableRow key={wishlist.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-full">
                          <ProfileImage image={wishlist.user.detail?.image || wishlist.user.detail?.profileImage} />
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{wishlist.user.name}</p>
                          <p className="text-xs text-muted-foreground">{wishlist.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48">
                        <Link
                          href={`/products/${wishlist.product.id}`}
                          className="font-medium hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                        >
                          {wishlist.product.title}
                        </Link>
                        <p className="text-sm text-muted-foreground truncate">
                          {wishlist.product.category.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDateTime(wishlist.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/wishlists/${wishlist.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteWishlistModal wishlist={wishlist} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground h-80">
                      No wishlists found
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {wishlists.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            Showing
            <input
              type="number"
              value={
                totalCount && currentLimit > totalCount
                  ? totalCount
                  : currentLimit
              }
              onChange={(e) => setCurrentLimit(parseInt(e.target.value) || 10)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value =
                    parseInt((e.target as HTMLInputElement).value) || 10;
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
  )
}
