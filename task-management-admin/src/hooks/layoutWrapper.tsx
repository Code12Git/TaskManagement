"use client"
import  Sidebar  from '@/base/Sidebar'
import { usePathname } from "next/navigation";

function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");
  
    if (isAdminPage) {
      return <div className="w-full">{children}</div>;
    }
  
    return (
        <>
        <Sidebar />
      <div style={{ marginLeft: '20%', width: '80%' }}>
        {children}
      </div>
      </>
    );
  }

  export default LayoutWrapper;