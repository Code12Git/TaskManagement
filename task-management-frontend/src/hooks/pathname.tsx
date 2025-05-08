'use client';

import Navbar from '@/base/Navbar';
import { usePathname } from 'next/navigation';

export const usePath = () => {
  const pathname = usePathname();
  return pathname;
};

export const PathnameProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePath();
  const isHomepage = pathname === '/';
  const isLogin = pathname === '/login' || pathname === '/register';  
  
  return (
    <>
      {!(isHomepage || isLogin) && <Navbar />}
      {children}
    </>
  );
};