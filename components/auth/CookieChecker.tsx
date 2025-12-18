'use client';

import useUserInfo from '@/hooks/useUserInfo';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ScreenLoader } from '../screen-loader';
import { toast } from 'sonner';


const CookieChecker = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isPending, error } = useUserInfo();
  const user = data?.data;

  useEffect(() => {
    if (error) {
      router.replace('/auth/signin?next=' + pathname);
    }

    if (user?.role === 'user') {
      toast.error("You do not have access to this admin site");
      router.replace('/auth/signin?next=' + pathname);
    }
  }, [error, user, router, pathname]);

  if (isPending) {
    return <ScreenLoader title="Checking authentication..." />
  }

  if (error || user?.role === 'user') {
    return null;
  }

  return <>{user ? children : null}</>;
};

export default CookieChecker;
