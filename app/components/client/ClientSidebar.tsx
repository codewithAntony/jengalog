"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarItems as AdminItems } from "@/app/(admin)/config/sidebar";
import { ClientSidebarItems } from "@/app/dashboard/(client)/ClientConfig/sidebar";
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { Menu } from "lucide-react";

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarItems] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    async function getRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setRole(data?.role || "client");
      }
    }
    getRole();
  }, [supabase]);

  const activeItems = role === "admin" ? AdminItems : ClientSidebarItems;

  return (
    <div
      className={`relative z-10 transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-full bg-[#1e1e1e] p-4 flex flex-col border-r border-[#2f2f2f]">
        <button
          onClick={() => setIsSidebarItems(!isSidebarOpen)}
          className="p-2 text-white"
        >
          <Menu size={24} />
        </button>

        <nav className="mt-8 grow">
          {activeItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-4 text-white text-sm font-medium rounded-lg hover:bg-[#2f2f2f] transition-colors mb-2 ${
                    pathname === item.href ? "bg-[#2f2f2f]" : ""
                  }`}
                >
                  <Icon size={20} />
                  {isSidebarOpen && <span className="ml-4">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
