
'use client';

import Link from 'next/link';
import { forgetPasswordSchema } from '@/validation/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IForgetPasswordFormData } from '@/types/auth.types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TextInput from '@/components/input/TextInput';
import { axiosPublic } from '@/lib/axios';

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<IForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const forgetPasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      
      const response = await axiosPublic.post('/auth/forget-password', data, {
        withCredentials: true,
      });

      return response.data;
    },
  });
  const handleForgetPassword = (data: IForgetPasswordFormData) => {
    forgetPasswordMutation.mutate(
      {
        email: data.email,
      },
      {
        onError: (data: any) => {
          toast.error(data.response.data.message);
        },
        onSuccess: (data) => {
          toast.success(data.message);
          reset();
        },
      },
    );
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6">
        <Card className="py-8">
          <CardHeader className="space-y-1 py-3 flex flex-col">
            <CardTitle className="text-xl sm:text-2xl">
              Reset Password
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-6">
            <form
              onSubmit={handleSubmit(handleForgetPassword)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <TextInput
                  label="Email Address"
                  placeholder="email@email.com"
                  name="email"
                  type="email"
                  register={register}
                  errors={errors.email?.message}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm font-medium"
                disabled={forgetPasswordMutation.isPending}
              >
                {forgetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
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

export default ForgetPassword;
