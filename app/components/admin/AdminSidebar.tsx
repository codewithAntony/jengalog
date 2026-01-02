"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarItems } from "@/app/(admin)/config/sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

const AdminSidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarItems] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={`relative z-10 transition-all duration-300 ease-in-out shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-full bg-[#1e1e1e] backdrop-blur-md p-4 flex flex-col border-r border-[#2f2f2f]">
        <button
          onClick={() => setIsSidebarItems(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-[#2f2f2f] text-white transition-colors max-w-fit cursor-pointer"
        >
          <Menu size={24} />
        </button>

        <nav className="mt-8 grow">
          {SidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-4 text-white text-sm font-medium rounded-lg hover:bg-[#2f2f2f] transition-colors mb-2 ${
                    pathname === item.href ? "bg-[#2f2f2f]" : ""
                  }`}
                >
                  <Icon size={20} style={{ minWidth: "20px" }} />
                  {isSidebarOpen && (
                    <span className="ml-4 whitespace-nowrap">{item.name}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
