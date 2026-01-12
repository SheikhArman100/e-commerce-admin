'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Star, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';

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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { useWishlist, useDeleteWishlist } from '@/hooks/useWishlists';
import { ScreenLoader } from '@/components/screen-loader';
import ProfileImage from '@/components/ProfileImage';
import { toast } from 'sonner';

export default function WishlistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wishlistId = params.wishlistId as string;

  const { data: wishlist, isLoading, error } = useWishlist(wishlistId);
  const deleteWishlistMutation = useDeleteWishlist();

  if (isLoading) {
    return <ScreenLoader title="Loading wishlist details" />;
  }

  if (error || !wishlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Wishlist Item Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The wishlist item you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/wishlists')} variant="outline">
            Back to Wishlists
          </Button>
        </div>
      </div>
    );
  }

  const handleRemoveFromWishlist = async () => {
    try {
      await deleteWishlistMutation.mutateAsync(wishlistId);
      toast.success('Product removed from wishlist successfully!');
      router.push('/wishlists');
    } catch (error: any) {
      console.error('Remove from wishlist error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to remove product from wishlist. Please try again.'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/wishlists">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Wishlists
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Wishlist Item Details
            </h1>
            {/* <p className="text-muted-foreground">
              {wishlist.user.name}'s saved product
            </p> */}
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRemoveFromWishlist}
            disabled={deleteWishlistMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove from Wishlist
          </Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Wishlist Item */}
          <Card className="">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between p-2 w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Wishlist Item</h3>
                    <p className="text-sm text-gray-600">Saved by {wishlist.user.name}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white border-red-200 text-red-700">
                  Active Wishlist
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info Section */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                <Avatar className="h-14 w-14 ">
                  <ProfileImage image={wishlist.user.detail?.image || wishlist.user.detail?.profileImage} />
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{wishlist.user.name}</h4>
                  <p className="text-sm text-gray-600">{wishlist.user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">User ID: {wishlist.userId}</p>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="text-center p-6 bg-white rounded-lg border">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  <Star className="w-4 h-4 fill-current" />
                  Saved Product
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  <Link
                    href={`/products/${wishlist.product.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {wishlist.product.title}
                  </Link>
                </h2>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {wishlist.product.category.name}
                    </Badge>
                  </span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 ${wishlist.product.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${wishlist.product.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    {wishlist.product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-700 mt-4 max-w-md mx-auto leading-relaxed">
                  {wishlist.product.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* <Button
                variant="outline"
                onClick={handleRemoveFromWishlist}
                disabled={deleteWishlistMutation.isPending}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                {deleteWishlistMutation.isPending ? (
                  <>Removing...</>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from Wishlist
                  </>
                )}
              </Button> */}
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/products/${wishlist.product.id}`}>
                  View Product Details
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Wishlist Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wishlist Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Wishlist ID</label>
                  <p className="font-mono text-sm font-medium mt-1">{wishlist.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product ID</label>
                  <p className="font-mono text-sm font-medium mt-1">{wishlist.productId}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Added</label>
                  <p className="text-sm font-medium mt-1">{formatDateTime(wishlist.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</label>
                  <p className="text-sm font-medium mt-1">{formatDateTime(wishlist.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <Badge variant="secondary">{wishlist.product.category.name}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={wishlist.product.isActive ? 'success' : 'secondary'}>
                  {wishlist.product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Product ID</span>
                <span className="font-mono text-sm">{wishlist.product.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
