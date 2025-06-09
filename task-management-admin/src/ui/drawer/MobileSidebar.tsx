"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FiMenu, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const navItems = [
  { icon: "📊", label: "Dashboard", href: "/" },
  { icon: "📁", label: "Projects", href: "/projects" },
  { icon: "✅", label: "Tasks", href: "/tasks" },
  { icon: "👥", label: "Users", href: "/users" },
  { icon: "📅", label: "Calendar", href: "/calendar" },
  { icon: "💬", label: "Messages", href: "/messages" },
  { icon: "📈", label: "Reports", href: "/reports" },
  { icon: "⚙️", label: "Settings", href: "/settings" },
];

const MobileSidebar= () => {
    const router = useRouter();

  const handleLogout = async () => {
        localStorage.removeItem('admin')
        localStorage.removeItem('token')
        localStorage.removeItem('persist:root');
        router.push('/admin');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
      <Button 
  variant="ghost" 
  size="icon"
  className="bg-gray-100 cursor-pointer text-gray-800 shadow hover:bg-gray-300 border border-gray-300"
>
  <FiMenu className="h-6 w-6" />
</Button>

      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <div className="overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-center">Menu</DrawerTitle>
          </DrawerHeader>
          
          <div className="space-y-1 px-4">
            {navItems.map((item) => (
              <DrawerClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </DrawerClose>
            ))}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <FiLogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close Menu
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSidebar;