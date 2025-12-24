'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useUser, useUpdateUser } from '@/hooks/useUsers';
import { updateUserSchema } from '@/validation/user.validation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TextInput from '@/components/input/TextInput';
import PhoneNumberInput from '@/components/input/PhoneNumberInput';
import RoleSelect from '@/components/input/RoleSelect';
import FileUpload from '@/components/input/FileUpload';
import { ScreenLoader } from '@/components/screen-loader';
import Link from 'next/link';

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function UpdateUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // Get user data
  const { data: user, isLoading: isLoadingUser } = useUser(userId);

  // Update user mutation
  const updateUserMutation = useUpdateUser();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      role: (user?.role as 'admin' | 'user') || 'user',
      isActive: true, // Default to active
    },
  });

  // Update form values when user data loads
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phoneNumber: user.phoneNumber || '',
        role: user.role as 'admin' | 'user',
        isActive: true, // Default to active since API doesn't provide this field
      });
    }
  }, [user, reset]);

  const handleUpdateUser = async (data: UpdateUserFormData) => {
    try {
      const updateData = {
        ...data,
        file: selectedFile || undefined, // Include selected file
      };
      await updateUserMutation.mutateAsync({ id: userId, data: updateData });
      toast.success('User updated successfully!');
      router.push(`/users/${userId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update user');
    }
  };

  if (isLoadingUser) {
    return <ScreenLoader title="Loading user..." />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load user information.
          </p>
          <Button asChild variant="outline">
            <Link href={`/users/${userId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to User Details
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href={`/users/${userId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to User Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Update User
            </h1>
            <p className="text-muted-foreground">
              Update user information and permissions
            </p>
          </div>
        </div>

      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update the user's basic information and role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TextInput
                    label="Full Name"
                    placeholder="Enter full name"
                    name="name"
                    register={register}
                    errors={errors.name?.message}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    User Role
                  </label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <RoleSelect
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a role"
                      />
                    )}
                  />
                  {errors.role && (
                    <p className="text-sm text-destructive">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Account Status
                </Label>
                <div className="flex items-center space-x-2">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label className="text-sm text-muted-foreground">
                    Active Account
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggle to activate or deactivate this user account
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneNumberInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="1xxxxxxxxx"
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
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

              {/* Profile Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Profile Image
                </label>
                <FileUpload
                  value={selectedFile}
                  onChange={setSelectedFile}
                  accept="image/*"
                  maxSize={5}
                  placeholder="Upload new profile image"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Upload a new profile image (JPG, PNG, GIF up to 5MB)
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending || (!isDirty && !selectedFile)}
                  className=""
                >
                  {updateUserMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update User
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
