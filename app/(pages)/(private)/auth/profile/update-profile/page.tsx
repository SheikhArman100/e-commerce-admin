'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useUserProfile, useUpdateUserProfile } from '@/hooks/useUsers';
import { updateUserProfileSchema } from '@/validation/user.validation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TextInput from '@/components/input/TextInput';
import { ScreenLoader } from '@/components/screen-loader';
import Link from 'next/link';

type UpdateProfileFormData = z.infer<typeof updateUserProfileSchema>;

export default function UpdateProfilePage() {
  const router = useRouter();

  // Get current user profile
  const { data: user, isLoading: isLoadingProfile } = useUserProfile();

  // Update profile mutation
  const updateProfileMutation = useUpdateUserProfile();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  // Update form values when user data loads
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user, reset]);

  const handleUpdateProfile = async (data: UpdateProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast.success('Profile updated successfully!');
      router.push('/auth/profile');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoadingProfile) {
    return <ScreenLoader title="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load your profile information.
          </p>
          <Button asChild variant="outline">
            <Link href="/auth/profile">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
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
            <Button asChild variant="outline">
            <Link href="/auth/profile">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
            <h1 className="text-3xl font-bold tracking-tight mt-2">
              Update Profile
            </h1>
            <p className="text-muted-foreground">
              Update your personal information
            </p>
          </div>
        </div>
        
      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your basic profile information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
              <div className="space-y-2">
                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  name="name"
                  register={register}
                  errors={errors.name?.message}
                />
              </div>

              <div className="space-y-2">
                <TextInput
                  label="Phone Number (Optional)"
                  placeholder="Enter your phone number"
                  name="phoneNumber"
                  register={register}
                  errors={errors.phoneNumber?.message}
                />
              </div>

              {/* Read-only email field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <span className="text-sm">{user.email}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    Cannot be changed
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending || !isDirty}
                  className="flex-1"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={!isDirty}
                >
                  Reset Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
