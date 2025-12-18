
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema } from '@/validation/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Check, Loader2, OctagonAlert, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IResetPasswordFormData } from '@/types/auth.types';
import { axiosPublic } from '@/lib/axios';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TextInput from '@/components/input/TextInput';

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Watch the password fields for validation feedback
  const newPassword = watch('newPassword', '');
  const confirmNewPassword = watch('confirmNewPassword', '');

  // Password validation checks
  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
    match: newPassword === confirmNewPassword && newPassword.length > 0,
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosPublic.put(
        `/auth/reset-password?token=${token}`,
        data,
        {
          withCredentials: true,
        },
      );

      return response.data;
    },
  });

  const handleResetPassword = (data: any) => {
    resetPasswordMutation.mutate(
      {
        newPassword: data.newPassword,
      },
      {
        onError: (data: any) => {
          toast.error(data.response.data.message);
        },
        onSuccess: (data) => {
          router.push('/auth/signin');
          toast.success(data.message);
          reset();
        },
      },
    );
  };

  // Reusable component for each requirement
  function PasswordRequirement({
    met,
    label,
  }: {
    met: boolean;
    label: string;
  }) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center">
          {met ? (
            <Check
              key={`check-${label}`}
              className="h-4 w-4 text-green-600 animate-pulse"
            />
          ) : (
            <X
              key={`x-${label}`}
              className="h-4 w-4 text-red-500 animate-pulse"
            />
          )}
        </div>

        <span
          className={cn(
            'text-sm transition-colors duration-300',
            met
              ? 'text-green-700 dark:text-green-400'
              : 'text-muted-foreground',
          )}
        >
          {label}
        </span>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6">
        <Card className="py-8">
          <CardHeader className="space-y-1 py-3 flex flex-col">
            <CardTitle className="text-xl sm:text-2xl">
              Reset Password
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Enter your new password below to complete the reset process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-6">
            <form
              onSubmit={handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <TextInput
                  label="New Password"
                  placeholder="Enter your new password"
                  name="newPassword"
                  type="password"
                  register={register}
                  showPasswordToggle={true}
                />

                {/* Password Requirements */}
                {newPassword && (
                  <div className="space-y-3 p-5 bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl border border-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <OctagonAlert className="h-6 w-6 text-muted-foreground " />

                      <p className="text-sm font-semibold text-foreground">
                        Password Requirements
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <PasswordRequirement
                        met={passwordChecks.length}
                        label="At least 8 characters"
                      />
                      <PasswordRequirement
                        met={passwordChecks.uppercase}
                        label="One uppercase letter (A-Z)"
                      />
                      <PasswordRequirement
                        met={passwordChecks.lowercase}
                        label="One lowercase letter (a-z)"
                      />
                      <PasswordRequirement
                        met={passwordChecks.number}
                        label="One number (0-9)"
                      />
                      <PasswordRequirement
                        met={passwordChecks.special}
                        label="One special character (!@#$%^&*)"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <TextInput
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                  name="confirmNewPassword"
                  type="password"
                  register={register}
                  errors={errors.confirmNewPassword?.message as string}
                  showPasswordToggle={true}
                />

                {/* Password Match Indicator */}
                {/* {confirmNewPassword && (
                  <div className={cn("flex items-center gap-2 text-xs p-2 rounded", passwordChecks.match ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50")}>
                    {passwordChecks.match ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    Passwords {passwordChecks.match ? 'match' : 'do not match'}
                  </div>
                )} */}
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm font-medium"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>

            <div className="text-center text-xs sm:text-sm text-muted-foreground">
              <p className="text-sm">
                Remember your password?{' '}
                <Link
                  className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
                  href="/auth/signin"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
