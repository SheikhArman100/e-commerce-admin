'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Clock,
  Shield,
} from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';
import { useCategory } from '@/hooks/useCategories';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProfileImage from '@/components/ProfileImage';
import { ScreenLoader } from '@/components/screen-loader';
import Link from 'next/link';


export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;

  const { data: categoryData, isLoading, error } = useCategory(categoryId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (isLoading) {
    return <ScreenLoader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/categories">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Category Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested category could not be found.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                Error Loading Category
              </h2>
              <p className="text-gray-600 mb-4">
                {error?.message || 'An error occurred while fetching category details.'}
              </p>
              <Button onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const category = categoryData;

  if (!category) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/categories">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Category Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested category could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <div>
            <Link href="/categories">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mt-2">
              {category.name}
            </h1>
            <p className="text-muted-foreground">Category Details</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href={`/categories/${categoryId}/update-category`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Category
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
              <CardDescription>
                Basic details and configuration of this category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Image and Basic Info */}
              <div className="flex items-start gap-4">
                <Avatar className="w-24 h-24 rounded-full">
                <ProfileImage
                  image={category.image || null}

                />
                </Avatar>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Category Name
                      </label>
                      <p className="text-lg font-semibold">
                        {category.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Slug
                      </label>
                      <p className="text-sm">
                        {category.slug}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(category.isActive ? 'ACTIVE' : 'INACTIVE')} capitalize`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Display Order
                  </label>
                  <p className="text-sm">
                    {category.displayOrder}
                  </p>
                </div>
                {category.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created By
                    </label>
                    <p className="text-sm">
                      {category.creator.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {category.description && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metadata Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="text-sm">{formatDateTime(category.createdAt)}</p>
              </div>
              {category.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">{formatDateTime(category.updatedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator and Updater Information */}
          {(category.creator || category.updater) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Creator Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created By
                    </label>
                    <p className="text-sm font-medium">
                      {category.creator.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.creator.email}
                    </p>
                  </div>
                )}
                {category.updater && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated By
                    </label>
                    <p className="text-sm font-medium">
                      {category.updater.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.updater.email}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
