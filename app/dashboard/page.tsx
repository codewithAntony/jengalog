"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  return (
    <div>
      p
      <button
        className="uppercase font-semibold text-[#2E2E2E] px-6 py-2 border-black border-2 rounded-lg hover:bg-[#EBEBEB]"
        onClick={async () => {
          const supabase = getSupabaseBrowserClient();
          await supabase.auth.signOut();
          window.location.href = "/auth";
        }}
      >
        Sign out
      </button>
    </div>
  );
};

export default page;
