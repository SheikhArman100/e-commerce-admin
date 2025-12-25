'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';
import { useUser } from '@/hooks/useUsers';
import type { User } from '@/types/user.types';
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


export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const { data: userData, isLoading, error } = useUser(userId);

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

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'user':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <ScreenLoader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              User Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested user could not be found.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                Error Loading User
              </h2>
              <p className="text-gray-600 mb-4">
                {error?.message || 'An error occurred while fetching user details.'}
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

  const user = userData;

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              User Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested user could not be found.
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
            <Link href="/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mt-2">
              {user.name}
            </h1>
            <p className="text-muted-foreground">User Details</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="primary">
            <Link href={`/users/${userId}/update-user`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Basic details and configuration of the user's profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image and Basic Info */}
              <div className="flex items-start gap-4">
                <Avatar className="w-24 h-24 rounded-full">
                <ProfileImage
                  image={user.detail?.image || user.detail?.profileImage}
                  
                />
                </Avatar>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </label>
                      <p className="text-lg font-semibold">
                        {user.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role and Verification Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <div className="mt-1">
                    <Badge className={`${getRoleColor(user.role)} capitalize`}>
                      {user.role.split('_').join(' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Verified
                  </label>
                  <div className="mt-1">
                    <Badge className={user.isVerified ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Active Status
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    <span className="text-sm">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                {user.phoneNumber && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </label>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {user.phoneNumber}
                    </p>
                  </div>
                )}
                {user.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created By
                    </label>
                    <p className="text-sm">
                      {user.creator.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Address Information */}
              {(user.detail?.address || user.detail?.city || user.detail?.road) && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.detail.address && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Address
                          </label>
                          <p className="text-sm">{user.detail.address}</p>
                        </div>
                      )}
                      {user.detail.city && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            City
                          </label>
                          <p className="text-sm">{user.detail.city}</p>
                        </div>
                      )}
                      {user.detail.road && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Road
                          </label>
                          <p className="text-sm">{user.detail.road}</p>
                        </div>
                      )}
                    </div>
                  </div>
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
                <p className="text-sm">{formatDateTime(user.createdAt)}</p>
              </div>
              {user.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">{formatDateTime(user.updatedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator and Updater Information */}
          {(user.creator || user.updater) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Creator Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created By
                    </label>
                    <p className="text-sm font-medium">
                      {user.creator.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.creator.email}
                    </p>
                  </div>
                )}
                {user.updater && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated By
                    </label>
                    <p className="text-sm font-medium">
                      {user.updater.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.updater.email}
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
