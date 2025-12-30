'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, Eye, Loader2, Package } from 'lucide-react';
import { IProduct } from '@/types/product.types';
import { formatDateTime } from '@/lib/helpers';
import { useProducts } from '@/hooks/useProducts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { ScreenLoader } from '@/components/screen-loader';
import DeleteProductModal from '@/app/(pages)/(private)/products/DeleteProductModal';

export default function ProductsTable() {
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
  const isActive = searchParams.get('isActive') || '';
  const inStock = searchParams.get('inStock') || '';
  const categoryId = searchParams.get('categoryId') || '';

  // Update currentLimit when limit changes
  React.useEffect(() => {
    setCurrentLimit(limit);
  }, [limit]);

  // Build filters object matching API expectations (memoized to prevent unnecessary re-fetches)
  const filters = React.useMemo(
    () => ({
      page,
      limit,
      ...(searchTerm && { searchTerm }),
      ...(isActive && isActive !== 'all' && { isActive }),
      ...(inStock && inStock !== 'all' && { inStock }),
      ...(categoryId && categoryId !== 'all' && { categoryId }),
      sortBy,
      sortOrder,
    }),
    [page, limit, searchTerm, isActive, inStock, categoryId, sortBy, sortOrder],
  );

  const { data: productsData, isLoading, error } = useProducts(filters);

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
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

  const getStockStatus = (product: IProduct) => {
    const totalStock = product.flavors.reduce((total, flavor) => {
      return (
        total +
        flavor.sizes.reduce((flavorTotal, size) => flavorTotal + size.stock, 0)
      );
    }, 0);

    if (totalStock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (totalStock < 10) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  const getVariantsCount = (product: IProduct) => {
    const flavorCount = product.flavors.length;
    const sizeCount = product.flavors.reduce(
      (total, flavor) => total + flavor.sizes.length,
      0,
    );
    return `${flavorCount} flavor${flavorCount !== 1 ? 's' : ''}, ${sizeCount} size${sizeCount !== 1 ? 's' : ''}`;
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
    console.error('Products fetch error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Products
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred while fetching products.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const products: IProduct[] = productsData?.data || [];
  const totalCount = productsData?.meta?.count || 0;

  return (
    <div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[250px]"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center justify-between">
                  <span>Product</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'title' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'title' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('category.name')}
              >
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'category.name' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'category.name' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[120px]">Stock Status</TableHead>
              <TableHead className="w-[100px]">Total Stock</TableHead>
              <TableHead className="w-[120px]">Price Range</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('isActive')}
              >
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'isActive' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'isActive' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[200px]"
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
            ) : products.length > 0 ? (
              products.map((product) => {
                const stockStatus = getStockStatus(product);

                // Calculate total stock
                const totalStock = product.flavors.reduce((total, flavor) => {
                  return total + flavor.sizes.reduce((flavorTotal, size) => flavorTotal + size.stock, 0);
                }, 0);

                // Calculate price range
                const allPrices = product.flavors.flatMap(flavor =>
                  flavor.sizes.map(size => size.price)
                );
                const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
                const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
                const priceRange = minPrice === maxPrice
                  ? `$${minPrice.toFixed(2)}`
                  : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 rounded-md">
                          {product.flavors[0]?.images[0] ? (
                            <AvatarImage
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.flavors[0].images[0].path}`}
                              alt={product.title}
                            />
                          ) : (
                            <AvatarFallback className="rounded-md">
                              <Package className="w-4 h-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${product.id}`}
                            className="font-medium hover:text-blue-800 hover:underline block truncate"
                          >
                            {product.title}
                          </Link>
                          <p className="text-sm text-muted-foreground truncate">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${stockStatus.color} text-xs`}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {totalStock}
                    </TableCell>
                    <TableCell className="text-sm">
                      {priceRange}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${getStatusColor(product.isActive ? 'ACTIVE' : 'INACTIVE')}`}
                        ></span>
                        <span className="text-sm text-muted-foreground">
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="">
                      {formatDateTime(product.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/products/${product.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteProductModal product={product} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground h-80"
                >
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {products.length > 0 && (
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
          <PaginationTable count={totalCount} limit={limit} />
        </div>
      )}
    </div>
  );
}
