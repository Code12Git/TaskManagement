'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/app/LoadingSpinner';

const publicRoutes = ['/login', '/register', '/', '/forgot-password' ];


export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const user = localStorage.getItem('user')
  const token = localStorage.getItem('token')
  useEffect(() => {
    const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith('/reset-password/');
     if (isPublicRoute) {
      setIsCheckingAuth(false);
      return;
    }

     if (!user || !token) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
      return;
    }

     const jwtPayload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= jwtPayload.exp * 1000) {
       router.push('/login?sessionExpired=true');
      return;
    }

    setIsCheckingAuth(false);
  }, [user, token, router, pathname]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

