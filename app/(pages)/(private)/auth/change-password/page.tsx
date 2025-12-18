'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { changePasswordSchema } from '@/validation/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, OctagonAlert, ShieldAlert, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IChangePasswordFormData } from '@/types/auth.types';
import { cn } from '@/lib/utils';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TextInput from '@/components/input/TextInput';

const ChangePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const status = searchParams.get('status');

  const isDefaultPassword = status === 'default_password';
  const isInactivity = status === 'inactivity';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Watch the new password field for validation feedback
  const newPassword = watch('newPassword', '');
  const confirmNewPassword = watch('confirmNewPassword', '');
  const oldPassword = watch('oldPassword', '');

  // Password validation checks
  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
    match: newPassword === confirmNewPassword && newPassword.length > 0,
    different:
      oldPassword !== newPassword &&
      newPassword.length > 0 &&
      oldPassword.length > 0,
  };

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosPrivate.put('/auth/change-password', data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['profile'],
          refetchType: 'all',
        }),
      ]);
    },
  });

  const handleChangePassword = (data: IChangePasswordFormData) => {
    const mutationData: any = {
      newPassword: data.newPassword,
    };

    if (!isDefaultPassword) {
      mutationData.oldPassword = data.oldPassword;
    }

    changePasswordMutation.mutate(mutationData, {
      onError: (data: any) => {
        toast.error(data.response.data.message);
      },
      onSuccess: (data: any) => {
        toast.success(data.message);
        if(isDefaultPassword || isInactivity){
          router.push('/');
        }
        reset();
      },
    });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Change Password
        </h1>
        <p className="text-muted-foreground">
          Change Password to Make it Secured
        </p>
      </div>

      <div className="w-full max-w-5xl ">
        <Card className="py-8">
          <CardContent className="space-y-4 py-6">
            {(isDefaultPassword || isInactivity) && (
              <Alert variant="warning" appearance="light">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  {isDefaultPassword
                    ? 'Your account is using a default password. Check your email for the temporary password. Please change it to continue.'
                    : 'Your password has expired due to inactivity. Please update it to continue.'}
                </AlertDescription>
              </Alert>
            )}
            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              {!isDefaultPassword && (
                <div className="space-y-2">
                  <TextInput
                    label="Old Password"
                    placeholder="Enter old password"
                    name="oldPassword"
                    type="password"
                    register={register}
                    errors={errors.oldPassword?.message}
                    showPasswordToggle={true}
                  />
                </div>
              )}

              <div className="space-y-2">
                <TextInput
                  label="New Password"
                  placeholder="Enter new password"
                  name="newPassword"
                  type="password"
                  register={register}
                  errors={errors.newPassword?.message}
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
                      {!isDefaultPassword && (
                        <PasswordRequirement
                          met={passwordChecks.different}
                          label="Different from current password"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <TextInput
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  name="confirmNewPassword"
                  type="password"
                  register={register}
                  errors={errors.confirmNewPassword?.message}
                  showPasswordToggle={true}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm font-medium"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
