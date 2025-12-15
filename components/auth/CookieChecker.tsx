'use client';

import useUserInfo from '@/hooks/useUserInfo';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { ScreenLoader } from '../screen-loader';
import { toast } from 'sonner';


const CookieChecker = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isPending, error } = useUserInfo();
  const user = data?.data;

   if (isPending) {
    return <ScreenLoader title="Checking authentication..." />
  }

  if (error) {
     router.replace('/auth/signin?next=' + pathname);
    return null;
  }

  if (
    user?.role === 'user' 
  ) {
    // Redirect admins away from /signup
    toast.error("You do not have access to this admin site");
    router.replace('/auth/signin?next=' + pathname);
    return null;
  }

  return <>{user ? children : null}</>;
};

export default CookieChecker;
