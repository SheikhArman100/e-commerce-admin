'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { signInSchema } from '@/validation/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ISignInFormData } from '@/types/auth.types';
import { axiosPublic } from '@/lib/axios';
import useUserInfo from '@/hooks/useUserInfo';
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

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const setAccessToken = useAuthStore((state: any) => state.setAccessToken);
  const queryClient = useQueryClient();

  // const { data, isPending } = useUserInfo();
  // const user = data?.data;
  // useEffect(() => {
  //   if (user) {
  //     router.replace(next || '/');
  //   }
  // }, [user, router]);

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<ISignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  //sign in mutation
  const signinMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosPublic.post('/auth/signin', data, {
        withCredentials: true,
      });

      return response.data;
    },
    onSuccess: async (data: any) => {
      setAccessToken(data?.data.accessToken);
      return queryClient.refetchQueries();
    },
  });

  const handleSignIn = (data: ISignInFormData) => {
    signinMutation.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onError: (data: any) => {
          toast.error(data.response.data.message);
        },
        onSuccess: (data) => {
          router.push(next || '/');
          toast.success(data.message);
        },
      },
    );
  };

  // if (isPending) {
  //   return <ScreenLoader title="Checking authentication..." />;
  // }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6 ">
        {/* <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome Back</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Sign in to your CDR Central Dashboard</p>
        </div> */}

        <Card className="py-8">
          <CardHeader className="space-y-1 py-3 flex flex-col">
            <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-sm">
              Sign in to your CDR Central Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-6">
            <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
              <div className="space-y-2">
                <TextInput
                  label="Email"
                  placeholder="email@email.com"
                  name="email"
                  type="email"
                  register={register}
                  errors={errors.email?.message}
                />
              </div>

              <div className="space-y-2">
                <TextInput
                  label="Password"
                  placeholder="Enter Password"
                  name="password"
                  type="password"
                  register={register}
                  errors={errors.password?.message}
                  showPasswordToggle={true}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm font-medium"
                disabled={signinMutation.isPending}
              >
                {signinMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* <div className="text-center text-xs sm:text-sm text-blue-700">
              <Link href="/" className="hover:underline transition-colors">
                Back to Dashboard
              </Link>
            </div> */}
          </CardContent>
        </Card>

        {/* <div className="text-center text-xs sm:text-sm text-muted-foreground">
          <Link href="/" className="hover:underline transition-colors">
            Back to Dashboard
          </Link>
        </div> */}
      </div>
    </div>
  );
}
