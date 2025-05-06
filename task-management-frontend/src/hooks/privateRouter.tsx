'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import LoadingSpinner from '@/app/LoadingSpinner';

const publicRoutes = ['/login', '/register', '/', '/forgot-password'];

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { userData, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
     if (publicRoutes.includes(pathname)) {
      setIsCheckingAuth(false);
      return;
    }

     if (!userData || !token) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
      return;
    }

     const jwtPayload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= jwtPayload.exp * 1000) {
       router.push('/login?sessionExpired=true');
      return;
    }

    setIsCheckingAuth(false);
  }, [userData, token, router, pathname]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

