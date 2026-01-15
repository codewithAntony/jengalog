"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import ke from "../../../public/images/ke.png";
import manager from "../../../public/images/manager.png";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";

const AdminHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";

  return (
    <header className="bg-[#1e1e1e] shadow-lg border-b border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg">
      <div className="w-full py-4 px-4 sm:px-6 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100">
          Dashboard
        </h1>
        <div className="flex items-center space-x-3 sm:space-x-6">
          <Image
            src={ke}
            alt="country-flag"
            width={25}
            height={18}
            className="rounded-full shadow-md cursor-pointer"
          />

          {/* <div className="relative">
            <Bell className="w-5 sm:w-6 h-5 sm:h-6 text-gray-300 cursor-pointer hover:text-white" />
          </div> */}

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src={user?.user_metadata?.avatar_url || manager}
              alt="admin"
              width={35}
              height={35}
              className="rounded-full bg-white border border-gray-600"
            />

            <span className="hidden sm:block text-gray-100 font-medium capitalize">
              {displayName}
            </span>

            <button
              className="uppercase font-semibold bg-emerald-500 hover:bg-emerald-500 text-black px-6 py-2 border-black border-2 rounded-lg"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/auth";
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
