'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Star, Image as ImageIcon, Eye, EyeOff, Trash2 } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';

import { useReview, useUpdateReview } from '@/hooks/useReviews';
import { ScreenLoader } from '@/components/screen-loader';
import ProfileImage from '@/components/ProfileImage';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.reviewId as string;

  const { data: review, isLoading, error } = useReview(reviewId);
  const updateReviewMutation = useUpdateReview();

  if (isLoading) {
    return <ScreenLoader title="Loading review details" />;
  }

  if (error || !review) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Review Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The review you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/reviews')} variant="outline">
            Back to Reviews
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleVisibility = async () => {
    try {
      await updateReviewMutation.mutateAsync({
        id: reviewId,
        data: { isHide: !review.isHidden }
      });
      toast.success(`Review ${!review.isHidden ? 'hidden' : 'shown'} successfully!`);
    } catch (error: any) {
      console.error('Toggle review visibility error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to update review visibility. Please try again.'
      );
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        {/* <span className="ml-2 text-sm font-medium">{rating}/5</span> */}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/reviews">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reviews
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Review Details
            </h1>
            {/* <p className="text-muted-foreground">
              Review #{review.id} by {review.user.name}
            </p> */}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleToggleVisibility}
            disabled={updateReviewMutation.isPending}
          >
            {updateReviewMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : review.isHidden ? (
              <Eye className="w-4 h-4 mr-1" />
            ) : (
              <EyeOff className="w-4 h-4 mr-1" />
            )}
            {updateReviewMutation.isPending
              ? 'Updating...'
              : review.isHidden
              ? 'Show Review'
              : 'Hide Review'
            }
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Review Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Content Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between  w-full p-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-8 w-8 rounded-full">
                          <ProfileImage image={review.user.detail?.image || review.user.detail?.profileImage} />
                        </Avatar>
                  <div>
                    <h3 className="font-semibold">{review.user.name}</h3>
                    <p className="text-sm text-muted-foreground">{review.user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  {renderStars(review.rating)}
                  <Badge variant={review.isHidden ? 'secondary' : 'success'}>
                    {review.isHidden ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Visible
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Review Comment</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {review.comment}
                </p>
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Review Images ({review.images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {review.images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <AspectRatio ratio={1}>
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image.path}`}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                        </AspectRatio>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product</label>
                  <p className="font-medium">{review.product.title}</p>
                  <p className="text-sm text-muted-foreground">Slug: {review.product.slug}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product ID</label>
                  <p className="font-mono text-sm">{review.productId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                  <p className="font-mono text-sm">{review.order.id}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order Status</label>
                  <Badge variant="outline">{review.order.status}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                  <p className="font-medium">${review.order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                  <p className="text-sm">{formatDateTime(review.order.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Review Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Review ID</label>
                  <p className="font-mono text-sm">{review.id}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                  <p className="font-mono text-sm">{review.orderId}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{formatDateTime(review.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{formatDateTime(review.updatedAt)}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="font-mono text-sm">{review.userId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product ID</label>
                  <p className="font-mono text-sm">{review.productId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
