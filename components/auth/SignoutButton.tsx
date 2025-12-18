'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { axiosPublic } from '@/lib/axios';

import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { DropdownMenuItem } from '../ui/dropdown-menu';

const SignOutButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosPrivate=useAxiosPrivate()
  const setAccessToken = useAuthStore((state: any) => state.setAccessToken);

  const signoutMutation = useMutation({
  mutationFn: async () => {
    const response = await axiosPrivate.post('/auth/signout');
    return response.data;
  },
  onSuccess: (data) => {
    setAccessToken(null);
    // const existingScript = document.querySelector(`script[src="${process.env.NEXT_PUBLIC_WIDGET_URL}/loader.js"]`);
    // if (existingScript) {
    //   existingScript.remove();
    // }
    // Clear signin status from localStorage
    setAccessToken(null);

    // Redirect to signin page
    // window.location.href = "/auth/signin";
    router.push('/auth/signin');
    queryClient.removeQueries();
    toast.success(data.message);
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || 'Sign out failed');
  },
});
  const handleSignOut = () => {
    signoutMutation.mutate();
  };

  return (
    <DropdownMenuItem onClick={handleSignOut} className='cursor-pointer'>
      {signoutMutation.isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </>
      )}
    </DropdownMenuItem>
  );
};

export default SignOutButton;