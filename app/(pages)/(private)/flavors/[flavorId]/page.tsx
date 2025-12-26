'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Clock,
  Shield,
} from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';
import { useFlavor } from '@/hooks/useFlavors';
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


export default function FlavorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const flavorId = params.flavorId as string;

  const { data: flavorData, isLoading, error } = useFlavor(flavorId);

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
          <Link href="/flavors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Flavors
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Flavor Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested flavor could not be found.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                Error Loading Flavor
              </h2>
              <p className="text-gray-600 mb-4">
                {error?.message || 'An error occurred while fetching flavor details.'}
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

  const flavor = flavorData;

  if (!flavor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/flavors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Flavors
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Flavor Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested flavor could not be found.
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
            <Link href="/flavors">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Flavors
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mt-2">
              {flavor.name}
            </h1>
            <p className="text-muted-foreground">Flavor Details</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href={`/flavors/${flavorId}/update-flavor`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Flavor
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flavor Information</CardTitle>
              <CardDescription>
                Basic details and configuration of this flavor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flavor Name and Color */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Flavor Name
                      </label>
                      <p className="text-lg font-semibold">
                        {flavor.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Color
                      </label>
                      <div className="flex items-center gap-3 mt-1">
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: flavor.color }}
                        />
                        <span className="text-sm font-mono font-medium">
                          {flavor.color}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(flavor.isActive ? 'ACTIVE' : 'INACTIVE')} capitalize`}>
                      {flavor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                {flavor.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created By
                    </label>
                    <p className="text-sm">
                      {flavor.creator.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {flavor.description && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {flavor.description}
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
                <p className="text-sm">{formatDateTime(flavor.createdAt)}</p>
              </div>
              {flavor.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">{formatDateTime(flavor.updatedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator and Updater Information */}
          {(flavor.creator || flavor.updater) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Creator Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {flavor.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created By
                    </label>
                    <p className="text-sm font-medium">
                      {flavor.creator.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {flavor.creator.email}
                    </p>
                  </div>
                )}
                {flavor.updater && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated By
                    </label>
                    <p className="text-sm font-medium">
                      {flavor.updater.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {flavor.updater.email}
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
