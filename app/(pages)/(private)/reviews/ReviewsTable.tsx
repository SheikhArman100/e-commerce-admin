'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Image as ImageIcon,
  Loader2,
  Star,
} from 'lucide-react';
import { IReview } from '@/types/review.types';
import { formatDateTime } from '@/lib/helpers';
import { useReviews } from '@/hooks/useReviews';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationTable from '@/components/PaginationTable';
import ProfileImage from '@/components/ProfileImage';
import { ScreenLoader } from '@/components/screen-loader';

export default function ReviewsTable() {
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
  const rating = searchParams.get('rating') || '';
  const isHidden = searchParams.get('isHidden') || '';

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
    ...(rating && { rating }),
    ...(isHidden && isHidden !== 'all' && { isHidden }),
    sortBy,
    sortOrder,
  };

  const { data: reviewsData, isLoading, error } = useReviews(filters);

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded animate-pulse max-w-48"></div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
    </TableRow>
  );

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
    console.error('Reviews fetch error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Reviews
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred while fetching reviews.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const reviews: IReview[] = reviewsData?.data || [];
  const totalCount = reviewsData?.meta?.count || 0;

  return (
    <div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[250px]"
                onClick={() => handleSort('comment')}
              >
                <div className="flex items-center justify-between">
                  <span>Review</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'comment' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'comment' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('rating')}
              >
                <div className="flex items-center justify-between">
                  <span>Rating</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'rating' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'rating' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[180px]"
                onClick={() => handleSort('product.title')}
              >
                <div className="flex items-center justify-between">
                  <span>Product</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'product.title' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'product.title' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[200px]"
                onClick={() => handleSort('user.name')}
              >
                <div className="flex items-center justify-between">
                  <span>User</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'user.name' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'user.name' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[120px]"
                onClick={() => handleSort('isHidden')}
              >
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'isHidden' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'isHidden' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[180px]"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Created Date</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }, (_, index) =>
                renderSkeletonRow(index),
              )
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="max-w-48">
                      <Link href={`/reviews/${review.id}`}>
                        <p className="text-sm line-clamp-2 hover:text-blue-600 hover:underline cursor-pointer transition-colors">
                          {review.comment}
                        </p>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRatingStars(review.rating)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-32">
                      <p className="text-sm font-medium truncate">
                        {review.product.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {review.product.category.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Avatar className="h-8 w-8 rounded-full">
                          <ProfileImage
                            image={
                              review.user.detail?.image ||
                              review.user.detail?.profileImage
                            }
                          />
                        </Avatar>
                        {/* <span className="text-sm font-medium text-blue-600">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span> */}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {review.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={review.isHidden ? 'secondary' : 'success'}
                      className={
                        review.isHidden ? 'bg-gray-100 text-gray-700' : ''
                      }
                    >
                      {review.isHidden ? 'Hidden' : 'Visible'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(review.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/reviews/${review.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground h-80"
                >
                  No reviews found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {reviews.length > 0 && (
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
  );
}
