'use client';

import {
  Calendar,
  Clock,
  Edit,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';
import { useUserProfile } from '@/hooks/useUsers';
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
import { notFound } from 'next/navigation';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useUserProfile();

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
    return <ScreenLoader title="Loading profile..." />;
  }

  if (error) {
    // Handle different error types
    const errorStatus = (error as any)?.response?.status || (error as any)?.status;
    if (errorStatus === 404 || errorStatus === 422) {
      notFound();
    } else {
      // For other errors, show error message or fallback
      console.error('Profile fetch error:', error);
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 mb-4">
              An error occurred while fetching your profile information.
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
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600">
            Your profile information could not be found.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user.name}
            </h1>
            <p className="text-muted-foreground">My Profile</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="primary">
            <Link href="/auth/profile/update-profile">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
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
                Basic details and configuration of your profile
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
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(user.isActive ? 'ACTIVE' : 'INACTIVE').split(' ')[0].replace('100', '500')}`}></span>
                    <span className={`text-sm `}>
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
        </div>
      </div>
    </div>
  );
}
