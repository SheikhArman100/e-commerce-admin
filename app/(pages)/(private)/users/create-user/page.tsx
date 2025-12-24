'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TextInput from '@/components/input/TextInput';
import PhoneNumberInput from '@/components/input/PhoneNumberInput';
import RoleSelect from '@/components/input/RoleSelect';

import { createUserSchema } from '@/validation/user.validation';
import { useCreateUser } from '@/hooks/useUsers';
import { ENUM_USER_ROLE } from '@/types/auth.types';
import type { CreateUserRequest } from '@/types/user.types';
import Link from 'next/link';

type CreateUserFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'user';
  password: string;
};

export default function CreateUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserMutation = useCreateUser();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      role: 'user',
      password: '',
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    setIsSubmitting(true);

    try {
      // Transform data to match backend API expectations
      const createData: CreateUserRequest = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        role: data.role, // Optional, defaults to USER if not provided
      };

      await createUserMutation.mutateAsync(createData);

      toast.success('User created successfully!');
      router.push('/users');
    } catch (error: any) {
      console.error('Create user error:', error);
      toast.error(error?.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Create New User
          </h1>
          <p className="text-muted-foreground">
            Add a new user to the system with appropriate permissions
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-5xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            User Information
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new user account. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <TextInput
                  label="Full Name *"
                  placeholder="Enter full name"
                  name="name"
                  type="text"
                  register={form.register}
                  errors={form.formState.errors.name?.message}
                />

                {/* Email Field */}
                <TextInput
                  label="Email Address *"
                  placeholder="Enter email address"
                  name="email"
                  type="email"
                  register={form.register}
                  errors={form.formState.errors.email?.message}
                />

                {/* Phone Number Field */}
                <div className="col-span-1 flex flex-col gap-1">
                  <FormLabel>Phone Number *</FormLabel>
                  <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <PhoneNumberInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="1xxxxxxxxx"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a valid Bangladeshi phone number.
                  </p>
                  {form.formState.errors.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div className="col-span-1 flex flex-col gap-1">
                  <FormLabel>User Role *</FormLabel>
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <RoleSelect
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a role"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose the appropriate role for this user.
                  </p>
                  {form.formState.errors.role && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field - Full Width */}
              <TextInput
                label="Set Password *"
                placeholder="Enter password"
                name="password"
                type="password"
                register={form.register}
                errors={form.formState.errors.password?.message}
                showPasswordToggle={true}
              />

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating User...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create User
                    </>
                  )}
                </Button>

                <Link href="/users">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
