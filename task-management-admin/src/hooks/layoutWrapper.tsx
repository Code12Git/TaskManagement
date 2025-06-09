"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/base/Sidebar';
import MobileSidebar from '@/ui/drawer/MobileSidebar';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const checkMobile = () => window.innerWidth < 950;
    
    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    // Set initial state
    setIsMobile(checkMobile());
    setIsLoaded(true);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isAdminPage) {
    return <div className="w-full">{children}</div>;
  }

  // Don't render anything until we've determined the screen size
  if (!isLoaded) return null;

  return (
    <>
      {isMobile ? (
        <MobileSidebar />
      ) : (
        <Sidebar />
      )}
      
      <div className={isMobile ? 'w-full' : 'ml-[20%] w-[80%]'}>
        {children}
      </div>
    </>
  );
}

export default LayoutWrapper;