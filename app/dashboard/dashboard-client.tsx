"use client";

import { signOut } from "@/lib/actions/auth-actions";
import { useRouter } from "next/navigation";
import React from "react";

export default function DashboardClientPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };
  return (
    <div className="pt-10">
      <div>
        <button
          className="uppercase font-semibold text-[#2E2E2E] px-6 py-2 border-black border-2 rounded-lg hover:bg-[#EBEBEB]"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
