'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Package, Image as ImageIcon, DollarSign, Box } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import { useProduct } from '@/hooks/useProducts';
import { formatDateTime } from '@/lib/helpers';
import { ScreenLoader } from '@/components/screen-loader';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;

  const { data: productData, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return <ScreenLoader />;
  }

  if (error || !productData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const product = productData;

  const getStockStatus = () => {
    const totalStock = product.flavors.reduce((total, flavor) => {
      // Check if this is a quantity-based product (no sizes array)
      if (!flavor.sizes || flavor.sizes.length === 0) {
        // For quantity-based products, stock is directly on the flavor
        // Note: This assumes the API provides stock data for quantity products
        // For now, we'll assume quantity products always have stock or handle it differently
        return total; // Skip quantity-based products in stock calculation for now
      }

      // For size-based products, sum stock from all sizes
      return total + flavor.sizes.reduce((flavorTotal, size) => flavorTotal + size.stock, 0);
    }, 0);

    if (totalStock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (totalStock < 10) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  const stockStatus = getStockStatus();

  // Calculate price range handling both quantity-based and size-based products
  const allPrices = product.flavors.flatMap(flavor => {
    // Check if this is a quantity-based product (no sizes or empty sizes array)
    if (!flavor.sizes || flavor.sizes.length === 0) {
      // For quantity-based products, we need to get price from flavor level
      // This assumes the API provides price data for quantity products
      // For now, we'll return a placeholder or handle it differently
      return []; // Skip for now - quantity products may not have prices in current API response
    }

    // For size-based products, get prices from all sizes
    return flavor.sizes.map(size => size.price);
  });

  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          {/* <Separator orientation="vertical" className="h-6" /> */}
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              {product.title}
            </h1>
            <p className="text-muted-foreground">{product.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/products/${product.id}/update-product`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="font-semibold">{product.category.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price Range</p>
                <p className="font-semibold">
                  {minPrice === maxPrice
                    ? `$${minPrice.toFixed(2)}`
                    : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Box className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Status</p>
                <Badge className={stockStatus.color}>
                  {stockStatus.label}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${product.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className={`w-3 h-3 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                {product.flavors.length} flavor{product.flavors.length !== 1 ? 's' : ''} with variants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {product.flavors.map((flavor, flavorIndex) => {
                  // Check if this is a quantity-based product
                  // API returns sizes array with one item where size is null and soldByQuantity is true
                  const quantitySize = flavor.sizes?.find(size => size.size === null && size.soldByQuantity === true);
                  const isQuantityBased = !!quantitySize;

                  // For quantity-based, get the single size entry with stock/price
                  // For size-based, filter out the null size entry (if any)
                  const displaySizes = isQuantityBased
                    ? [] // Don't show sizes for quantity-based
                    : flavor.sizes?.filter(size => size.size !== null) || [];

                  return (
                    <div key={flavor.flavor.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: flavor.flavor.color }}
                        />
                        <h3 className="font-semibold">{flavor.flavor.name}</h3>
                        <Badge variant="outline">
                          {isQuantityBased ? 'Quantity-based' : `${displaySizes.length} size${displaySizes.length !== 1 ? 's' : ''}`}
                        </Badge>
                      </div>

                      {/* Images */}
                      {flavor.images.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Images ({flavor.images.length})
                          </h4>
                          <div className="flex gap-2 overflow-x-auto">
                            {flavor.images.map((image, imageIndex) => (
                              <Avatar key={imageIndex} className="w-16 h-16 rounded-md flex-shrink-0">
                                <AvatarImage
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image.path}`}
                                  alt={`${flavor.flavor.name} ${imageIndex + 1}`}
                                />
                                <AvatarFallback className="rounded-md">
                                  <ImageIcon className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Conditional: Quantity-based or Size-based display */}
                      {isQuantityBased ? (
                        // Quantity-based product display
                        <div>
                          <h4 className="text-sm font-medium mb-2">Stock & Pricing</h4>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="font-medium">Unit Price</span>
                            <div className="text-right">
                              <p className="font-semibold">${quantitySize.price.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">
                                Stock: {quantitySize.stock}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            This product is sold by quantity (e.g., cupcakes, cookies). Customers can buy 1, 2, 3+ units.
                          </p>
                        </div>
                      ) : (
                        // Size-based product display
                        <div>
                          <h4 className="text-sm font-medium mb-2">Sizes & Pricing</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {displaySizes.map((size) => (
                              <div key={size.size?.id || `size-${Math.random()}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <span className="font-medium">{size.size?.name || 'N/A'}</span>
                                <div className="text-right">
                                  <p className="font-semibold">${size.price.toFixed(2)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Stock: {size.stock}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            This product has multiple sizes. Customers choose a size and quantity.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Metadata */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Creation Info</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{formatDateTime(product.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="font-medium">{formatDateTime(product.updatedAt)}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground text-xs mb-1">Created by</p>
                    <p className="font-medium text-sm">{product.creator.name}</p>
                    <p className="text-muted-foreground text-xs">{product.creator.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Product Stats</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flavors:</span>
                    <span className="font-medium">{product.flavors.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variants:</span>
                    <span className="font-medium">
                      {product.flavors.reduce((total, flavor) => {
                        // For quantity-based products (no sizes), count as 1 variant per flavor
                        // For size-based products, count the number of sizes
                        if (!flavor.sizes || flavor.sizes.length === 0) {
                          return total + 1; // 1 variant per flavor for quantity products
                        }
                        return total + flavor.sizes.length; // Number of sizes for size-based products
                      }, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Images:</span>
                    <span className="font-medium">{product.flavors.reduce((total, flavor) => total + flavor.images.length, 0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
