'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Clock,
  Shield,
} from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';
import { useSize } from '@/hooks/useSizes';
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
import { ScreenLoader } from '@/components/screen-loader';
import Link from 'next/link';


export default function SizeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const sizeId = params.sizeId as string;

  const { data: sizeData, isLoading, error } = useSize(sizeId);

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
          <Link href="/sizes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sizes
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Size Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested size could not be found.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                Error Loading Size
              </h2>
              <p className="text-gray-600 mb-4">
                {error?.message || 'An error occurred while fetching size details.'}
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

  const size = sizeData;

  if (!size) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/sizes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sizes
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Size Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested size could not be found.
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
            <Link href="/sizes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sizes
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mt-2">
              {size.name}
            </h1>
            <p className="text-muted-foreground">Size Details</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href={`/sizes/${sizeId}/update-size`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Size
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Size Information</CardTitle>
              <CardDescription>
                Basic details and configuration of this size
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Size Name
                  </label>
                  <p className="text-lg font-semibold">
                    {size.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(size.isActive ? 'ACTIVE' : 'INACTIVE')} capitalize`}>
                      {size.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-sm text-muted-foreground">
                  {size.description}
                </p>
              </div>

              {/* Creator Info */}
              {size.creator && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created By
                  </label>
                  <p className="text-sm">
                    {size.creator.name}
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
                <p className="text-sm">{formatDateTime(size.createdAt)}</p>
              </div>
              {size.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">{formatDateTime(size.updatedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator and Updater Information */}
          {(size.creator || size.updater) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Creator Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {size.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created By
                    </label>
                    <p className="text-sm font-medium">
                      {size.creator.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {size.creator.email}
                    </p>
                  </div>
                )}
                {size.updater && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated By
                    </label>
                    <p className="text-sm font-medium">
                      {size.updater.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {size.updater.email}
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
