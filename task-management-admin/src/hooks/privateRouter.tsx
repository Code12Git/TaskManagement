'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/app/LoadingSpinner';

const publicRoutes = ['/admin'];

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Ensure this only runs on client side
    if (typeof window === 'undefined') return;

    const admin = localStorage.getItem('admin');
    const token = localStorage.getItem('token');

    const isPublicRoute = publicRoutes.includes(pathname);
    
    if (isPublicRoute) {
      setIsCheckingAuth(false);
      return;
    }

    if (!admin || !token) {
      router.replace('/admin'); // Use replace instead of push
      return;
    }

    try {
      const jwtPayload = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() >= jwtPayload.exp * 1000) {
        router.replace('/admin');
        return;
      }
    } catch (err) {
      console.log(err)
      router.replace('/admin');
      return;
    }

    setIsCheckingAuth(false);
  }, [router, pathname]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}